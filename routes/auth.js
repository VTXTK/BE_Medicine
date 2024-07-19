const router = require('express').Router()
const autController = require('../controller/authController')
const middlewareController = require("../controller/middlewareController")


router.post("/register", autController.registertUser)

router.post("/login", autController.loginUser)

router.post("/google", autController.loginFromGG)

router.get("/refresh", autController.requestRefreshToken)

router.post("/logout", middlewareController.verifyToken, autController.userLogout)

router.get("/account", middlewareController.verifyToken, autController.getAccount)

module.exports = router