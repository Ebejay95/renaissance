const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: true
    },
    debug: true
});

async function verifyEmailSetup() {
    try {
        await transporter.verify();
        console.log('SMTP-Verbindung erfolgreich verifiziert');
        return true;
    } catch (error) {
        console.error('SMTP-Verbindungsfehler:', error);
        return false;
    }
}

async function sendEmail(options) {
    try {
        const info = await transporter.sendMail(options);
        console.log('E-Mail erfolgreich gesendet:', info.response);
        return info;
    } catch (error) {
        console.error('E-Mail-Versand fehlgeschlagen:', error);
        throw error;
    }
}

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        user: false,
        formData: {}
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Registrieren',
        user: false,
        formData: {}
    });
};

exports.getPwGen = (req, res, next) => {
    res.render('auth/pw-gen', {
        path: '/pw-gen',
        pageTitle: 'Neues PW erstellen',
        user: false,
        formData: {}
    });
};

exports.processPwGen = async (req, res, next) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email: email });
        
        if (!user) {
            req.flash('error', 'Die E-Mail-Adresse ' + email + ' ist keinem Konto zugeordnet.');
            return res.redirect('/pw-gen');
        }

        const buffer = await new Promise((resolve, reject) => {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) reject(err);
                resolve(buffer);
            });
        });
        
        const token = buffer.toString('hex');
        
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        
        await user.save();

        const resetUrl = `${process.env.BASE_URL}/reset/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Renaissance Passwort zurücksetzen',
            html: `
                <h1>Renaissance Passwort zurücksetzen</h1>
                <p>Sehr geehrte(r) Nutzer(in),</p>
                <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
                <p>Klicken Sie auf den folgenden Link, um ein neues Passwort zu erstellen:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>Der Link ist eine Stunde gültig und kann nur einmal verwendet werden.</p>
                <p>Falls Sie kein neues Passwort angefordert haben, ignorieren Sie diese E-Mail bitte.</p>
                <br>
                <p>Mit freundlichen Grüßen</p>
                <p>Ihr Support-Team</p>
            `
        };

        await sendEmail(mailOptions);
        
        req.flash('success', 'Eine E-Mail zum Zurücksetzen Ihres Passworts wurde an ' + user.email + ' gesendet.');
        res.redirect('/');

    } catch (error) {
        console.error('Fehler beim Passwort-Reset-Prozess:', error);
        req.flash('error', 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        res.redirect('/pw-gen');
    }
};

exports.getReset = async (req, res, next) => {
    const token = req.params.token;
    
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Der Reset-Link ist ungültig oder bereits abgelaufen.');
            return res.redirect('/pw-gen');
        }

        res.render('auth/reset', {
            path: '/reset',
            pageTitle: 'Neues Passwort erstellen',
            userId: user._id.toString(),
            passwordToken: token,
            user: false
        });

    } catch (error) {
        console.error('Fehler beim Aufrufen der Reset-Seite:', error);
        req.flash('error', 'Ein Fehler ist aufgetreten.');
        res.redirect('/pw-gen');
    }
};

exports.postReset = async (req, res, next) => {
    const { password, userId, passwordToken } = req.body;
    
    try {
        const user = await User.findOne({
            _id: userId,
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Der Reset-Link ist ungültig oder bereits abgelaufen.');
            return res.redirect('/pw-gen');
        }

        if (password.length < 8) {
            req.flash('error', 'Das Passwort muss mindestens 8 Zeichen lang sein.');
            return res.redirect('back');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        
        await user.save();

        req.flash('success', 'Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt anmelden.');
        res.redirect('/login');

    } catch (error) {
        console.error('Fehler beim Zurücksetzen des Passworts:', error);
        req.flash('error', 'Ein Fehler ist aufgetreten.');
        res.redirect('/pw-gen');
    }
};


exports.postLogin = (req, res, next) => {
	const { email, password } = req.body;
  
	User.findOne({ email: email })
	  .then(user => {
		if (!user) {
		  	req.flash('error', 'Der Benutzer mit der E-Mail-Adresse ' + email + ' existiert nicht.');
		 	return res.render('auth/login', {
				path: '/login',
				pageTitle: 'Login',
				user: false,
				formData: { email }
			});
		}
		
		bcrypt.compare(password, user.password, (err, result) => {
			if (err) {
				console.log(err);
				req.flash('error', 'Ein Fehler ist beim Vergleich der Passwörter aufgetreten.');
				return res.render('auth/login', {
				   path: '/login',
				   pageTitle: 'Login',
				   user: false,
				   formData: { email }
			   });
			}
			
			if (result) {
				req.session.user = true;
				req.session.user = user;
				req.session.save(err => {
					if (err) {
						console.log(err);
					}
					res.redirect('/');
				});
			} else {
				req.flash('error', 'Ungültige E-Mail-Adresse oder Passwort.'); 
				return res.render('auth/login', {
				   path: '/login',
				   pageTitle: 'Login',
				   user: false,
				   formData: { email }
			   });
			}
		});
	  })
	  .catch(err => console.log(err));
};
  
exports.validateUserName = (req, res, next) => {
    const { name } = req.body;
	
    const nameRegex = /^[a-z0-9_]+$/;
    if (!nameRegex.test(name)) {
        return res.send('false')
    }
    
    User.findOne({ name: name }, (err, user) => {
        if (err) {
            console.error("Error checking username uniqueness:", err);
            return res.send('false');
        }
        
        if (user) {
            return res.send('not-unique');
        } else {
            return res.send('true');
        }
    });
};

exports.postSignup = (req, res, next) => {
	const { name, email, password } = req.body;

	const nameRegex = /^[a-z0-9_]+$/;
	if (!nameRegex.test(name)) {
		req.flash('error', 'Der Name darf nur kleine Buchstaben, Zahlen und Unterstriche enthalten.');
		return res.render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			user: false,
			formData: { name, email }
		});
	}
	if (!password) {
		req.flash('error', 'Es ist ein Passwort erforderlich');
		return res.render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			user: false,
			formData: { name, email }
		});
	}
	if (password.length < 8) {
		req.flash('error', 'Das Passwort muss mind. 8 Zeichen lang sein.');
		return res.render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			user: false,
			formData: { name, email }
		});
	}
	bcrypt.hash(password, 10, (err, hashedPassword) => {
	  if (err) {
		return next(err);
	  } 
	  const user = new User({
		name: name,
		email: email,
		password: hashedPassword
	  });
	  user.save()
		.then(() => {
			req.flash('success', 'Benutzer wurde erfolgreich angelegt');
			res.redirect('/login');
		})
		.catch(err => {
			console.log(err);
			if(err.code = 11000 && err.keyPattern){
				if(err.keyPattern.email){
					req.flash('error', 'Es existiert bereit ein Benutzer mit ' + err.keyPattern.email);
				}
				if(err.keyPattern.name){
					req.flash('error', 'Es existiert bereit ein Benutzer mit ' + err.keyValue.name);
				}
			} else {
				req.flash('error', 'Benutzer konnte nicht angelegt werden');
			}
			return res.render('auth/signup', {
				path: '/signup',
				pageTitle: 'Signup',
				user: false,
				formData: { name, email }
			});
		});
	});
  };

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.authRedirect = (req, res, next) => {
	if(!req.session.user){
		req.flash('notice', 'Die Anmeldung ist nicht gültig.');
		return res.render('game/index', {
			path: '/',
			pageTitle: 'Renaissance',
			user: req.session.user
		});
	}
};






