const server = require("./server");
const db = require("./db");

const config = {
    server,
    db,
};

module.exports = {
    ...config,
};
