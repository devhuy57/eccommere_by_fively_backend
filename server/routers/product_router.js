let router = require('express-promise-router')()
let productController = require('../controllers/product_controller')
router.route("")
    .get(productController.products)

router.route("/:productId")
    .get(productController.product)

module.exports = router