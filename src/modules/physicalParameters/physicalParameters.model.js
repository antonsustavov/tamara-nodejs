const { Schema, Types, model } = require("mongoose");

const TransmittersConstants = require("../transmitters/transmitters.constants");
const constants = require("./physicalParameters.constants");

const PhysicalParameterSchema = new Schema(
    {
        heartRate: {
            type: Number,
            required: false,
            default: 0,
        },
        sleep: {
            type: Number,
            required: false,
            default: 0,
        },
        steps: {
            type: Number,
            required: false,
            default: 0,
        },
        calories: {
            type: Number,
            required: false,
            default: 0,
        },
        exerciseDuration: {
            type: Number,
            required: false,
            default: 0,
        },
        standing: {
            type: Number,
            required: false,
            default: 0,
        },
        abnormalHeartRates: {
            type: Number,
            required: false,
            default: 0,
        },
        falls: {
            type: Number,
            required: false,
            default: 0,
        },
        ecgReadings: {
            type: Number,
            required: false,
            default: 0,
        },
        accelerometer: {
            type: Number,
            required: false,
            default: 0,
        },
        gyroscope: {
            type: Number,
            required: false,
            default: 0,
        },
        gyroChanges: {
            type: Number,
            required: false,
            default: 0,
        },
        temperature: {
            type: Number,
            required: false,
            default: 0,
        },
        dateTime: {
            type: Date,
            required: true,
        },
        transmitter: {
            type: Types.ObjectId,
            ref: TransmittersConstants.tableName,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: { createdAt: "dateTime", updatedAt: false },
    }
);

module.exports = model(constants.tableName, PhysicalParameterSchema);
