let router = require('express-promise-router')()
let categoryController = require('../controllers/category_controller')

router.route('')
    .get(categoryController.categories)

router.route('/childs')
    .get(categoryController.getCategoryChilds)

router.route('/:id')
    .get(categoryController.category)

router.route('/:id/products')
    .get(categoryController.productOfCategory)
module.exports = router