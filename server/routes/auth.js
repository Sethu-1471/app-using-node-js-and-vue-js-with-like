const { Router } = require('express')
const express = require('express')
const passport = require('passport')
const router = express.Router()
const AuthController = require('../controller/AuthController')
const multer = require('multer');
var path = require('path')

// @desc    Register
// @route   GET /auth/register
router.post('/register', AuthController.register);

// @desc    Login
// @route   GET /auth/login
router.post('/login', AuthController.login);


module.exports = router