let mongoose = require('mongoose')
let Schema = mongoose.Schema

let categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        unique: true,
        trim: true,
        transform: unescape
    },
    description: {
        type: String
    },
    colors: {
        type: String,
        default: 'FF865E'
    },
    tags: {
        type: Array
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        default: null,
    },
    logical_delete: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v
            delete ret.logical_delete
            return ret;
        },
    }
})

let CategoryModel = mongoose.model('categories', categorySchema)
module.exports = CategoryModel