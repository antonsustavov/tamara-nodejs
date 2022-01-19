const service = require("./version.service");

function get(req, res) {
    res.promise(service.get());
}

module.exports = {
    get,
};
