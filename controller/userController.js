const User = require("../model/User")
const bcrypt = require("bcrypt");
const apiQueryParams = require('api-query-params');
const userController = {
    getAllUser: async (req, res) => {
        try {
            const params = apiQueryParams(req.query);
            const filter = {};
            if (params.filter.fullName) {
                filter.fullName = { $regex: params.filter.fullName, $options: 'i' }
            }
            if (params.filter.email) {
                filter.email = { $regex: params.filter.email, $options: 'i' }
            }
            if (params.filter.phone) {
                filter.phone = { $regex: params.filter.phone, $options: 'i' }
            }
            filter.role = 'USER'
            const sort = params.sort || '-createdAt';
            const current = parseInt(params.filter.current);
            const pageSize = parseInt(params.filter.pageSize);

            const user = await User.find(filter)
                .sort(sort)
                .skip(pageSize * (current - 1))
                .limit(pageSize)
                .exec();
            const total = await User.countDocuments(filter);
            const pages = Math.ceil(total / pageSize);
            const meta = {
                current: params.filter.current,
                pageSize: params.filter.pageSize,
                pages: pages,
                total: total
            }
            return res.status(200).json({ data: { user: user, meta: meta } })
        } catch (err) {
            res.status(500).json(err)
        }
    },

    getAllCus: async (req, res) => {
        try {
            const user = await User.find({ role: 'USER' })
            return res.status(200).json({ data: { user: user } })
        } catch (err) {
            res.status(500).json(err)
        }
    },


    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ data: { user: user } });
        } catch (error) {
            res.status(500).json(error)
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user) {
                return res.json({ message: 'User not found' });
            }
            res.json({ data: { user: user } });
        } catch (error) {
            res.status(500).json(error)
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
            return res.json({ data: user })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    changePassword: async (req, res) => {
        try {
            console.log("okkkkk")
            const email = await User.findOne({ email: req.body.email })
            console.log("email", email)
            const validPassword = await bcrypt.compare(

                req.body.password,
                email.password,

            )

            if (!validPassword) {
                return res.send({ message: "Mật khẩu không chính xác" })
            }
            if (email && validPassword) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.newpass, salt)

                const user = await User.findByIdAndUpdate(email._id, { password: hashed }, { new: true })
                return res.json({ data: user })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

}

module.exports = userController