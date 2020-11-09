const express = require('express')
const router = express.Router()
const PostController = require('../controller/PostController')
const passport = require('passport')
require('../config/passport')(passport);

router.post('/add', passport.authenticate('jwt', { session: false}), PostController.addPost)

router.put('/update', passport.authenticate('jwt', { session: false}), PostController.updatePost)

router.get('/', PostController.getPost)

router.get('/getbyid', passport.authenticate('jwt', { session: false }), PostController.getPostById)

router.get('/getbypostid', passport.authenticate('jwt', { session: false }), PostController.getByPostId)

router.delete('/:id',passport.authenticate('jwt', { session: false }), PostController.deletePost)

router.put('/likeaction',passport.authenticate('jwt', { session: false }), PostController.actionLikePost)

router.put('/unlikeaction',passport.authenticate('jwt', { session: false }), PostController.actionUnLikePost)

module.exports = router