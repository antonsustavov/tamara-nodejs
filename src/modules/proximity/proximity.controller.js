const { Types } = require("mongoose");
const dayjs = require("dayjs");

const service = require("./proximity.service");
const query = require("../../utils/query");

const { periodValues } = require("./proximity.constants");

function get(req, res) {
    const parsedQuery = query.parse(req.query);

    const { offset, limit, transmitterId, dateFrom, dateTo, room } =
        parsedQuery;

    const queryParams = { offset, limit };
    const filter = {};

    if (transmitterId) {
        filter.transmitter = Types.ObjectId(transmitterId);
    }

    if (dateFrom) {
        filter.dateTime = {};
        filter.dateTime.$gte = new Date(dateFrom);
    }

    if (dateTo) {
        filter.dateTime = { ...filter.dateTime };
        filter.dateTime.$lt = new Date(dateTo);
    }

    if (room) {
        filter.room = room;
    }

    res.promise(service.get(filter, queryParams));
}

function getById(req, res) {
    const filter = {
        _id: Types.ObjectId(req.params.id),
    };

    res.promise(service.get(filter));
}

function getHistoryByRoom(req, res) {
    const parsedQuery = query.parse(req.query);
    const { locale } = req;

    const {
        offset,
        limit,
        sortBy,
        transmitterId,
        period,
        dateFrom,
        dateTo,
        room,
    } = parsedQuery;

    const queryParams = { offset, limit, sortBy, locale };
    const filter = {};

    filter.transmitter = Types.ObjectId(transmitterId);

    if (period) {
        switch (period) {
            case periodValues.CURRENT_MONTH:
            default: {
                filter.dateTime = {
                    $gte: new Date(dayjs().startOf("month")),
                    $lte: new Date(dayjs().endOf("day")),
                };

                break;
            }

            case periodValues.PREVIOUS_MONTH: {
                const lastMonth = dayjs().subtract(1, "month");

                filter.dateTime = {
                    $gte: new Date(lastMonth.startOf("month")),
                    $lte: new Date(lastMonth.endOf("month")),
                };

                break;
            }

            case periodValues.LAST_20_DAYS: {
                filter.dateTime = {
                    $gte: new Date(dayjs().subtract(20, "days").startOf("day")),
                    $lte: new Date(dayjs().endOf("day")),
                };

                break;
            }
        }
    } else {
        if (dateFrom) {
            filter.dateTime = {};
            filter.dateTime.$gte = new Date(dayjs(dateFrom).startOf("day"));
        }

        if (dateTo) {
            filter.dateTime = { ...filter.dateTime };
            filter.dateTime.$lte = new Date(dayjs(dateTo).endOf("day"));
        }
    }

    if (room) {
        filter.room = room;
    }

    res.promise(service.getHistoryByRoom(filter, queryParams));
}

function create(req, res) {
    res.promise(service.create(req.body));
}

function remove(req, res) {
    res.promise(service.remove(req.params.id));
}

module.exports = {
    get,
    getById,
    getHistoryByRoom,
    create,
    remove,
};
