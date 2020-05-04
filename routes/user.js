var express = require('express');
var router = express.Router();
var User = require('../models/user');
var middleware = require('../middleware/index');

router.get('/user/:id', middleware.isLoggedIn, (req, res) => {
	User.findById(req.params.id).populate('post').exec((err, user) => {
		if (err) {
			console.log(err);
		} else {
			res.render('User/show', { userInfo: user });
		}
	});
});

module.exports = router;
