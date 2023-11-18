const express = require('express');
const r = express.Router();

const auth = require('./auth');
const user = require('./user');

r.use('/auth', auth );
r.use('/user', user );

r.use((req, res) => {
    res.status(404).json({
        status: 404,
        error: {
            message: 'Method undefined!'
        }
    });
})

module.exports = r;