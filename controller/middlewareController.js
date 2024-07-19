const jwt = require('jsonwebtoken')


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

    }
}

module.exports = middlewareController