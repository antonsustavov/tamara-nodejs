const Joi = require("joi");

const query = require("../../utils/query");
const validator = require("../../utils/validator");
const locale = require("../../utils/locale");

const idRule = Joi.string()
    .regex(validator.constants.objectId)
    .options({
        messages: {
            "string.pattern.base": locale.translate(
                locale.constants.defaultLocale,
                "errors.joi.string.pattern.base"
            ),
        },
    });

const getAll = query.schema;

const getById = Joi.object().keys({
    id: idRule.required(),
});

const baseSchema = {
    macAddress: Joi.string(),
    room: Joi.string(),
    transmitter: idRule,
};

const create = Joi.object({
    ...baseSchema,
    macAddress: baseSchema.macAddress.required(),
    room: baseSchema.room.required(),
    transmitter: baseSchema.transmitter.required(),
});

const update = Joi.object({
    ...baseSchema,
});

const remove = getById;

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
