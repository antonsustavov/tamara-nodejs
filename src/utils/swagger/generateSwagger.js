const config = require("../../config");

const { local, dev, staging } = config.server;

const localServerUrl = `${local.host}:${local.port}/api/v1`;
const devServerUrl = `${dev.host}/api/v1`;
const stagingServerUrl = `${staging.host}/api/v1`;

const servers = [localServerUrl, devServerUrl, stagingServerUrl];

function generateSwaggerConfig() {
    const swagger = {
        swaggerDefinition: {
            openapi: "3.0.3",
            info: {
                version: "1.0.0",
                title: "APIs Documentation for Tamara App",
            },
            servers: servers.map((url) => ({ url })),
            security: [
                {
                    bearerAuth: ["read", "write"],
                },
            ],
        },
        apis: ["./src/**/**.swagger.yaml"],
    };

    return swagger;
}

const swaggerConfig = generateSwaggerConfig();

module.exports = swaggerConfig;
