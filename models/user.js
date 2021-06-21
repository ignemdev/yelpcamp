const mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
	username: {type: String, required: true},
	password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', UserSchema);
