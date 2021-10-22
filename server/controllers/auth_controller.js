require('dotenv').config()
let JWT = require('jsonwebtoken')
const { generateVerifiedCode } = require('../helpers/auth_helper')
const { addHourDateTimeNow, compareDateNow } = require('../helpers/date_times_helper')
const MAIL = require('../helpers/node_mailter')
let UserModel = require('../models/user_model')
let PASSPORT_SERECT = process.env.PASSPORT_SERECT

let encodeedToken = (userID) => {
    return JWT.sign({
        iss: "TRAN HOANG HUY",
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 6)
    }, PASSPORT_SERECT)
}

let changePassword = async (req, res, next) => {
    let { oldPassword, newPassword, passwordConfirm } = req.body
    if (oldPassword && newPassword === passwordConfirm) {
        let user = await UserModel.findById(req.user.id)
        let checkMatchPassword = await user.comparePassword(oldPassword);

        if (checkMatchPassword) {
            await UserModel.findByIdAndUpdate(req.user.id, { password: newPassword })
            return res.status(200).json({
                status: 200,
                message: "",
                success: true,
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
    let { email, password } = req.body
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
        if (foundUser) return res.status(200).json({
            message: "Email is exists!",
            success: false,
            status: 301
        })
    }

    if (phoneNumber) {
        let foundUser = await UserModel.findOne({ phoneNumber })
        if (foundUser) return res.status(200).json({
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
        let user = await UserModel.findOne({ email: email })
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


module.exports = {
    login,
    signUp,
    serect,
    changePassword,
    emailVerifiedSendMail,
    onVerifiedEmail
}