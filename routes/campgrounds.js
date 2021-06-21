var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleware = require('../middleware');

//INDEX - show all campgrounds
router.get('/', (req, res) => {
	var results = [];
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			req.flash('info', {
				class: 'danger',
				icon: 'fas fa-exclamation-triangle',
				text: err.message
			});
			res.redirect('back');
		} else {
			res.render('campgrounds/index', { campgrounds: campgrounds });
		}
	});
});

//NEW - show form to add new campgrounds
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

//CREATE - add campgrounds
router.post('/', middleware.isLoggedIn, (req, res) => {
	Campground.create(req.body, (err, addedCampground) => {
		if (err) {
			req.flash('info', {
				class: 'danger',
				icon: 'fas fa-exclamation-triangle',
				text: err.message
			});
			res.redirect('back');
		} else {
			addedCampground.author.id = req.user._id;
			addedCampground.author.username = req.user.username;
			addedCampground.save();
			req.flash('info', {
				class: 'success',
				icon: 'fas fa-check-circle',
				text: `${addedCampground.name} added successfully`
			});
			res.redirect(`/campgrounds/${addedCampground._id}`);
		}
	});
});

//SHOW - show detailed info about a campground
router.get('/:id', (req, res) => {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, foundCampground) => {
			if (err) {
				req.flash('info', {
					class: 'danger',
					icon: 'fas fa-exclamation-triangle',
					text: err.message
				});
				res.redirect('back');
			} else {
				res.render('campgrounds/show', { campground: foundCampground });
			}
		});
});

//EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			req.flash('info', {
				class: 'danger',
				icon: 'fas fa-exclamation-triangle',
				text: err.message
			});
			res.redirect('back');
		} else {
			res.render('campgrounds/edit', { campground: foundCampground });
		}
	});
});

//UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body,{runValidators: true}, (err, updatedCampground) => {
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
				text: `${updatedCampground.name} updated successfully`
			});
			res.redirect(`/campgrounds/${updatedCampground.id}`);
		}
	});
});

//DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, removedCampground) => {
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
				text: 'Campground deleted successfully'
			});
			Comment.deleteMany({_id: { $in: removedCampground.comments }},()=>{})
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;