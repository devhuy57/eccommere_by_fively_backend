let Joi = require('@hapi/joi')

let userSchemas = {

    newOrder: Joi.object().keys({
        address: Joi.string().required(),
        phoneNumber: Joi.string().min(10).max(10).regex(/[{0,1}[0-9]{9}]*$/).required(),
        method: Joi.number().required().valid(1, 2),
        items: Joi.array().required().length(1).items(Joi.object().keys({
            productId: Joi.string().required(),
            quantity: Joi.number().required(),
        })),

    })
}

module.exports = userSchemas;