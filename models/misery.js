const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const miserySchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
});

module.exports = mongoose.model('Misery', miserySchema);
