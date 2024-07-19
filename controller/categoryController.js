const Categorys = require('../model/Categorys')
const CategoryController = {
    addCategory: async (req, res) => {
        try {
            const newCategory = await new Categorys({
                name: req.body.name
            })

            const category = await newCategory.save()
            res.status(200).json({
                data: {
                    _id: category.id,
                    category: category
                }
            })
        } catch (error) {
            res.json(error)
            res.status(500)
        }
    },
    getAllCategory: async (req, res) => {
        try {
            const category = await Categorys.find({}, 'name')

            if (!category) {
                return res.status(404).json({ message: 'User not found' });
            }
            const names = []
            category.forEach(cat => {
                names.push(cat.name);
            });
            res.json({ data: names });
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
module.exports = CategoryController