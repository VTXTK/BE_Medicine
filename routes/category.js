const router = require('express').Router()
const categoryController = require('../controller/categoryController')
router.get('/', categoryController.getAllCategory)
router.post('/add', categoryController.addCategory)
module.exports = router