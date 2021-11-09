require('dotenv').config()
let JWT = require('jsonwebtoken')
const { generateVerifiedCode } = require('../helpers/auth_helper')
const { addMinWithNow, compareDateNow, addDateWithNow, getNowToNumber } = require('../helpers/date_times_helper')
const MAIL = require('../helpers/node_mailter')
const { sendSMS } = require('../helpers/vonage_sms_helper')
let UserModel = require('../models/user_model')
const FcmNotification = require('../threads/fcm_notification_thread')
let PASSPORT_SERECT = process.env.PASSPORT_SERECT

let encodeedToken = (userID, authen = true) => {
    return JWT.sign({
        iss: "TRAN HOANG HUY",
        sub: userID,
        iat: new Date().getTime(),
        exp: addDateWithNow(6)
    }, PASSPORT_SERECT)
}

// authen ? 
// : addDateWithNow(5)

let changePassword = async (req, res, next) => {
    let { oldPassword, newPassword, confirmPassword } = req.body

    if (oldPassword && newPassword === confirmPassword) {
        let user = await UserModel.findById(req.user.id)
        let checkMatchPassword = await user.comparePassword(oldPassword);

        if (checkMatchPassword) {
            await UserModel.findByIdAndUpdate(req.user.id, { password: newPassword })
            return res.status(200).json({
                status: 200,
                message: "",
                success: true,
            })
        } else {
            return res.status(301).json({
                status: 301,
                message: "",
                success: false,
            })
        }
    }

    return res.status(400).json({
        status: 400,
        message: "",
        success: false,
    })
}

// 
let login = async (req, res) => {
    let { email, password } = req.value.body
    let user = await UserModel.findOne({ email: email })
    if (user) {
        let checkMatchPassword = await user.comparePassword(password);
        if (checkMatchPassword) {
            token = encodeedToken(user._id)
            return res.status(200).json({
                status: 200,
                message: "",
                success: true,
                data: {
                    successToken: token,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            })
        } else {
            return res.status(301).json({
                status: 301,
                message: "",
                success: false,
            })
        }
    }
    return res.status(400).json({
        status: 400,
        message: "",
        success: false,
    })

}

// 
let signUp = async (req, res, next) => {
    let { firstName, lastName, email, password, phoneNumber } = req.body
    // check user is exsit
    condicion = []

    if (email) {
        let foundUser = await UserModel.findOne({ email })
        if (foundUser) return res.status(301).json({
            message: "Email is exists!",
            success: false,
            status: 301
        })
    }

    if (phoneNumber) {
        let foundUser = await UserModel.findOne({ phoneNumber })
        if (foundUser) return res.status(302).json({
            message: "Phone Number is exists!",
            success: false,
            status: 302
        })
    }

    let newUser = await new UserModel({ firstName, lastName, email, password, phoneNumber })
    await newUser.save()

    let token = encodeedToken(newUser._id)
    return res.status(200).json({
        success: true,
        status: 200,
        data: {
            successToken: token,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        }
    })
}

let serect = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        status: 200
    })
}


let emailVerifiedSendMail = async (req, res) => {
    let email = req.body.email

    if (email) {
        let user = await UserModel.findOne({ email: email, emailVerified: { $exists: false } })
        if (user) {
            let verifiedCode = generateVerifiedCode()
            let data = {
                to: email,
                subject: "Verified Account",
                templateVars: {
                    verifiedCode: verifiedCode
                }
            }
            await MAIL.sendMail({ template: "verified_account", ...data });
            user.emailCode = verifiedCode
            user.emailExpired = addHourDateTimeNow(1)
            await user.save()

            return res.status(200).json({
                success: true,
                status: 200,
                message: "",
                data: ""
            })

        } else {
            return res.status(301).json({
                success: false,
                status: 301,
                message: "",
                data: ""
            })
        }
    }

    return res.status(400).json({
        status: 400,
        message: "",
        success: false,
    })
}


let onVerifiedEmail = async (req, res, next) => {
    let { emailCode, email } = req.body

    if (emailCode.length != 6) {
        return res.status(301).json({
            success: false,
            status: 301,
            message: "",
            data: emailCode.length
        })
    }

    if (!email) {
        return res.status(301).json({
            success: false,
            status: 301,
            message: "",
            data: email
        })
    }

    let user = await UserModel.findOne({ email: email, emailCode: emailCode })
    if (user) {
        let checkExpired = compareDateNow(user.emailExpired)
        if (checkExpired >= 1) {
            user.emailVerified = new Date()
            user.emailCode = null
            user.emailExpired = null
            await user.save()
            return res.status(200).json({
                success: false,
                status: 200,
                message: "",
                data: ""
            })
        } else {
            return res.status(201).json({
                success: false,
                status: 201,
                message: "Email Het Hat",
                data: ""
            })
        }

    } else {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "",
            data: ""
        })
    }
}

let forgotPasswordRequest = async (req, res, next) => {
    let email = req.body.email

    if (email) {
        let user = await UserModel.findOne({ email: email })
        if (user) {
            let verifiedCode = generateVerifiedCode()
            let data = {
                to: email,
                subject: "Reset password code",
                templateVars: {
                    verifiedCode: verifiedCode
                }
            }
            user.emailCode = verifiedCode
            user.emailExpired = addMinWithNow(50)
            await user.save()
            await MAIL.sendMail({ template: "verified_account", ...data });
            await FcmNotification("Done")

            return res.status(200).json({
                status: 200,
                message: "",
                success: true,
            })
        }
    } else {
        return res.status(400).json({
            status: 400,
            message: "",
            success: false,
        })
    }
}


let veryfyCodeResetPassword = async (req, res, next) => {
    let { emailCode, email } = req.body

    if (emailCode.length != 6) {
        return res.status(301).json({
            success: false,
            status: 301,
            message: "",
            data: emailCode.length
        })
    }

    if (!email) {
        return res.status(301).json({
            success: false,
            status: 301,
            message: "",
            data: email
        })
    }

    let result = await verifyEmailCode(emailCode, email)
    if (result) {
        let user = await UserModel.findOne({ email: email })
        token = encodeedToken(user._id, false)
        return res.status(200).json({
            status: 200,
            message: "",
            success: true,
            data: {
                successToken: token,
                firstName: user.firstName,
                lastName: user.lastName
            }
        })
    }

    return res.status(400).json({
        success: false,
        status: 400,
        message: "",
        data: email
    })
}

let verifyEmailCode = async (emailCode, email) => {

    let user = await UserModel.findOne({ email: email, emailCode: emailCode })
    if (user) {
        let checkExpired = compareDateNow(user.emailExpired)
        if (checkExpired >= 1) {
            user.emailCode = null
            user.emailExpired = null
            await user.save()
            return true
        }
    }
    return false

}

let resetPassword = async (req, res) => {
    let { password, passwordConfirm, successToken, email } = req.body

    let decode = await JWT.verify(successToken, PASSPORT_SERECT)
    if (decode) {
        let checkExp = getNowToNumber() <= decode.exp ? true : false
        if (checkExp) {
            if (password == passwordConfirm) {
                let user = await UserModel.findOne({ email: email })
                await UserModel.findByIdAndUpdate(user.id, { password: password })
                return res.status(200).json({
                    status: 200,
                    message: "",
                    success: true,
                })
            }
        } else {
            return res.status(301).json({
                status: 301,
                message: "",
                success: false,
                data: "",
            })
        }
    }

    return res.status(400).json({
        status: 400,
        message: "",
        success: false,
        data: decode,
    })

}


let sendPhoneVerifiedCode = async (req, res) => {
    let { phoneNumber } = req.body
    // // let user = req.req.user
    // let findUser = await UserModel.findOne({ phoneNumber: phoneNumber })
    // // if (user._id == findUser._id) {
    // let verifiedCode = generateVerifiedCode()
    // findUser.phoneCode = verifiedCode
    // findUser.phoneCodeExpired = addMinWithNow(50)
    // await findUser.save()
    await sendSMS()
    return res.status(200).json({
        status: 200,
        message: "",
        success: true,
    })
    // } else {
    //     return res.status(400).json({
    //         status: 400,
    //         message: "",
    //         success: false,
    //     })
    // }
}

module.exports = {
    login,
    signUp,
    serect,
    changePassword,
    emailVerifiedSendMail,
    onVerifiedEmail,
    forgotPasswordRequest,
    veryfyCodeResetPassword,
    resetPassword,
    sendPhoneVerifiedCode,
}