let CategoryModel = require('../models/category_model')
let mongoose = require('mongoose')
const paginateHelper = require('../helpers/paginate_helper')

let category = async (req, res) => {
    let category = await CategoryModel.aggregate([
        {
            $match: {
                logical_delete: { $exists: true },
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $sort: { order: 1 }
        },
        {
            $graphLookup: {
                from: 'categories',
                startWith: '$_id',
                connectFromField: '_id',
                connectToField: 'parentId',
                as: 'children'
            }
        },
    ]);

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: category
    })
}

let categories = async (req, res) => {
    let categories = await CategoryModel.aggregate([
        {
            $sort: { shortName: 1 }
        },
        {
            $graphLookup: {
                from: 'categories',
                startWith: '$_id',
                connectFromField: '_id',
                connectToField: 'parentId',
                as: 'children'
            }
        },
        {
            $match: {
                parentId: null,
                logical_delete: { $exists: true }
            }
        }
    ]);

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: categories
    })
}

let getCategoryChilds = async (req, res) => {
    let condiction = { logical_delete: { $exists: true }, parentId: { $ne: null } }
    let sort = { name: 1 }
    let categoryChilds = await paginateHelper(req, CategoryModel, condiction, [], sort)

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: categoryChilds
    })
}


let productOfCategory = async (req, res) => {
    let categories = await CategoryModel.aggregate([
        {
            $sort: { order: 1 }
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'categories',
                as: 'products'
            }
        },
        {
            $match: {
                logical_delete: { $exists: true },
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        },
        // {
        //     // $addFields:
        //     // {
        //     //     products: {
        //     //         $map: {
        //     //             input: "$products",
        //     //             as: "r",
        //     //             in: { $toString: "$$r.price" }
        //     //         }
        //     //     }
        //     // }
        // }
    ]);

    res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: categories
    })
}


module.exports = {
    category,
    categories,
    productOfCategory,
    getCategoryChilds
}