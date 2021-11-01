let mongoose = require('mongoose')
let Schema = mongoose.Schema

let productSchema = new Schema({
    productId: {
        type: String,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    attributes: [{
        type: Schema.Types.ObjectId,
        ref: 'product_attrs'
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }],
    price: {
        type: Schema.Types.Decimal128,
        required: true
    },
    avatar: {
        type: String,
        default: "product/img_product.png"
    },
    logical_delete: {
        type: Date,
        default: null
    },
    sale: {
        type: Number,
        max: 100,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0
    },
    background: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
    toJSON: {
        getters: true,
        transform: (doc, ret) => {
            if (ret.price) ret.price = ret.price.toString()
            delete ret.__v
            delete ret.logical_delete
            return ret;
        },
    }
})

productSchema.pre('find', async function (docs) {
    this.populate('attributes')
    this.populate('categories')
});

let ProductModel = mongoose.model('products', productSchema)
module.exports = ProductModel