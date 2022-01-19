const { Types } = require("mongoose");

const service = require("./beacons.service");
const query = require("../../utils/query");

function get(req, res) {
    const parsedQuery = query.parse(req.query);
    const { offset, limit } = parsedQuery;
    const queryParams = { offset, limit };

    res.promise(service.get({}, queryParams));
}

function getById(req, res) {
    const filter = {
        _id: Types.ObjectId(req.params.id),
    };

    res.promise(service.get(filter));
}

function create(req, res) {
    res.promise(service.create(req.body));
}

function update(req, res) {
    res.promise(service.update(req.params.id, req.body));
}

function remove(req, res) {
    res.promise(service.remove(req.params.id));
}

module.exports = {
    get,
    getById,
    create,
    update,
    remove,
};
