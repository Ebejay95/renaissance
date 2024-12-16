const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    val_3: {
        type: Number,
        required: true
    },
    val_4: {
        type: Number,
        required: true
    },
    val_5: {
        type: Number,
        required: true
    },
    val_6: {
        type: Number,
        required: true
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
});

module.exports = mongoose.model('Property', propertySchema);
