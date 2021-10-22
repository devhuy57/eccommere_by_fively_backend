const UserModel = require("../models/user_model")
let ProuductModel = require('../models/product_model')
let path = require('path');
const { sendMail } = require("../helpers/node_mailter");

let addFavorites = async (req, res, next) => {
    let productId = req.body.productId
    let product = await ProuductModel.findOne({ _id: productId })

    if (product) {
        let user = await UserModel.findOne(req.user._id)
        let index = user.favorites.indexOf(productId)
        if (index >= 0) {
            user.favorites.splice(index, 1);
        } else {
            user.favorites.push(productId)
        }
        await user.save()
        res.status(200).json({
            status: 200,
            success: true,
            message: "",
            data: null
        })

    } else {
        res.status(400).json({
            status: 400,
            success: true,
            message: "",
            data: null
        })
    }
}

// 
let profile = async (req, res, next) => {
    
    let userInfo = await UserModel.aggregate([
        {
            $match: {
                _id: req.user._id
            }
        },
        {
            $project: {
                carts: { $size: "$carts" },
                favorites: { $size: "$favorites" },
                payments: { $size: "$payments" },
                address: { $size: "$address" },
                reviews: { $size: "$reviews" },
                firstName: 1,
                lastName: 1,
                phoneNumber: 1,
                email: 1,
                avatar: 1,
                emailVerified: 1,
                phoneVerified: 1,
            }
        }
    ])



    return res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: userInfo
    })
}

// 
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

// 
let myFavorites = async (req, res) => {
    let user = await UserModel.findOne(req.user._id).populate('favorites')
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: user.favorites
    })
}

module.exports = {
    profile,
    updateProfile,
    addFavorites,
    myFavorites
}