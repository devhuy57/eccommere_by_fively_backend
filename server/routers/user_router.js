let router = require("express-promise-router")()
let userController = require('../controllers/user_controller')
let passport = require('passport')
let passportConfig = require('../middlewares/passport')
const multer = require('multer')
const storage = require("../middlewares/upload_file")
const { imageFilter } = require("../helpers/image_filter")
let cartController = require('../controllers/cart_controller')
const { validatorBody } = require("../validators/base")
const userSchemas = require("../validators/user.vadator")

router.route('')
    .get(passport.authenticate('jwt', { session: false }), userController.getAllUsers)

router.route('/profile')
    .get(passport.authenticate('jwt', { session: false }), userController.profile)
    .post(passport.authenticate('jwt', { session: false }), multer({ storage: storage, fileFilter: imageFilter }).single('avatar'), userController.updateProfile)


router.route('/cart')
    .get(passport.authenticate('jwt', { session: false }), cartController.getMyCart)
    .post(passport.authenticate('jwt', { session: false }), cartController.createCart)
    .put(passport.authenticate('jwt', { session: false }), cartController.updateMyCart)


router.route('/favorites')
    .post(passport.authenticate('jwt', { session: false }), userController.addFavorites)
    .get(passport.authenticate('jwt', { session: false }), userController.myFavorites)

router.route("/orders")
    .get(passport.authenticate('jwt', { session: false }), userController.myOrders)
    .post(passport.authenticate('jwt', { session: false }), validatorBody(userSchemas.newOrder), userController.createOrder)

router.route("/order/:orderId")
    .get(passport.authenticate('jwt', { session: false }), userController.getOrderDetail)
    .delete(passport.authenticate('jwt', { session: false }), userController.deleteOrder)

module.exports = router