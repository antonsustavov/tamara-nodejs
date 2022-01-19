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

const getAll = query.schema.keys({
    transmitterId: idRule,
});

const getById = Joi.object().keys({
    id: idRule.required(),
});

const remove = getById;

const baseSchema = {
    heartRate: Joi.number(),
    sleep: Joi.number(),
    steps: Joi.number(),
    calories: Joi.number(),
    exerciseDuration: Joi.number(),
    standing: Joi.number(),
    abnormalHeartRates: Joi.number(),
    falls: Joi.number(),
    ecgReadings: Joi.number(),
    accelerometer: Joi.number(),
    gyroscope: Joi.number(),
    gyroChanges: Joi.number(),
    temperature: Joi.number(),
    dateTime: Joi.date(),
    transmitter: idRule,
};

const create = Joi.array().items(
    Joi.object({
        ...baseSchema,
        transmitter: baseSchema.transmitter.required(),
    })
);

const update = Joi.object({
    ...baseSchema,
});

module.exports = { getAll, getById, create, update, remove };
