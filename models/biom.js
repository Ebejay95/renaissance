const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const biomSchema = new Schema({
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
	revenues: [Number],
	epoch: {
        type: String
    },
	availability: {
        type: String,
        required: true,
        enum: ['neutral', 'shortage', 'abdundance'],
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
});

module.exports = mongoose.model('Biom', biomSchema);
