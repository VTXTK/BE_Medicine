const mongoose = require('mongoose')

const productSchenma = new mongoose.Schema({

    drugName: {
        //tên thuốc
        type: String,
        required: true,
        unique: true
    },
    productId: {
        type: String,
        required: true,
        unique: true
    },
    drugGroupName: {
        //tên nhóm thuốc
        type: String,

    },
    drugOrigin: {
        //nguồn gốc thuốc
        type: String,
        required: true,
    },
    manufacturersName: {
        //nhà sản xuất
        type: String,
        required: true,
    },
    quantity: {
        //số lượng 
        type: Number,
        required: true,
    },
    unitName: {
        //đơn vị tính
        type: String,
        required: true,
    },
    importPrice: {
        //giá nhập
        type: Number,

    },
    sellingPrice: {
        //giá bán 
        type: Number,

    },
    drugIngredients: {
        //thành phần thuốc
        type: String,
        required: true,
    },
    drugUses: {
        //Công dụng thuốc
        type: String,
        required: true,
    },
    howToUseDrug: {
        //cách dùng thuốc
        type: String,
        required: true,
    },
    slider: {
        type: Array
    },
    thumbnail: {
        type: String
    },
    sold: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

module.exports = mongoose.model("Product", productSchenma)