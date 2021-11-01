const path = require("path")

converterServerToRealPath = (serverPath) => path.normalize(serverPath).split("\\").slice(1).join("/")


module.exports = {
    converterServerToRealPath
}