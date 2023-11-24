const express = require('express');
const r = express.Router();

const checkAuth = require('../middleware/checkAuth');
const user = require('../controllers/userController');
const validator = require('../middleware/validators/UserValidator');

r.put('/profilePicture', checkAuth(true), user.upload, user.setProfilePicture);
r.get('/:id', checkAuth(), validator.getUser, user.getUser);
r.get('/', validator.getUsers, user.getUsers);

module.exports = r;