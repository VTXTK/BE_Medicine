const router = require('express').Router()
const dashboardController = require('../controller/dashboardController')
const middlewareController = require("../controller/middlewareController")

router.get('/', middlewareController.verifyTokenAdmin, dashboardController.getData)
module.exports = router