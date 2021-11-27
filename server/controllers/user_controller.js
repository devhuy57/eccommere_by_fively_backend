const UserModel = require("../models/user_model")
let ProuductModel = require('../models/product_model')
let OrderModel = require('../models/order_model')
let OrderDetails = require('../models/order_details')
const { sendMail } = require("../helpers/node_mailter");
const mail_thread = require("../threads/mail_thread");
const { generateVerifiedCode } = require("../helpers/auth_helper");
const paginateHelper = require("../helpers/paginate_helper");
const mongoose = require('mongoose')
const { converterServerToRealPath } = require('../helpers/converter_helper');
const generateSequence = require("../helpers/sequence_helper");


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
            $project: {
                // carts: { $size: "$carts" },
                favorites: { $size: "$favorites" },
                payments: { $size: "$payments" },
                address: { $size: "$address" },
                reviews: { $size: "$reviews" },
                orders: 1,
                firstName: 1,
                lastName: 1,
                phoneNumber: 1,
                email: 1,
                avatar: 1,
                emailVerified: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$emailVerified" } },
                phoneVerified: 1,
            }
        },
        {
            $match: {
                _id: req.user._id
            }
        },
        { $limit: 1 },
        {
            $lookup: {
                "from": "carts",
                "localField": "_id",
                "foreignField": "userId",
                "as": "myCarts"
            }
        },
        {
            $lookup: {
                "from": "orders",
                "localField": "_id",
                "foreignField": "userId",
                "as": "myOrders"
            }
        },
        {
            $addFields: {
                carts: { $size: "$myCarts" },
                orders: { $size: "$myOrders" }
            }
        },
        {
            $project: {
                myCarts: 0,
                myOrders: 0,
            }
        },
    ])

    // let verifiedCode = generateVerifiedCode()
    // let data = {
    //     to: "fxhuytran99@gmail.com",
    //     subject: "Verified Account",
    //     templateVars: {
    //         verifiedCode: verifiedCode
    //     }
    // }
    // console.log("🚀 ~ file: user_controller.js ~ line 73 ~ profile ~ data", data)
    // // await sendMail({ template: "template1", ...data });

    // await mail_thread({ template: "template1", ...data })

    return res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: userInfo[0]
    })
}

// 
let updateProfile = async (req, res, next) => {
    let { firstName, lastName, phoneNumber } = req.body
    await UserModel.findByIdAndUpdate(req.user._id, { firstName, lastName, phoneNumber })

    if (req.file) {
        await UserModel.findByIdAndUpdate(req.user._id, { avatar: converterServerToRealPath(req.file.path) })
    }

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

let getAllUsers = async (req, res) => {
    condiction = {}
    if (req.query.search && req.query.search !== "undefined") {
        condiction.productName = { $regex: new RegExp(req.query.search, 'i') }
    }

    let users = await UserModel.aggregate(
        [
            {
                $match: {
                    logical_delete: { $exists: true }
                }
            },
            // {
            //     $facet: {

            //         metadata: [{ $count: "total" }, { $addFields: { page: 1 } }],
            //         data: [{ $skip: 1 }, { $limit: 10 }] //- add projection here wish you re-shape the docs
            //     }
            // }
        ]
    )

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: users
    })
}

let getOrder = async (req, res) => {

}
let createOrder = async (req, res) => {
    let uerId = req.user._id

    let { address, phoneNumber, method, items } = req.value.body

    let productIds = items.map(item => item.productId)


    let productCheck = await ProuductModel.find({ productId: { $in: productIds } })
    if (productCheck.length !== productIds.length) {
        return res.status(400).json({
            status: 400,
            success: true,
            message: "",
            data: null
        })
    }

    let order = new OrderModel({
        userId: uerId,
        orderId: await generateSequence("OD", "U"),
        address: address,
        phoneNumber: phoneNumber,
        status: 1,
        method: method,
    })
    await order.save()

    items.map(item => {
        console.log('item:'

            , item)
        let productItem = productCheck.find(product => product.productId.toString() === item.productId)
        let orderItem = new OrderDetails({
            productId: item.productId,
            quantity: item.quantity,
            price: productItem.price,
            productName: productItem.productName,
            avatar: productItem.avatar,
            orderId: order._id
        })
        orderItem.save()
    })

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: order
    })
}

let myOrders = async (req, res) => {
    let user = await OrderModel.aggregate([
        {
            $lookup: {
                from: 'orderdetails',
                localField: 'orders.orderId',
                foreignField: 'orderdetails.orderId',
                as: 'orderItems'
            }
        },
        {
            $match: {
                userId: `${req.user._id}`
            }
        }, {
            $project: {
                userId: 1,
                orderId: 1,
                address: 1,
                phoneNumber: 1,
                status: 1,
                method: 1,
                itemQuantity: { $size: "$orderItems" },
                total: { $sum: "$orderItems.price" },
                acceptTime: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$acceptTime" } },
                orderTime: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$acceptTime" } },
                createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
            }
        },
        {
            $addFields: {
                total: { $toString: "$total" }
            }
        }
    ])
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: user
    })
}

let getOrderDetail = async (req, res) => {
    let { orderId } = req.params
    let orderDetail = await OrderDetails.aggregate([
        {
            $match: {
                orderId: orderId
            }
        }, {
            $addFields: {
                price: { $toString: "$price" }
            }
        }, {
            $sort: { productName: 1 }
        }
    ])
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: orderDetail
    })
}

let deleteOrder = async (req, res) => {
    let { orderId } = req.params
    await OrderModel.deleteMany({ orderId: orderId })
    await OrderDetails.deleteMany({ orderId: orderId })
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: true
    })
}

module.exports = {
    profile,
    updateProfile,
    addFavorites,
    myFavorites,
    getAllUsers,
    createOrder,
    myOrders,
    getOrderDetail,
    deleteOrder
}