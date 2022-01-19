const { Schema, Types, model } = require("mongoose");

const Transmitters = require("../transmitters");
const constants = require("./proximity.constants");

const ProximitySchema = new Schema(
    {
        transmitter: {
            type: Types.ObjectId,
            ref: Transmitters.constants.tableName,
            required: true,
        },
        closestRoom: {
            type: String,
            required: true,
        },
        closestRoomSignal: {
            type: Number,
            required: true,
        },
        veryClose: {
            type: String,
            required: false,
        },
        veryCloseSignal: {
            type: Number,
            required: false,
        },
        dateTime: {
            type: Date,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: { createdAt: false, updatedAt: false },
    }
);

module.exports = model(constants.tableName, ProximitySchema);
