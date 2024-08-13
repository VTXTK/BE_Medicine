const User = require("../model/User")
const bcrypt = require("bcrypt");
const { json } = require("express");
const jwt = require('jsonwebtoken')
const { body, validationResult } = require("express-validator");
let refreshTokens = []
const autController = {
    registertUser: async (req, res) => {
        try {
            //Kiểm tra xem đầu vào có phải là email hợp lệ không
            await body('email').isEmail().normalizeEmail().run(req);
            // Đảm bảo mật khẩu có độ dài ít nhất 6 ký tự
            await body('password').isLength({ min: 6 }).trim().run(req);

            console.log(`Email sau khi normalize: ${req.body.email}`);
            console.log(`Password sau khi trim: ${req.body.password}`);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt)
            console.log(`hashed : ${hashed}`)
            const userTest = await User.find()
            let id
            do {
                id = Math.floor(Math.random() * 100000000) + 1;
            } while (userTest.includes(id))
            const userId = `KH${id}`
            //tao user
            const newUser = await new User({
                email: req.body.email,
                userId: userId,
                fullName: req.body.fullName,
                password: hashed,
                phone: req.body.phone,
            })

            //save database
            const user = await newUser.save()
            res.status(200).json({
                data: {
                    _id: user.id,
                    user: user
                }
            })
        } catch (err) {
            res.status(500).json(err)
        }
    },
    generateAccessToken: (email) => {
        return jwt.sign({
            id: email.id,
            role: email.role,
            fullName: email.fullName,
            email: email.email,
            phone: email.phone,
            avatar: email.avatar

        },
            process.env.JWK_SUCCES_KEY,
            { expiresIn: "60000s" }
        )
    },
    generateRefreshToken: (email) => {
        return jwt.sign({
            id: email.id,
            role: email.role,
        },
            process.env.JWK_REFRESH_KEY,
            { expiresIn: "365d" }
        )
    },
    loginUser: async (req, res) => {
        try {
            //Kiểm tra xem đầu vào có phải là email hợp lệ không
            await body('email').isEmail().normalizeEmail().run(req);
            // Đảm bảo mật khẩu có độ dài ít nhất 6 ký tự
            await body('password').isLength({ min: 6 }).trim().run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const email = await User.findOne({ email: req.body.email })
            if (!email) {
                return res.status(404).json("Wrong email!")
            }
            const validPassword = await bcrypt.compare(

                req.body.password,
                email.password,

            )
            if (!validPassword) {
                return res.status(404).json("Wrong password!")
            }
            if (email && validPassword) {
                const accessToken = autController.generateAccessToken(email)
                const refreshToken = autController.generateRefreshToken(email)
                refreshTokens.push(refreshToken)

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', //Chỉ gửi cookie qua HTTPS
                    path: "/",
                    sameSite: "Strict"
                })
                const { password, ...others } = email._doc

                res.status(200);
                res.json({
                    data: {
                        user: others, // Trả về thông tin user
                        accessToken: accessToken,// Trả về access token
                    }

                });

            }
        } catch (err) {
            res.status(500).json(err)
        }
    },
    loginFromGG: async (req, res) => {

        let email = await User.findOne({ email: req.body.email })
        if (!email) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(salt, salt)
            const userTest = await User.find()
            let id
            do {
                id = Math.floor(Math.random() * 100000000) + 1;
            } while (userTest.includes(id))
            const userId = `KH${id}`
            //tao user
            const newUser = await new User({
                email: req.body.email,
                userId: userId,
                fullName: req.body.fullName,
                password: hashed,
                avatar: req.body.avatar,
            })
            //save database
            const user = await newUser.save()
            email = user
        }
        const accessToken = autController.generateAccessToken(email)
        const refreshToken = autController.generateRefreshToken(email)
        refreshTokens.push(refreshToken)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "Strict"
        })
        const { ...others } = email._doc

        res.status(200);
        res.json({
            data: {
                user: others, // Trả về thông tin user
                accessToken: accessToken,// Trả về access token
            }

        });
    },
    requestRefreshToken: async (req, res) => {
        //lay refresh token tu user
        const refreshToken = req.cookies.refreshToken


        if (!refreshToken) {
            return res.status(401).json("You're not authenticated")

        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid")
        }
        jwt.verify(refreshToken, process.env.JWK_REFRESH_KEY, (err, email) => {
            if (err) {
                console.log(err)
            }

            refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
            const newAccessToken = autController.generateAccessToken(email)
            const newRefreshToken = autController.generateRefreshToken(email)
            //luu refreshToken
            refreshTokens.push(newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "Strict"
            })

            res.status(200)
            return res.json({ accessToken: newAccessToken })
        })
    },

    userLogout: async (req, res) => {
        res.clearCookie("refreshToken")
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
        res.status(200)
        return res.json({ data: { user: req.user } })
    },
    getAccount: async (req, res) => {
        if (req.user) {
            return res.json({
                data: {
                    user: req.user
                }
            })
        }
    }
}

module.exports = autController



//store token
// 1: Local storage
//De bi tan cong boi XSS
// 2 : HTTPONLY COOKIE
//De bi tan cong boi CSRF nhung SAMESITE co the khac phuc
// 3 : REDUX STRORE -> ACCESSTOKEN + HTTPONLY COOKIE -> REFRESHTOKEN