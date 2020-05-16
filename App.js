var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var Post = require('./models/post');
var Comment = require('./models/comment');
var postRoutes = require('./routes/post');
var indexRoutes = require('./routes/index');
var userRoutes = require('./routes/user');
var flash = require('connect-flash');
//==========Setup============
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(flash());

const uri = process.env.ATLAS_URI; //paste your connection uri here.
mongoose
	.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
	.then((res) => console.log('Connection Established to DataBase!'))
	.catch((err) => console.log(err));

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('MongoDb Connection Established!');
});
app.use(
	require('express-session')({
		secret: 'This is a authentication message from KIITASK! ',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.userInfo = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use(indexRoutes);
app.use(postRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 3000;
	app.listen(process.env.PORT, function() {
	console.log('The KIIT ASK server has started! ');
	console.log(`Listing on port ${PORT}`);
});
