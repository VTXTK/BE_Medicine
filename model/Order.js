const mongoose = require('mongoose')

const orderSchenma = new mongoose.Schema({
    idUser: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    name: {
        type: String, required: true,
    },
    address: {
        type: String, required: true,
    },
    phone: {
        type: String, required: true,
    },
    totalPrice: {
        type: Number, required: true,
    },
    state: {
        type: String, required: true,
        default: "Đang xử lý"
    },
    detail: {
        type: Array,
        require: true
    }

}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchenma)