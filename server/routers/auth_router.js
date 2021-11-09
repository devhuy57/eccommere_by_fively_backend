let router = require('express-promise-router')()
let authController = require('../controllers/auth_controller')
let passport = require('passport')
let passportConfig = require('../middlewares/passport')
let authSchemas = require('../validators/auth_validator')
const { validatorBody } = require('../validators/base')
// 
router.route("/login")
    .post(validatorBody(authSchemas.signIn), authController.login)

router.route('/register')
    .post(validatorBody(authSchemas.signUp), authController.signUp)

router.route('/change-password').post(passport.authenticate('jwt', { session: false }), validatorBody(authSchemas.changePassword), authController.changePassword)

router.route('/serect').get(passport.authenticate('jwt', { session: false }), authController.serect)

router.route('/verified/sendmail')
    .post(validatorBody(authSchemas.sendmail), authController.emailVerifiedSendMail)

router.route('/verified/email')
    .post(validatorBody(authSchemas.verifyMail), authController.onVerifiedEmail)


router.route('/forgot-password')
    .post(validatorBody(authSchemas.sendmail), authController.forgotPasswordRequest)

router.route('/verify-forgot-password')
    .post(validatorBody(authSchemas.verifyMail), authController.veryfyCodeResetPassword)

router.route('/reset-password')
    .post(validatorBody(authSchemas.resetPassword), authController.resetPassword)

router.route('/verified/send-phone')
    .post(passport.authenticate('jwt', { session: false }), authController.sendPhoneVerifiedCode)

module.exports = router