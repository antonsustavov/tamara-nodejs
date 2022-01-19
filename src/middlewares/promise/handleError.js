const logger = require("../../utils/logger");

function handleError(res, err = {}) {
    logger.error(err.stack);

    return res.status(err.status || 500).json({ error: err.message });
}

module.exports = handleError;
