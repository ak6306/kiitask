var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Email = require('../models/email');

router.get('/', (req, res) => {
	res.render('index');
});

//=================Auth Routes========================
router.get('/register', (req, res) => {
	res.render('register');
});
router.post('/register', (req, res) => {
	if (!req.body.email.includes('kiit.ac.in')) {
		req.flash('error', 'Please use a kiit.ac.in Email id only.');
		res.redirect('/register');
	} else {
		Email.find({ emailId: req.body.email }, (err, foundMail) => {
			if (foundMail.length > 0) {
				req.flash('error', 'Email Already Registered!');
				res.redirect('/register');
			} else {
				Email.create({ emailId: req.body.email });
				var newUser = new User({
					username: req.body.username,
					school: req.body.school,
					year: req.body.year,
					email: req.body.email
				});
				User.register(newUser, req.body.password, (err, user) => {
					if (err) {
						console.log(err);
						return res.render('register', { err: err });
					}
					passport.authenticate('local')(req, res, function() {
						req.flash('success', 'Registration successfull. Hello ' + req.user.username + '!');
						res.redirect('/posts');
					});
				});
			}
		});
	}
});
router.get('/login', (req, res) => {
	res.render('login');
});
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/posts',
		failureRedirect: '/login',
		failureFlash: true
	}),
	(req, res) => {}
);
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', "You 've been logged out");
	res.redirect('/');
});
router.get('/error', (req, res) => {
	res.render('error');
});
router.get('/faq', (req, res) => {
	res.render('faq');
});

module.exports = router;
