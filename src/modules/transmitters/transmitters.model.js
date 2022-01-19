const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const constants = require("./transmitters.constants");

const TransmitterSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        kind: {
            type: String,
            enum: Object.keys(constants.userTypes),
            required: true,
        },
        appType: {
            type: String,
            enum: Object.keys(constants.appTypes),
            required: true,
        },
        image: {
            type: String,
            required: false,
            default: constants.defaultImage,
        },
        languages: {
            type: [String],
            required: false,
            default: [],
        },
    },
    { versionKey: false }
);

module.exports = mongoose.model(constants.tableName, TransmitterSchema);
