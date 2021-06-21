const mongoose = require('mongoose');

let CommentSchema = new mongoose.Schema({
	text: {type: String, required: true},
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users'
		},
		username: String
	},
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('comments',CommentSchema);