const multer = require('multer')
let path = require('path')
let { open, fs, mkdir } = require('fs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = `uploads/${file.fieldname}`
        open(dir, eror => {
            if (eror) {
                return mkdir(dir, error => cb(error, dir))
            }
            return cb(null, dir)
        })

    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


module.exports = storage