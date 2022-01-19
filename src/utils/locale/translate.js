const locales = require("./locales");
const getAvailableLocales = require("./getAvailableLocales");

function translate(locale, path) {
    const availableLocales = getAvailableLocales();

    if (!availableLocales.includes(locale)) {
        return "unknown word";
    }

    const currentLocale = locales[locale];
    const translation = path.split(".").reduce((o, i) => o[i], currentLocale);

    return translation;
}

module.exports = translate;
