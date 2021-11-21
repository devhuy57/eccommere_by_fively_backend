let Joi = require('@hapi/joi')

let validatorBody = (schema) => {
    return (req, res, next) => {
        let validatorResult = schema.validate(req.body)
        console.log(validatorResult)
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['body']) req.value.body = {}

            req.value.body = validatorResult.value
            next()
        }
    }
}

let validatiorParams = (schema, name) => {
    return (req, res, next) => {
        let validatorResult = schema.validate({ params: req.params[name] })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}
            req.value.params[name] = req.params[name]
            next()
        }
    }
}

let validatorQuery = (schema, name) => {
    return (req, res, next) => {
        let validatorResult = schema.validate({ query: req.query[name] })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error.details[0].message)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['query']) req.value.query = {}

            req.value.query[name] = req.query[name]
            next()
        }
    }
}
let baseSchema = {
    idSchema: Joi.object().keys({
        params: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}


module.exports = {
    validatiorParams,
    validatorQuery,
    validatorBody,
    baseSchema
}