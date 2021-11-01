const paginateHelper = require('../helpers/paginate_helper')
const ProductAttrModel = require('../models/product_attribute')
let ProductModel = require('../models/product_model')
let mongoose = require('mongoose')
const { converterServerToRealPath } = require('../helpers/converter_helper')
const CategoryModel = require('../models/category_model')
const generateSequence = require('../helpers/sequence_helper')

let createProduct = async (req, res) => {
    let { productName, description, price, quantity, category } = req.body
    let avatar = converterServerToRealPath(req.files[0].path)
    let background = converterServerToRealPath(req.files[1].path)

    let categoryFind = await CategoryModel.findById(mongoose.Types.ObjectId(category))

    if (categoryFind) {
        productId = await generateSequence('PR', categoryFind.shortName)

        let newProduct = await ProductModel({
            productName: productName,
            quantity: quantity,
            background: background,
            avatar: avatar,
            price: price,
            categories: [category],
            description: description,
            productId: productId
        })

        console.log("🚀 ~ file: product_controller.js ~ line 30 ~ createProduct ~ newProduct.save()", await newProduct.save())
        await newProduct.save()

        res.status(200).json({
            status: 200,
            success: true,
            message: "",
            data: newProduct
        })

    } else {
        res.status(400).json({
            status: 400,
            success: false,
            message: "",
            data: null
        })
    }
}

let deleteProduct = async () => {
    await ProductModel.findOneAndDelete({ _id: req.params.productId })
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: null
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

    let products = await paginateHelper(req, ProductModel, condiction, ['categories'], { productName: 1 })
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
    createProduct,
    deleteProduct
}