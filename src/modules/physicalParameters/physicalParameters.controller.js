const { Types } = require("mongoose");

const service = require("./physicalParameters.service");
const query = require("../../utils/query");

function get(req, res) {
    const parsedQuery = query.parse(req.query);
    const { offset, limit, transmitterId } = parsedQuery;
    const queryParams = {
        offset,
        limit,
        sortBy: {
            dateTime: -1,
        },
    };

    const filter = {};

    if (transmitterId) {
        filter.transmitter = Types.ObjectId(transmitterId);
    }

    res.promise(service.get(filter, queryParams));
}

function getById(req, res) {
    res.promise(service.getById(req.params.id));
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
    create,
    remove,
};
