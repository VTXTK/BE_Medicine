const middlewareController = require("../controller/middlewareController")
const userController = require("../controller/userController")
const router = require('express').Router()

router.get("/", middlewareController.verifyToken, userController.getAllUser)
router.get("/customer", middlewareController.verifyToken, userController.getAllCus)
router.delete("/:id", middlewareController.verifyTokenAdmin, userController.deleteUser)
router.get('/:id', middlewareController.verifyToken, userController.getUser)
router.put("/:id", middlewareController.verifyToken, userController.updateUser)
router.post("/changePass", middlewareController.verifyToken, userController.changePassword)
module.exports = router