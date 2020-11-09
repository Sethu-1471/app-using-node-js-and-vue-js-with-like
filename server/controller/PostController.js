const Post = require('../models/Post')
var passport = require('passport');
require('../config/passport')(passport);
const User = require('../models/User')

const addPost = async(req, res, next) => {

    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } 

    // New post
    let newPost = new Post({
        content: req.body.content,
        userName: req.body.username,
        userId: req.body.userId,
        likes: 0,
        comments: 0,
        status: req.body.status,
        createdAt: req.body.createdAt
    })

    try {
        let userCheck = await User.findOne({ email: req.body.email });
        if (!userCheck) {
            res.json({
                status: false,
                message: "User not found"
            })
        } else {
            newPost.save().then(post => {
                res.status(200).json({
                 status: true,
                 message: "Posted"
        })
    }).catch(err => {
        res.json({
            status: false,
            message: "Error while Posting. Try again", err
        })
    })
        }
    } catch (err) {
        res.json({
            status: false,
            message: "Error while Posting. Try again", err
        })
    }

}


const getPost = async(req, res, next) => {
    try {
        const posts = await Post.find({ status: 'public' }).sort({ createdAt: 'desc' })
        res.status(200).json({
            status: true,
            message: "loading posts",
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

const updatePost = async (req, res, next) => {

    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } 
    
    try {

        let post = await Post.findById(req.query.postId)
    
        if (!post) {
            res.json({
                status: false,
                message: "post not found"
            })
        }
    
        if (post.userId != req.query.userId) {
            res.json({
                status: false,
                message: "post not updated by this user"
            })
        } else {
          story = await Post.findOneAndUpdate({ _id: req.query.postId }, req.body, {
            new: true,
            runValidators: true,
          })
    
          res.status(200).json({
            status: true,
            message: "Post updated"
        })
        }
      } catch (err) {
        res.json({
            status: false,
            message: "Unable to update post" + err,
        })
      }
}

const getByPostId = async (req, res, next) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } 

    try {
        const post = await Post.find({ _id: req.query.postId }).sort({ createdAt: 'desc' })
        
        if (post[0].userId != req.query.userId) {
            res.json({
                status: false,
                message: "Post is not updated by this user"
            })
        }
        res.status(200).json({
            status: true,
            message: "Now you can edit the post",
            post: post
        })
    } catch (err) {
        res.json({
            status: false,
            message: "Unable to load post" + err,
        })
    }


}

const getPostById = async (req, res, next) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } 

    try {
        const posts = await Post.find({ userId: req.query.userId }).sort({ createdAt: 'desc' })
        res.status(200).json({
            status: true,
            message: "loading posts",
            posts: posts
        })
    } catch (err) {
        res.json({
            status: false,
            message: "Unable to load post" + err
        })
    }
}

const deletePost = async(req, res, next) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } 
    
    Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) {
            res.json({
                status: false,
                message: "unable to delete",
            })
        }
        res.status(200).json({
            status: true,
            message: "Delete Success"
        })
      });
    
}

const actionLikePost = async(req, res, next) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } 
    
    try {let post = await Post.findById(req.query.postId)
        let user = await User.findById(req.query.userId)
    
        if (!post) {
            res.json({
                status: false,
                message: "post not found"
            })
        }
        
    
        await Post.findOneAndUpdate(
            { _id: req.query.postId },
            { $push: { likedUser: req.query.userId } }
        )
        
        const result = {
            message: user.name + " liked your post",
            time: Date.now()
                }        

        try {
            console.log(post.userId);
            await User.findOneAndUpdate(
                { _id: post.userId },
                {
                    $push: {
                        notify: result } }
                )
            } catch (err) {
                res.json({
                    status: false,
                    message: "Unable to send notification" + err,
                    posts: null
                })
                }
    
    
    const posts = await Post.find({ userId: req.query.userId }).sort({ createdAt: 'desc' })
    res.status(200).json({
        status: true,
        message: "liked",
        posts: posts
    })
    } catch (err) {
        res.json({
            status: false,
            message: "Unable to like post" + err,
        })
    }

}

const actionUnLikePost = async(req, res, next) => {
    var token = await getToken(req.headers);
    if (!token) {
        res.json({status: false, message: 'Unauthorized.'});
    } 
    
    try { 
        let post = await Post.findById(req.query.postId)
    
        if (!post) {
            res.json({
                status: false,
                message: "post not found"
            })
    }
    
    await Post.findOneAndUpdate(
        { _id: req.query.postId },
        { $pull: { likedUser: req.query.userId } }
    )
    
    const posts = await Post.find({ userId: req.query.userId }).sort({ createdAt: 'desc' })
    res.status(200).json({
        status: true,
        message: "Disliked",
        posts: posts
    })
    } catch (err) {
        res.json({
            status: false,
            message: "Unable to unlike post" + err
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
  

module.exports = { addPost, getPost, getPostById, deletePost, getByPostId, updatePost, actionLikePost, actionUnLikePost }