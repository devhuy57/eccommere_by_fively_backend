let router = require("express-promise-router")()
let userController = require('../controllers/user_controller')
let passport = require('passport')
let passportConfig = require('../middlewares/passport')
const multer = require('multer')
const storage = require("../middlewares/upload_file")
const { imageFilter } = require("../helpers/image_filter")
let cartController = require('../controllers/cart_controller')
router.route('/profile')
    .get(passport.authenticate('jwt', { session: false }), userController.profile)
    .post(passport.authenticate('jwt', { session: false }), multer({ storage: storage, fileFilter: imageFilter }).single('avatar'), userController.updateProfile)


router.route('/cart')
    .get(passport.authenticate('jwt', { session: false }), cartController.getMyCart)
    .post(passport.authenticate('jwt', { session: false }), cartController.createCart)
    .put(passport.authenticate('jwt', { session: false }), cartController.updateMyCart)


module.exports = router