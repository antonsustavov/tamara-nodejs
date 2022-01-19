const path = require("path");

const defaultLocale = "en";

const pathToLocalesFolder = path.resolve(
    __dirname,
    "..",
    "..",
    "localizations"
);

module.exports = { defaultLocale, pathToLocalesFolder };
