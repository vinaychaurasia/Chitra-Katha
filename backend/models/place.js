const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a title!"]
    },

    description: {
        type: String,
        required: [true, "Please enter a title!"],
        minlength: [5, "Please enter description (atlease 5 characters)!"]
    },

    image: {
        type: String,
        required: [true, "Please enter an image!"]
    },

    address: {
        type: String,
        required: [true, "Please enter a title!"]
    },

    location: {
        lat: { type: Number, required: true},
        lng: { type: Number, required: true}
    },

    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Place', PlaceSchema);