const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

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


exports.processPwGen = (req, res, next) => {
	const { email } = req.body;
	
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				req.flash('error', 'Die E-Mail-Adresse ' + email + ' ist keinem Konto zugeordnet.');
				return res.redirect('/pw-gen');
			}

			// Generate unique token
			crypto.randomBytes(32, (err, buffer) => {
				if (err) {
					console.log(err);
					req.flash('error', 'Ein Fehler ist beim Generieren des Tokens aufgetreten.');
					return res.redirect('/pw-gen');
				}
				const token = buffer.toString('hex');
				
				// Save token to user document
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000; // Token expiration time: 1 hour
				
				user.save()
					.then(() => {
						// Send email with token link
						const transporter = nodemailer.createTransport({
							service: process.env.EMAIL_SERVICE,
							auth: {
								user: process.env.EMAIL_USER,
								pass: process.env.EMAIL_PASSWORD
							}
						});
						
						const mailOptions = {
							from: process.env.EMAIL_USER,
							to: user.email,
							subject: 'Passwort zurücksetzen',
							html: `
								<p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
								<p>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</p>
								<p><a href="${process.env.RESET_PASSWORD_URL}${token}">Passwort zurücksetzen</a></p>
							`
						};
						
						transporter.sendMail(mailOptions, (error, info) => {
							if (error) {
								console.log(error);
								req.flash('error', 'Ein Fehler ist beim Senden der E-Mail aufgetreten.');
								return res.redirect('/pw-gen');
							}
							console.log('Email sent: ' + info.response);
							req.flash('success', 'Eine E-Mail zum Zurücksetzen Ihres Passworts wurde an ' + user.email + ' gesendet.');
							res.redirect('/');
						});
					})
					.catch(err => {
						console.log(err);
						req.flash('error', 'Ein Fehler ist beim Speichern des Tokens aufgetreten.');
						return res.redirect('/pw-gen');
					});
			});
		})
		.catch(err => console.log(err));
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
				console.log(err); // Log any error that occurs during comparison
				req.flash('error', 'Ein Fehler ist beim Vergleich der Passwörter aufgetreten.'); // Notify user about the error
				return res.render('auth/login', {
				   path: '/login',
				   pageTitle: 'Login',
				   user: false,
				   formData: { email }
			   });
			}
			
			if (result) {
				// Passwords match, handle successful login
				req.session.user = true; // Set session variables
				req.session.user = user;
				req.session.save(err => {
					if (err) {
						console.log(err);
					}
					res.redirect('/');
				});
			} else {
				// Passwords don't match, handle incorrect password
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
        return res.send('false'); // If the name doesn't match the format, return false
    }
    
    // Assuming you have a User model for interacting with the database
    User.findOne({ name: name }, (err, user) => {
        if (err) {
            console.error("Error checking username uniqueness:", err);
            return res.send('false'); // If an error occurs, return false
        }
        
        if (user) {
            // If a user with the same name already exists, return false
            return res.send('not-unique');
        } else {
            // If the username is unique, return true
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






