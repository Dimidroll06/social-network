const mongoose = require('mongoose');
const { uuid } = require('uuidv4');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
        default: 'default.png'
    },

    link: {
        type: String,
        default: uuid
    },

    password: {
        type: String,
        required: true
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema);