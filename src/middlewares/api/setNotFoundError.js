const createError = require("http-errors");

function setNotFoundError() {
    return Promise.reject(createError(404));
}

module.exports = setNotFoundError;
