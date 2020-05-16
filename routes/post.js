var express = require('express');
var router = express.Router();
const anchorme = require('anchorme').default;
var Post = require('../models/post');
var Comment = require('../models/comment');
var User = require('../models/user');
var middleware = require('../middleware/index');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var username = process.env.username;
var password = process.env.password;
var transporter = nodemailer.createTransport(
	smtpTransport({
		service: 'gmail',
		auth: {
			user: username,
			pass: password
		}
	})
);

router.get('/posts', (req, res) => {
	Post.find({}).sort({ _id: -1 }).exec((err, posts) => {
		if (err) {
			console.log(err);
		} else {
			res.render('Post/posts', { posts: posts, userInfo: req.user });
		}
	});
});
router.post('/posts', middleware.isLoggedIn, (req, res) => {
	var title = req.body.title;
	var description = anchorme(req.body.description);
	var author = {
		id: req.user.id,
		username: req.user.username,
		school: req.user.school,
		year: req.user.year,
		email: req.user.email
	};
	var newPost = { title: title, description: description, author: author };
	Post.create(newPost)
		.then((post) => {
			console.log('New Post added Successfully! ' + post);
			req.user.post.push(post._id);
			req.user.save();
			res.redirect('/posts');
		})
		.catch((err) => console.log(err));
});

router.get('/posts/new', (req, res) => {
	res.render('Post/new');
});

router.get('/posts/:id', (req, res) => {
	Post.findById(req.params.id).populate('comment').exec((err, foundPost) => {
		if (err) {
			console.log(err);
		} else {
			res.render('Post/show', { foundPost: foundPost });
		}
	});
});
router.post('/posts/:id/new', middleware.isLoggedIn, (req, res) => {
	Post.findById(req.params.id, (err, post) => {
		if (err) {
			console.log(err);
			res.redirect('/posts');
		} else {
			var commentBody = anchorme(req.body.commentContent);
			var newComment = {
				text: commentBody,
				author: req.user.username
			};
			Comment.create(newComment)
				.then((comment) => {
					User.findById(req.user.id, (err, user) => {
						user.comment.push(comment);
						user.save();
					});
					post.comment.push(comment);
					post.save().then(() => {
						var mailOptions = {
							from: 'KIIT ASK<username>',
							to: post.author.email,
							subject: 'Notification from KIIT ASK',
							html:
								'<h1>Hello!</h1><br><h3>Someone commeted on one of your posts.</h3><br><a href="https://kiitask.herokuapp.com/posts/' +
								post.id +
								'">Click here to view your post on KIIT ASK.</a><hr>'
						};
						transporter.sendMail(mailOptions, function(error, info) {
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
						});
						res.redirect('/posts/' + post.id);
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	});
});
router.post('/post/search', (req, res) => {
	Post.find({
		$or: [
			{ title: { $regex: req.body.search, $options: 'i' } },
			{ description: { $regex: req.body.search, $options: 'i' } }
		]
	})
		.populate('comment')
		.exec((err, posts) => {
			if (err) {
				res.render('error', { err: err });
			} else {
				console.log(posts);
				res.render('Post/posts', { posts: posts, userInfo: req.user });
			}
		});
});
router.delete('/posts/:id', middleware.isOwner, (req, res) => {
	Post.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('error', { err: err });
		} else {
			res.redirect('/user/' + req.user.id);
		}
	});
});
router.delete('/posts/:id/:commentId', middleware.isLoggedIn, (req, res) => {
	Comment.findByIdAndDelete(req.params.commentId, (err) => {
		if (err) {
			res.redirect('error', { err: err });
		} else {
			res.redirect('/posts/' + req.params.id);
		}
	});
});

module.exports = router;
