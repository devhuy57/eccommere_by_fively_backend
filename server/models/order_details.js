let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderDetailsSchema = new mongoose.Schema({
    orderId: {
        type: String,
    },
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Schema.Types.Decimal128,
        required: true
    }
})

let OrderDetails = mongoose.model('OrderDetails', OrderDetailsSchema);
module.exports = OrderDetails;