const { constants, availableLocales } = require("../../utils/locale");

function locale() {
    return (req, res, next) => {
        const locale = req.acceptsLanguages(...availableLocales);
        const selectedLocale = locale ? locale : constants.defaultLocale;

        req.locale = selectedLocale;

        next();
    };
}

module.exports = locale;
