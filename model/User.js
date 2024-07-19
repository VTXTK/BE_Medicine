const mongoose = require('mongoose')

const userSchenma = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        default: "USER"
    },
    phone: {
        type: String,
        mlength: 11,

    },

    avatar: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("User", userSchenma)