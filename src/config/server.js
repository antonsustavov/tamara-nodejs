const package = require("../../package.json");
require("dotenv").config();

module.exports = {
    local: {
        host: "http://localhost",
        port: "3015",
    },
    dev: {
        host: "https://backend-dev.tamara.lampawork.com",
        port: "3015",
    },
    staging: {
        host: "https://homecare.tamaratech.com",
        port: "3015",
    },
    get host() {
        const { host } = this[process.env.NODE_ENV];

        return host ? host : this.local.host;
    },
    get port() {
        const { port } = this[process.env.NODE_ENV];

        return port ? port : this.local.port;
    },
    get url() {
        const { host, port } = this[process.env.NODE_ENV];

        if (!host || !port) {
            const { host, port } = this.local;

            return `${host}${port ? `:${port}` : ""}`;
        }

        return `${host}${port ? `:${port}` : ""}`;
    },
    get version() {
        return package.version;
    },
};
