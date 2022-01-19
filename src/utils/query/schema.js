const Joi = require("joi");

const schema = Joi.object().keys({
    limit: Joi.number().min(1).max(100),
    offset: Joi.number().min(0),
    orderBy: Joi.number().valid(1, -1),
    search: Joi.string().max(100),
});

module.exports = schema;
