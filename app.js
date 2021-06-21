//express & utilities
const express = require('express'),
	expressSession = require('express-session'),
	sessionOptions = {
	secret: `${process.env.SESSCT}`,
	resave: false,
	saveUninitialized: false
},
	app = express(),
	bodyparser = require('body-parser'),
	methodOverride = require('method-override'),
	flash = require('connect-flash');

//security
const passport = require('passport'),
	localStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose');

//db
const mongoose = require('mongoose'),
	User = require('./models/user'),
	dbOptions = {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true
	};

//routes
const commentsRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

//app config
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());

//db connection
mongoose.connect(process.env.DBSTR, dbOptions);

//session
app.use(expressSession(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//global middlewares & variables
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.active = req.path.split('/')[1];
	res.locals.message = req.flash('info');
	res.locals.moment = require('moment');
	next();
});

//routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);
app.use(indexRoutes);

//server listener
app.listen(process.env.PORT, () => {});