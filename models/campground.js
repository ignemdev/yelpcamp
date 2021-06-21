const mongoose = require('mongoose'),
Comment = require('./comment');

let CampgroundSchema = new mongoose.Schema({
	name:  {type: String, required: true},
	price:  {type: Number, required: true},
	image:  {type: String, required: true},
	description:  {type: String, required: true},
	createdAt: { type: Date, default: Date.now },
	comments: [
		{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'comments'
		}
	],
	author: {
		id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
		},
		username: String
	}
});

module.exports = mongoose.model('campgrounds', CampgroundSchema);