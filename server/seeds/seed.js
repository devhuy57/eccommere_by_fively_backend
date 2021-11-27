const categorySeed = require("./category_seed");
let mongooseClient = require('mongoose');
const productSeed = require("./product_seed");

require("dotenv").config()
let MONGOOSE_URI = process.env.MONGOOSE_URI

async function seedDB() {
    await mongooseClient.connect(MONGOOSE_URI, {
        useNewUrlParser: true,
    })
    try {
        await categorySeed()
        await productSeed()
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB()