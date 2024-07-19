const mongoose = require('mongoose')

const categorySchenma = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
})

module.exports = mongoose.model("Category", categorySchenma)