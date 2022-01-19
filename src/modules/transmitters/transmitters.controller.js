const { Types } = require("mongoose");

const service = require("./transmitters.service");
const query = require("../../utils/query");

function get(req, res) {
    const parsedQuery = query.parse(req.query);
    const { offset, limit } = parsedQuery;
    const queryParams = { offset, limit };

    res.promise(service.get({}, queryParams));
}

function getById(req, res) {
    const id = Types.ObjectId(req.params.id);

    res.promise(service.getById(id));
}

function getBeaconsOfTransmitter(req, res) {
    const parsedQuery = query.parse(req.query);
    const id = Types.ObjectId(req.params.id);

    res.promise(service.getBeaconsOfTransmitter(id, parsedQuery));
}

function removeTransmitterFromBeacon(req, res) {
    const id = Types.ObjectId(req.params.id);
    const beaconId = Types.ObjectId(req.params.beaconId);

    res.promise(service.removeTransmitterFromBeacon(id, beaconId));
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
    getBeaconsOfTransmitter,
    removeTransmitterFromBeacon,
    create,
    update,
    remove,
};
