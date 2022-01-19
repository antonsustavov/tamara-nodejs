const getAvailableLocales = require("./getAvailableLocales");
const locales = require("./locales");
const translate = require("./translate");

const constants = require("./constants");

const availableLocales = getAvailableLocales(locales);

module.exports = { constants, locales, availableLocales, translate };
