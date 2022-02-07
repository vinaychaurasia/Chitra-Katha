const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a valid name']
    },
    email: {
        type: String,
        require: [true, 'Please enter a valid E-mail address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a valid password'],
        minlength: 8
    },
    image: {
        type: String,
        require: true
    },
    places: [
        {
            type: mongoose.Types.ObjectId,
            require: true,
            ref: 'Place'
        }
    ]
});

// userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);