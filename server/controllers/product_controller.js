const paginateHelper = require('../helpers/paginate_helper')
const ProductAttrModel = require('../models/product_attribute')
let ProductModel = require('../models/product_model')
let mongoose = require('mongoose')
const { converterServerToRealPath } = require('../helpers/converter_helper')
const CategoryModel = require('../models/category_model')
const generateSequence = require('../helpers/sequence_helper')

let createProduct = async (req, res) => {
    let { productName, description, price, quantity, categoryIds } = req.body
    let avatar = converterServerToRealPath(req.files[0].path)
    let background = converterServerToRealPath(req.files[1].path)
    categoryIds = categoryIds.split(',')
    let categoryFind = await CategoryModel(mongoose.Types.ObjectId(categoryIds[0]))

    if (categoryFind) {
        productId = await generateSequence('PR', 'THH')
        let newProduct = await ProductModel({
            productName: productName,
            quantity: quantity,
            background: background,
            avatar: avatar,
            price: price,
            categories: categoryIds,
            description: description,
            productId: productId
        })

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

let deleteProduct = async (req, res) => {
    await ProductModel.findByIdAndRemove(req.params.productId)
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: {
            productId: req.params.productId
        }
    })
}

let product = async (req, res) => {
    let products = await ProductModel.findOne({ productId: req.params.productId }).populate(['categories', 'attributes'])
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: products
    })
}

let products = async (req, res) => {
    condiction = {}
    if (req.query.search && req.query.search !== "undefined") {
        condiction.productName = { $regex: new RegExp(req.query.search, 'i') }
    }

    let products = await paginateHelper(req, ProductModel, condiction, ['categories'], { productName: 0 })
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


let updateAtrribute = async (req, res) => {
    let { attributeId } = req.params
    let { title, description } = req.body
    let attrbute = await ProductAttrModel.findById(mongoose.Types.ObjectId(attributeId))
    if (attrbute) {
        attrbute.title = title
        attrbute.description = description
        if (req.file) {
            attrbute.imageUrl = converterServerToRealPath(req.file.path)
        }
        await attrbute.save()
    }
    let product = await ProductModel.findOne({ productId: req.params.productId }).populate(['categories', 'attributes'])

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: product
    })
}


let addProductAttrbute = async (req, res) => {
    let { title, description } = req.body

    let attrbute = new ProductAttrModel({
        title: title,
        description: description,
        imageUrl: converterServerToRealPath(req.file.path)
    })

    let product = await ProductModel.findOne({ productId: req.params.productId })
    if (product) {
        product.attributes.push(attrbute._id)
        await product.save()
        await attrbute.save()
    }

    let resutl = await ProductModel.findOne({ productId: req.params.productId }).populate(['categories', 'attributes'])
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: resutl
    })
}


let deleteAttrbuteProduct = async (req, res) => {
    let { productId, attributeId } = req.params
    let result = await ProductModel.updateOne(
        { productId: productId, attributes: { $in: [attributeId] } },
        { $pull: { attributes: { $in: [attributeId] } } })
    if (result.modifiedCount >= 1) {
        await ProductAttrModel.findByIdAndRemove(attributeId)
    }
    let product = await ProductModel.findOne({ productId: req.params.productId }).populate(['categories', 'attributes'])
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: product
    })
}

let getProductAttibute = async (req, res) => {
    let { productId, attributeId } = req.params
    let product = await ProductModel.findOne({ productId: req.params.productId }).populate(['attributes']).select('attributes')
    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: product
    })
}

module.exports = {
    products,
    product,
    productAtributes,
    createProduct,
    deleteProduct,
    updateAtrribute,
    addProductAttrbute,
    deleteAttrbuteProduct,
    getProductAttibute,
}