const modules = require("../modules");

require("dotenv").config();

const prefix = "mongodb://";
const host = "localhost";
const port = "27017";
const name = "tamara";

let connectionUrl = "";

switch (process.env.NODE_ENV) {
    case "local": {
        connectionUrl = `${prefix}${host}:${port}/${name}`;

        break;
    }

    case "dev": {
        const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

        connectionUrl = `${prefix}${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${host}:${port}/${name}?authSource=admin&w=1`;

        break;
    }

    case "prod": {
        const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

        connectionUrl = `${prefix}${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${host}:${port}/${name}?authSource=admin&w=1`;

        break;
    }

    default: {
        const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

        connectionUrl = `${prefix}${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${host}:${port}/${name}?authSource=admin&w=1`;

        break;
    }
}

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const tables = {
    Transmitters: modules.Transmitters.model,
    Proximity: modules.Proximity.model,
    Beacons: modules.Beacons.model,
    PhysicalParameters: modules.PhysicalParameters.model,
};

const db = {
    connectionUrl,
    connectionParams,
    name,
    tables,
};

module.exports = {
    ...db,
};
