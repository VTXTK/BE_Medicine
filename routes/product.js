const middlewareController = require('../controller/middlewareController')
const router = require('express').Router()
const productController = require("../controller/productController")
const { replaceOne } = require('../model/Products')

router.post('/add', productController.addProduct)
router.delete('/:id', middlewareController.verifyTokenAdmin, productController.deleteProduct)
router.put('/:id', productController.updateProduct)
router.get('/:id', productController.detailProduct)
router.get('/', productController.getAllProduct)

module.exports = router