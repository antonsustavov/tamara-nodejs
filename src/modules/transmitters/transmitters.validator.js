const Joi = require("joi");

const constants = require("./transmitters.constants");

const query = require("../../utils/query");
const validator = require("../../utils/validator");

const locale = require("../../utils/locale");

const getAll = query.schema;

const idRule = Joi.string()
    .regex(validator.constants.objectId)
    .required()
    .options({
        messages: {
            "string.pattern.base": locale.translate(
                locale.constants.defaultLocale,
                "errors.joi.string.pattern.base"
            ),
        },
    });

const getById = Joi.object().keys({
    id: idRule,
});

const removeTransmitterFromBeacon = Joi.object().keys({
    id: idRule.required(),
    beaconId: idRule.required(),
});

const remove = getById;

const baseSchema = {
    name: Joi.string().min(1).max(16),
    kind: Joi.string().valid(...Object.keys(constants.userTypes)),
    appType: Joi.string().valid(...Object.keys(constants.appTypes)),
    languages: Joi.array().items(Joi.string()),
};

const create = Joi.object({
    ...baseSchema,
    kind: baseSchema.kind.required(),
    appType: baseSchema.appType.required(),
});

const update = Joi.object({
    ...baseSchema,
});

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    removeTransmitterFromBeacon,
};
