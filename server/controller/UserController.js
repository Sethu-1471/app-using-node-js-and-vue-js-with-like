const User = require('../models/User')
const Post = require('../models/Post')

const getUserAndPublicPostById = async(req, res, next) => {
    try {
        const user = await User.find({ _id: req.query.userId })
        const posts = await Post.find({ $and: [{status: "public"}, {userId: req.query.userId }] }).sort({ createdAt: 'desc' })
        res.status(200).json({
            status: true,
            message: "loading User Post",
            user: user,
            posts: posts
        })
    } catch (err) {
        res.json({
            status: false,
            message: "Unable to load post" + err,
            posts: null
        })
    }
}

const getUserbyUserId = async (req, res, next) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } 

    try {
       const user = await User.find({ _id: req.query.userId })
       res.json({
        status: true,
        message: "user success",
        user: user
    })
     } catch (err) {
        res.json({
            status: false,
            message: "Unable to get user"
        })
    }
}

const getToken = (headers) => {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

module.exports = { getUserAndPublicPostById, getUserbyUserId }