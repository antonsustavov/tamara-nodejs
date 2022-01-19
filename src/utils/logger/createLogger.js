const winston = require("winston");

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss:ms";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || "local";
    const isDevelopment = env === "local";
    return isDevelopment ? "debug" : "warn";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

const format = {
    console: winston.format.combine(
        winston.format.timestamp({ format: dateTimeFormat }),
        winston.format.colorize(),
        winston.format.errors({ stack: true }),
        winston.format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    file: winston.format.combine(
        winston.format.timestamp({ format: dateTimeFormat }),
        winston.format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
};

const transports = [
    new winston.transports.Console({
        format: format.console,
    }),
    new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
        format: format.file,
    }),
    new winston.transports.File({
        filename: "logs/all.log",
        format: format.file,
    }),
];

function createLogger() {
    return winston.createLogger({
        level: level(),
        levels,
        transports,
    });
}

module.exports = createLogger;
