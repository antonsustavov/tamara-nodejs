const createError = require("http-errors");

function setUnknownError(error) {
    return Promise.reject(createError(error));
}

module.exports = setUnknownError;
