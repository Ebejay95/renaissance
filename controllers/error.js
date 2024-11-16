const User = require('../models/user');

exports.get404 = async (req, res, next) => {
    try {
        let user = null;
        if (req.session?.user?._id) {
            user = await User.findById(req.session.user._id).populate('name');
			console.log(user)
        }

        res.status(404).render('404', {
            pageTitle: 'Page Not Found',
            path: '/404',
            user: user
        });
    } catch (err) {
        console.error('Error in 404 handler:', err);
        res.status(404).render('404', {
            pageTitle: 'Page Not Found',
            path: '/404',
            user: null
        });
    }
};
