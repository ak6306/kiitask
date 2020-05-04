var middlewareObj = {};
var Post = require('../models/post');
middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'Please Login First!');
	res.redirect('/login');
};
middlewareObj.isOwner = function(req, res, next) {
	if (req.isAuthenticated()) {
		Post.findById(req.params.id, (err, foundPost) => {
			if (err) {
				res.redirect('back');
			} else {
				if (foundPost.author.id.equals(req.user.id)) {
					next();
				} else {
					res.render('err', { err: err });
				}
			}
		});
	}
};
module.exports = middlewareObj;
