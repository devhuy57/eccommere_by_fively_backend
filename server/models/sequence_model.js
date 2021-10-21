let mongoose = require('mongoose')
let Schema = mongoose.Schema

let sequenceSchema = new Schema({
    key: {
        type: String,
        unique: true,
        transform: unescape
    },
    prefix: {
        type: String,
        transform: unescape
    },
    number: {
        type: Number,
        default: 1
    }
})

let SequenceModel = mongoose.model('sequence', sequenceSchema)
module.exports = SequenceModel
