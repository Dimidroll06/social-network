const mongoose = require('mongoose');
const { uuid } = require('uuidv4');

// по факту это схема сессии JWT
const TokenSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },

    token: {
        type: String,
        required: true
    },

    name: {
        type: String,
        default: uuid
    }

});

module.exports = mongoose.model('token', TokenSchema);