const moongose = require('mongoose')

const UserSchema = new moongose.Schema({
    content: {
        type: String
    },
    userName: {
         type: String
    },
    userId: {
        type: String
    },
    likes: {
        type: String
    },
    comments: {
        type: String
    },
    likedUser: {
        type: [String]
    },
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true
    },
})

module.exports = moongose.model('Posts', UserSchema)