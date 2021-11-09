let CategoryModel = require('../models/category_model')
let ProductModel = require('../models/product_model')
let faker = require('faker')
const generateSequence = require('../helpers/sequence_helper')
let ProductAttrModel = require('../models/product_attribute')

let productSeed = async () => {
    for (i = 0; i < 50; i++) {
        // 
        let category = await CategoryModel.aggregate([
            { $sample: { size: 1 } },
            { $match: { _id: { $exists: true } } }
        ])

        let attributes = []
        for (j = 0; j < 5; j++) {
            let attribute = new ProductAttrModel({
                description: faker.lorem.paragraphs(),
                likes: faker.datatype.number(),
            })

            await attribute.save()
            attributes.push(attribute._id)
        }

        let images = [
            'product/img_product.png',
            'product/product1.png',
            'product/product2.png',
            'product/product3.png',
            'product/product4.png',
            'product/product5.png',
            'product/product6.png',
            'product/product7.png',
            'product/product8.png',
        ]

        let product = new ProductModel({
            productId: await generateSequence('PR', category[0].shortName),
            productName: faker.commerce.productName(),
            description: faker.lorem.paragraphs(),
            attributes: attributes,
            categories: [category[0]._id],
            price: faker.commerce.price(),
            avatar: images[Math.floor(Math.random() * images.length)],
            quantity: faker.datatype.number(),
        })
        // 
        await product.save()
    }
}

module.exports = productSeed