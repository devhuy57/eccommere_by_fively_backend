let router = require('express-promise-router')()
const multer = require('multer')
let productController = require('../controllers/product_controller')
const { imageFilter } = require('../helpers/image_filter')
const storage = require('../middlewares/upload_file')
const { validatiorParams, baseSchema } = require('../validators/base')
router.route("")
    .get(productController.products)
    .post(multer({ storage: storage, fileFilter: imageFilter }).any(['product_avatar', 'product_background']), productController.createProduct)

router.route("/:productId")
    .get(productController.product)
    .delete(productController.deleteProduct)

router.route("/:productId/attributes")
    .get(productController.productAtributes)
    .post(multer({ storage: storage, fileFilter: imageFilter }).single('product_attrbutes'), productController.addProductAttrbute)

router.route('/:productId/attributes/:attributeId')
    .get(validatiorParams(baseSchema.idSchema, 'attributeId'), productController.getProductAttibute)
    .put(validatiorParams(baseSchema.idSchema, 'attributeId'), multer({ storage: storage, fileFilter: imageFilter }).single('product_attrbutes'), productController.updateAtrribute)
    .delete(validatiorParams(baseSchema.idSchema, 'attributeId'), productController.deleteAttrbuteProduct)

module.exports = router