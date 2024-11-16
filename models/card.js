const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    epoch: {
        type: Number,
        required: true
    },
    recycle: {
        type: Boolean,
        required: true
    },
	revenues: [Number],
	state: {
        type: String,
        required: true,
        enum: ['stack', 'present', 'gone'],
    },
	type: {
        type: String,
        required: true
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
});

module.exports = mongoose.model('Card', cardSchema);
