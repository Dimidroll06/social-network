const express = require('express');
const r = express.Router();

const checkAuth = require('../middleware/checkAuth');
const user = require('../controllers/userController');

r.put('/profilePicture', checkAuth(true), user.upload, user.setProfilePicture);
r.get('/:id', checkAuth(), user.getUser);

module.exports = r;