const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: String,
		default: Date.now
	},
	inventory: {
		games: [{
			title: {
				type: String,
				default: ''
			},
			cdkey: {
				type: String,
				default: ''
			},
			_id:false
		}]
	},
	role: {
		type: Boolean,
		default: false
	}

});
const User = mongoose.model('User', UserSchema);

module.exports = User;
