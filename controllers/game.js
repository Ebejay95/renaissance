exports.getIndex = (req, res, next) => {
	res.render('game/index', {
	  path: '/',
	  pageTitle: 'Renaissance',
	  isAuthenticated: false
	});
  };