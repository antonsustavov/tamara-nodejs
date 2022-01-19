const Joi = require("joi");

const query = require("../../utils/query");
const validator = require("../../utils/validator");
const locale = require("../../utils/locale");

const { periodValues, sortValues } = require("./proximity.constants");

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
    dateFrom: Joi.date(),
    dateTo: Joi.date(),
    sortBy: Joi.string().valid(...sortValues),
    orderBy: Joi.string().valid(...Object.keys(validator.constants.sortOrders)),
});

const getById = Joi.object().keys({
    id: idRule.required(),
});

const getHistoryByRoom = Joi.object().keys({
    transmitterId: idRule.required(),
    room: Joi.string().max(16).required(),
    period: Joi.string().valid(...Object.keys(periodValues)),
    dateFrom: Joi.date(),
    dateTo: Joi.date(),
    sortBy: Joi.string().valid(...sortValues),
    orderBy: Joi.string().valid(...Object.keys(validator.constants.sortOrders)),
});

const remove = getById;

const baseBodySchema = {
    transmitter: Joi.string(),
    closestRoom: Joi.string(),
    closestRoomSignal: Joi.number(),
    veryClose: Joi.string(),
    veryCloseSignal: Joi.number(),
    dateTime: Joi.date(),
};

const create = Joi.object({
    ...baseBodySchema,
    transmitter: baseBodySchema.transmitter.required(),
    closestRoom: baseBodySchema.closestRoom.required(),
    closestRoomSignal: baseBodySchema.closestRoomSignal.required(),
    dateTime: baseBodySchema.dateTime.required(),
});

module.exports = {
    getAll,
    getById,
    getHistoryByRoom,
    create,
    remove,
};
