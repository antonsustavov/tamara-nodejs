const server = require("../../config/server");

async function get() {
    return {
        api: server.version,
    };
}

module.exports = {
    get,
};
