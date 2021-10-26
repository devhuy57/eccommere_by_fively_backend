let router = require('express-promise-router')()
let authController = require('../controllers/auth_controller')
let passport = require('passport')
let passportConfig = require('../middlewares/passport')

// 
router.route("/login")
    .post(authController.login)

router.route('/register')
    .post(authController.signUp)

router.route('/change-password').post(passport.authenticate('jwt', { session: false }), authController.changePassword)

router.route('/serect').get(passport.authenticate('jwt', { session: false }), authController.serect)

router.route('/verified/sendmail')
    .post(authController.emailVerifiedSendMail)

router.route('/verified/email')
    .post(authController.onVerifiedEmail)


router.route('/forgot-password')
    .post(authController.forgotPasswordRequest)

router.route('/verify-forgot-password')
    .post(authController.veryfyCodeResetPassword)

router.route('/reset-password')
    .post(authController.resetPassword)

module.exports = router