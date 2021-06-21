var express = require('express'),
	router = express.Router({ mergeParams: true }),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware');

//CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
	Comment.create(req.body.comment, (err, addedComment) => {
		if (err) {
			req.flash('info', {
				class: 'danger',
				icon: 'fas fa-exclamation-triangle',
				text: err.message
			});
			res.redirect('back');
		} else {
			addedComment.author.id = req.user._id;
			addedComment.author.username = req.user.username;
			addedComment.save();
			Campground.findById(req.params.id, (err, foundCamp) => {
				foundCamp.comments.push(addedComment);
				foundCamp.save();
			});
			req.flash('info', {
				class: 'success',
				icon: 'fas fa-check-circle',
				text: 'Comment added successfully'
			});
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

//UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, {runValidators: true}, (err, updateComment) => {
		if (err) {
			req.flash('info', {
				class: 'danger',
				icon: 'fas fa-exclamation-triangle',
				text: err.message
			});
			res.redirect('back');
		} else {
			req.flash('info', {
				class: 'success',
				icon: 'fas fa-check-circle',
				text: 'Comment updated successfully'
			});
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

//DESTROY
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, err => {
		if (err) {
			req.flash('info', {
				class: 'danger',
				icon: 'fas fa-exclamation-triangle',
				text: err.message
			});
			res.redirect('back');
		} else {
			req.flash('info', {
				class: 'success',
				icon: 'fas fa-check-circle',
				text: 'Comment deleted successfully'
			});
			res.redirect('back');
		}
	});
});

module.exports = router;