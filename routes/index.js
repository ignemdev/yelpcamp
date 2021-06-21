var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user'),
	middleware = require('../middleware');

//routes
router.get('/', (req, res) => {
	res.render('landing');
});

//SHOW SIGN UP - show register form
router.get('/register', (req, res) => {
	res.render('register');
});

//SIGN UP - registration logic
router.post('/register', (req, res) => {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash('info', {
				class: 'danger',
				icon: 'fas fa-exclamation-triangle',
				text: err.message
			});
			return res.redirect('register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('info', {
				class: 'success',
				icon: 'fas fa-check-circle',
				text: `Welcome ${req.user.username}`
			});
			res.redirect('/campgrounds');
		});
	});
});

//SHOW SIGN IN - show login form
router.get('/login', (req, res) => {
	res.render('login');
});

//SIGN IN - login logic
router.post('/login', (req, res, next) => {
	passport.authenticate('local', (info, user, err) => {
		if (err || !user) {
			req.flash('info', {
				class: 'danger',
				icon: 'fas fa-exclamation-triangle',
				text: err.message
			});
			res.redirect('/login');
		} else {
			req.logIn(user, err => {
				if (err) {
					req.flash('info', {
						class: 'danger',
						icon: 'fas fa-exclamation-triangle',
						text: err.message
					});
					res.redirect('/login');
				} else {
					res.redirect('/campgrounds');
				}
			});
		}
	})(req, res, next);
});

//LOGUT - logic
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('info', {
		class: 'success',
		icon: 'fas fa-check-circle',
		text: 'Successfully logged out!'
	});
	res.redirect('/campgrounds');
});

module.exports = router;