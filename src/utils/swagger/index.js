const swaggerJsdoc = require("swagger-jsdoc");

const swaggerConfig = require("./generateSwagger");

const specs = swaggerJsdoc(swaggerConfig);

module.exports = {
    swaggerConfig,
    specs,
};
