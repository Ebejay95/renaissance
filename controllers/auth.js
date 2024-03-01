const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('624eaaefadbc11c214d1442a')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const { name, email, password } = req.body;
  
	// Überprüfe, ob das Passwort vorhanden ist
	if (!password) {
	  return res.status(400).send("Passwort ist erforderlich.");
	}
  
	// Führe die weitere Verarbeitung nur aus, wenn das Passwort vorhanden ist
	// Führe die Hash- und Speicherlogik wie zuvor durch
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
		  res.redirect('/login');
		})
		.catch(err => {
		  console.log(err);
		  res.redirect('/signup');
		});
	});
  };

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
