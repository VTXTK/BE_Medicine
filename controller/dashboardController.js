const apiQueryParams = require('api-query-params');
const Order = require("../model/Order")
// const Products = require('../model/Products')
const User = require("../model/User")
const DashboardController = {
    getData: async (req, res) => {
        try {
            const time = req.query?.time
            const [month, year] = time.split('/');
            const filter = [
                {
                    $addFields: {
                        createdMonth: { $month: { $toDate: "$createdAt" } },
                        createdYear: { $year: { $toDate: "$createdAt" } }
                    }
                },
                {
                    $match: {
                        createdMonth: parseInt(month),
                        createdYear: parseInt(year)
                    }
                }
            ]
            const user = await User.aggregate(filter)
            const order = await Order.aggregate(filter).sort('-totalPrice')
            res.json({ data: { user: user, order: order } })
        } catch (error) {
            res.json(error)
            res.status(500)
        }
    }
}
module.exports = DashboardController