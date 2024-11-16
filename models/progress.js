const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const progressSchema = new Schema({
    letter: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    group: {
        type: String,
        required: true
    },
	dependencies: [String],
	effects: [String],
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
});

module.exports = mongoose.model('Progress', progressSchema);
