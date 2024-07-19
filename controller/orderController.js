const Order = require("../model/Order")
const apiQueryParams = require('api-query-params');
const moment = require('moment');
const orderController = {
    addOrder: async (req, res) => {
        try {
            const { idUser, name, avatar, address, phone, totalPrice, detail } = req.body
            const orderTest = await Order.find()
            let id
            do {
                id = Math.floor(Math.random() * 100000000) + 1;
            } while (orderTest.includes(id))
            const orderId = `HD${id}`
            const newOrder = await new Order({
                idUser: idUser,
                avatar: avatar,
                orderId: orderId,
                name: name,
                address: address,
                phone: phone,
                totalPrice: totalPrice,
                detail: detail
            })
            const order = await newOrder.save()
            res.json({ data: order })

        } catch (error) {
            res.json(error)
        }
    },
    getAllOrder: async (req, res) => {
        try {
            const params = apiQueryParams(req.query);
            console.log('pargema', params)
            const filter = {}
            if (params?.filter?.idUser) {
                filter.idUser = params?.filter?.idUser
            }
            if (params?.filter?.state) {
                filter.state = params?.filter?.state
            }
            if (params.filter.name) {
                filter.name = { $regex: params.filter.name, $options: 'i' }
            }
            if (params.filter.phone) {
                filter.phone = { $regex: params.filter.phone, $options: 'i' }
            }

            if (params.filter.createdAt) {

                const dateString = params.filter.createdAt; // '12/11/2023'

                // Parse chuỗi sang đối tượng Date
                const date = moment(dateString, 'DD/MM/YYYY').toDate();

                // Lấy ngày bắt đầu khoảng là 0h ngày được chọn 
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                // Lấy ngày kết thúc khoảng là 0h ngày tiếp theo
                const end = new Date(start.getTime());
                end.setDate(start.getDate() + 1);

                // Convert cả 2 ngày về định dạng ISODate cho MongoDB
                filter.createdAt = {
                    $gte: start.toISOString(),
                    $lt: end.toISOString()
                };

            }
            // const sort = params.sort || '-updatedAt';
            const order = await Order.find(filter).sort('-createdAt').exec()
            if (order) {
                return res.json({ data: order })
            }
            else {
                return res.json({ message: 'Không tồn tại đơn hàng nao' })
            }
        } catch (error) {
            res.json(error)
        }
    },
    deleteOrder: async (req, res) => {
        try {
            const order = await Order.findByIdAndDelete(req.params.id)
            if (order) {
                return res.json({ data: order })
            }
            else {
                return res.json({ message: 'Không tồn tại đơn hàng' })
            }
        } catch (error) {
            res.json(error)
        }
    },
    getDetailOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
            if (order) {
                return res.json({ data: order })
            }
            else {
                return res.json({ message: 'Không tồn tại đơn hàng' })
            }
        } catch (error) {
            res.json(error)
        }
    },
    updateOrder: async (req, res) => {
        try {
            const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })

            return res.json({ data: { order: order } })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}
module.exports = orderController