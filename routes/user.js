const express = require('express');
const r = express.Router();

const checkAuth = require('../middleware/checkAuth');
const user = require('../controllers/userController');

r.put('/profilePicture', checkAuth, user.upload, user.setProfilePicture);

module.exports = r;