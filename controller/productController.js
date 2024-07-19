const bcrypt = require('bcrypt')
const { json } = require('express')
const Products = require('../model/Products')
const apiQueryParams = require('api-query-params');
const productController = {
    addProduct: async (req, res) => {
        try {
            const productTest = await Products.find()
            let id
            do {
                id = Math.floor(Math.random() * 100000000) + 1;
            } while (productTest.includes(id))
            const productId = `SP${id}`
            const newProduct = await new Products({
                productId: productId,
                drugName: req.body.drugName,
                drugGroupName: req.body.drugGroupName,
                drugOrigin: req.body.drugOrigin,
                manufacturersName: req.body.manufacturersName,
                quantity: req.body.quantity,
                unitName: req.body.unitName,
                importPrice: req.body.importPrice,
                sellingPrice: req.body.sellingPrice,
                drugIngredients: req.body.drugIngredients,
                drugUses: req.body.drugUses,
                howToUseDrug: req.body.howToUseDrug,
                slider: req.body.slider,
                thumbnail: req.body.thumbnail,
            })
            const products = await newProduct.save()
            res.status(200).json({
                data: {
                    _id: products.id,
                    products: products
                }
            })
        } catch (error) {
            res.json(error)
            res.status(500)
        }
    },
    detailProduct: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id)
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200)
            return res.json({ data: product })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    updateProduct: async (req, res) => {
        try {
            const product = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true })
            return res.json({ data: product })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = await Products.findByIdAndDelete(req.params.id)
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ data: { product: product } });
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    getAllProduct: async (req, res) => {
        try {
            const params = apiQueryParams(req.query);
            const filter = {};
            if (params.filter.drugGroupName) {
                filter.drugGroupName = params.filter.drugGroupName;
            }
            if (params.filter.sellingPrice) {
                filter.sellingPrice = {
                    $gte: Number(params.filter.sellingPrice.$gte),
                    $lte: Number(params.filter.sellingPrice.$lte)
                }
            }
            if (params.filter.drugName) {
                filter.drugName = { $regex: params.filter.drugName, $options: 'i' }
            }
            const sort = params.sort || '-createdAt';
            const current = parseInt(params.filter.current);
            const pageSize = parseInt(params.filter.pageSize);
            const product = await Products.find(filter)
                .sort(sort)
                .skip(pageSize * (current - 1))
                .limit(pageSize)
                .exec();
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            const total = await Products.countDocuments(filter);
            const pages = Math.ceil(total / pageSize);
            const meta = {
                current: params.filter.current,
                pageSize: params.filter.pageSize,
                pages: pages,
                total: total
            }
            res.json({
                data: { product: product, meta: meta }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    }

}

module.exports = productController