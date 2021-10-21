let mongoose = require('mongoose')
let Schema = mongoose.Schema

let cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true,
})

cartSchema.pre('find', async function (docs) {
    this.populate('productId')
});

let CartModel = mongoose.model('carts', cartSchema)
module.exports = CartModel