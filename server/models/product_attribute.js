let mongoose = require('mongoose')
let Schema = mongoose.Schema

let productAttributeSchema = new Schema({
    title: {
        type: String,
        default: "",
    },
    imageUrl: {
        type: String,
        default: "product/img_product.png",
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],
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


let ProductAttrModel = mongoose.model('product_attrs', productAttributeSchema)
module.exports = ProductAttrModel