let UserModel = require('../models/user_model')
let CartModel = require('../models/cart_model')
let ProductModel = require('../models/product_model')
var ObjectId = require('mongoose').Types.ObjectId;
const ProductAttrModel = require('../models/product_attribute');

let createCart = async (req, res) => {
    let cart = req.body
    if (ObjectId.isValid(cart.productId) && Number.isInteger(cart.quantity)) {
        let product = await ProductModel.findById(cart.productId)
        if (product) {
            let user = await UserModel.findById(req.user._id)
            let findCart = await CartModel.findOne({ productId: cart.productId, userId: req.user._id })
            if (findCart) {
                findCart.quantity = findCart.quantity + cart.quantity
                await findCart.save();
            } else {
                let cartEntity = new CartModel({
                    productId: cart.productId,
                    userId: req.user._id,
                    quantity: cart.quantity
                })
                await cartEntity.save()
                user.carts.push(cartEntity._id)
                await user.save()
            }

            return res.status(200).json({
                status: 200,
                message: "",
                success: user,
            })
        }
    }

    return res.status(400).json({
        status: 400,
        message: "",
        success: false,
    })
}


let updateMyCart = async (req, res) => {
    let myCarts = req.body
    for (let i = 0; i < myCarts.length; i++) {
        await CartModel.findOneAndUpdate({
            _id: myCarts[i].id,
            userId: myCarts[i].userId,
        }, {
            quantity: myCarts[i].quantity
        })
    }
    return res.status(200).json({
        status: 200,
        message: "",
        success: true,
    })
}


let getMyCart = async (req, res) => {

    let cart = await UserModel.findById(req.user._id, { carts: 1 }).populate('carts')
    return res.status(400).json({
        status: 400,
        message: "",
        success: cart,
    })
}


module.exports = {
    getMyCart,
    createCart,
    updateMyCart
}