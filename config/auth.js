module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg', 'Please log in to view this resource');
		res.redirect('/users/login');

	},
	ensureAuthenticatedAdmin: function (req, res, next) {
		if (req.isAuthenticated()) {
			if (req.user.role === true) {
				return next();
			}
		}
		req.flash('error_msg', 'Please log in AS ADMIN to view this resource');
		res.redirect('/users/login');
	},
	ensureNotAuthenticated: function (req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect('/');
	}
};
