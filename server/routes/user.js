const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')
const passport = require('passport')
require('../config/passport')(passport);

router.get('/getUserAndPublicPostById', UserController.getUserAndPublicPostById);

router.get("/", passport.authenticate('jwt', { session: false }), UserController.getUserbyUserId)

module.exports = router