const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
	game_id: {
		type: Number,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	inventory: [{
		cdkey: {
			type: String,
			default: ''
		},
		_id:false
	}],
	picture: {
		type: String,
		required: true

	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	genre:{
		type: String,
		required: true
	},
	publisher:{
		type: String,
		required: true
	}
});


const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
