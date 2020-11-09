const moongose = require('mongoose')

const UserSchema = new moongose.Schema({
    name: {
        type: String
    },
    email: {
         type: String
    },
    contact: {
        type: String
    },
    password: {
        type: String
    },
    notify: {
        type: []
    },
    registeredAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
})

module.exports = moongose.model('User', UserSchema)