const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shipSchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
});

module.exports = mongoose.model('Ship', shipSchema);
