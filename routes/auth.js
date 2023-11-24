const express = require('express');
const r = express.Router();

const validate = require('../middleware/validators/UserValidator');
const user = require('../controllers/userController');

r.post('/register', validate.register, user.register);
r.post('/login', validate.login, user.login);
// r.post('/refresh') // TODO

module.exports = r;