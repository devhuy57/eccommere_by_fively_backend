const UserModel = require("../models/user_model")
let path = require('path');
let profile = async (req, res, next) => {
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: req.user
    })
}

let updateProfile = async (req, res, next) => {

    let { firstName, lastName, phoneNumber } = req.body
    let avatar = path.normalize(req.file.path).split("\\").slice(1).join("/")
    await UserModel.findByIdAndUpdate(req.user._id, { firstName, lastName, phoneNumber, avatar })
    let user = await UserModel.findById(req.user._id, { password: 0, __v: 0 })

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: user
    })
}

module.exports = {
    profile,
    updateProfile
}