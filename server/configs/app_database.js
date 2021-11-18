require('dotenv').config()
let mongooseClient = require('mongoose')


let MONGOOSE_URI = process.env.MONGOOSE_URI

module.exports = DBConnection = async () => {
    try {
        console.log(MONGOOSE_URI);
        await mongooseClient.connect(MONGOOSE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Mongoose connection is successfull!")
    } catch (error) {
        console.log("🚀 ~ file: app_database.js ~ line 9 ~ DBConnection ~ error", error)
    }
}
