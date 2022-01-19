const fs = require("fs");
const path = require("path");

const constants = require("./constants");

function loadLocales() {
    const locales = {};

    const filesNames = fs.readdirSync(constants.pathToLocalesFolder);

    for (const fileName of filesNames) {
        if (fileName.match(/^\./)) {
            continue;
        }

        const localeFromFile = fileName.split(".")[0];

        if (localeFromFile) {
            const pathToLocaleFile = path.resolve(
                constants.pathToLocalesFolder,
                fileName
            );

            const rawData = fs.readFileSync(pathToLocaleFile, "utf-8");
            const localeData = JSON.parse(rawData);

            if (localeData) {
                locales[localeFromFile] = localeData;
            }
        }
    }

    return locales;
}

module.exports = loadLocales;
