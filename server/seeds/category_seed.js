let faker = require('faker')
const generateSequence = require('../helpers/sequence_helper')
let CategoryModel = require('../models/category_model')


let categorySeed = async () => {
    for (i = 0; i < 20; i++) {
        // 
        let productName = faker.commerce.productName()
        let shortName = productName.split(" ").map(e => e.charAt(0)).join("")
        console.log(shortName);
        let category = new CategoryModel({
            name: productName,
            shortName: await generateSequence('CAT', shortName),
            description: faker.lorem.paragraph(),
            colors: Math.floor(Math.random() * 16777215).toString(16),
        })
        // 
        await category.save()
        for (j = 1; j <= 2; j++) {
            let productName = faker.commerce.productName()
            let shortName = productName.split(" ").map(e => e.charAt(0)).join("")

            let categoryChild = new CategoryModel({
                name: productName,
                shortName: await generateSequence('CAT', shortName),
                description: faker.lorem.paragraph(),
                colors: Math.floor(Math.random() * 16777215).toString(16),
                parentId: category._id
            })
            await categoryChild.save()
        }
    }
}

module.exports = categorySeed