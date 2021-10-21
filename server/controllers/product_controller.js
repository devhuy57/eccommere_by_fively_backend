const paginateHelper = require('../helpers/paginate_helper')
let ProductModel = require('../models/product_model')


let product = async (req, res) => {
    let products = await ProductModel.findById(req.params.productId)
        .populate([
            'categories',
            // 'attributes'
        ])

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


module.exports = {
    products,
    product
}