const SequenceModel = require("../models/sequence_model");

let generateSequence = async (key, prefix) => {
    try {
        sequence = await SequenceModel.findOne({ key: key, prefix: prefix })
        if (sequence) {
            sequence.number = sequence.number + 1
            await sequence.save()
            return `${key}${prefix}${sequence.number}`;
        } else {
            let newSequence = new SequenceModel({
                key: key,
                prefix: prefix,
                number: 1
            })

            await newSequence.save()
            return `${key}${prefix}${newSequence.number}`;
        }
    } catch (error) {
        return 0;
    }
}

module.exports = generateSequence