const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const partySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
	inGameAt: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
});

module.exports = mongoose.model('Party', partySchema);
