const paginateHelper = require('../helpers/paginate_helper')
const ProductAttrModel = require('../models/product_attribute')
let ProductModel = require('../models/product_model')
let mongoose = require('mongoose')
const { converterServerToRealPath } = require('../helpers/converter_helper')

let createProduct = async (req, res) => {
    console.log("🚀 ~ file: product_controller.js ~ line 7 ~ createProduct ~ req", req)
    let { productName, description, avatar, background, price, quantity, category } = req.body

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: converterServerToRealPath(req.files[0].path)
    })
}

let product = async (req, res) => {
    let products = await ProductModel.findOne({ _id: req.params.productId })

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: products
    })
}

let products = async (req, res) => {
    condiction = {}
    if (req.query.search) {
        condiction.productName = { $regex: `.*${req.query.search}*.` }
    }

    let products = await paginateHelper(req, ProductModel, condiction, ['categories'])
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: products
    })
}

let productAtributes = async (req, res) => {
    let productId = req.params.productId
    let attributes = await ProductModel.findById(mongoose.Types.ObjectId(productId)).populate('attributes').select('attributes')

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: attributes
    })
}


module.exports = {
    products,
    product,
    productAtributes,
    createProduct
}