let router = require('express-promise-router')()
let passport = require('passport')
let passportConfig = require('../middlewares/passport')
let cartController = require('../controllers/cart_controller')

router.route('/cart', passport.authenticate('jwt', { session: false }), cartController.myCart)

module.exports = router