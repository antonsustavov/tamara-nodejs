const { Schema, model, Types } = require("mongoose");

const transmitterConstants = require("../transmitters/transmitters.constants");
const constants = require("./beacons.constants");

const BeaconSchema = new Schema(
    {
        macAddress: {
            type: String,
            required: true,
        },
        room: {
            type: String,
            required: true,
        },
        transmitters: {
            type: [Types.ObjectId],
            ref: transmitterConstants.tableName,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

module.exports = model(constants.tableName, BeaconSchema);
