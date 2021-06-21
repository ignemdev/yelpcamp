const User = require('../models/user'),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middlewaresObj = {};

middlewaresObj.checkCampgroundOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				req.flash('info', { class: 'danger',icon:'fas fa-exclamation-triangle', text: err.message });
				res.redirect('back');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					return next();
				}
				req.flash('info', { class: 'danger',icon:'fas fa-exclamation-triangle', text: 'You need permission to do that' });
				res.redirect('back');
			}
		});
	} else {
		req.flash('info', { class: 'danger',icon:'fas fa-exclamation-triangle', text: 'You need to be logged in.' });
		res.redirect('/login');
	}
};

middlewaresObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				req.flash('info', { class: 'danger',icon:'fas fa-exclamation-triangle', text: err.message });
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					return next();
				}
				req.flash('info', { class: 'danger',icon:'fas fa-exclamation-triangle', text: 'You need permission to do that' });
				res.redirect('back');
			}
		});
	} else {
		req.flash('info', { class: 'danger',icon:'fas fa-exclamation-triangle',text: 'You need to be logged in.' });
		res.redirect('/login');
	}
};

middlewaresObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('info', { class: 'danger',icon:'fas fa-exclamation-triangle', text: 'You need to be logged in.' });
	res.redirect('/login');
};

module.exports = middlewaresObj;