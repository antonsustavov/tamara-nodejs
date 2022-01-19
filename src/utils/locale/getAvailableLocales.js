let localesFound = null;

function getAvailableLocales(locales) {
    if (!localesFound) {
        localesFound = [];

        for (const locale in locales) {
            localesFound.push(locale);
        }
    }

    return localesFound;
}

module.exports = getAvailableLocales;
