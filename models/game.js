const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		required: true
	},
	last_action_at: {
		type: Date,
		required: true
	},
	users: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	data: [{
		type: String,
	}]
});

module.exports = mongoose.model('Game', gameSchema);
