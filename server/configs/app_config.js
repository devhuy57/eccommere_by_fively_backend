require('dotenv').config()

let PORT = process.env.PORT || 3000
let PASSPORT_SERECT = process.env.PASSPORT_SERECT
let GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
let GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
let FCM_SERVER_KEY = process.env.SERVER_KEY


let PAGE_SIZE = 15


module.exports = {
    PORT,
    PASSPORT_SERECT,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    PAGE_SIZE,
    FCM_SERVER_KEY,
}