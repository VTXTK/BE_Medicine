const jwt = require('jsonwebtoken')
const rateLimit = require("express-rate-limit");

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization
        if (token) {
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.JWK_SUCCES_KEY, (err, user) => {
                if (err) {
                    return res.json("Token is not valid")
                }
                req.user = user
                next();
            })
        }
        else {
            res.status(401)
            res.json("You're not authenticated")
        }
    },
    verifyTokenAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {

            if (req.user.role == "ADMIN") {
                next()
            }
            else {
                res.status(403)
                res.json("You're not allowed to delete other")
            }

        })

    },
    loginLimiter: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 phút
        max: 5, // Giới hạn mỗi IP 5 yêu cầu đăng nhập mỗi 15 phút
        message: "Quá nhiều lần đăng nhập từ IP này, vui lòng thử lại sau 15 phút"
    }),
}

module.exports = middlewareController