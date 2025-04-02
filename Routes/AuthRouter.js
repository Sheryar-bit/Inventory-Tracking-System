const express = require('express');
const { register, login } = require('../controllers/AuthController');
const Authrouter = express.Router();

Authrouter.post('/register', register);
Authrouter.post('/login', login);

module.exports = Authrouter;