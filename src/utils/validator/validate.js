function validate(schema, object) {
    const { error } = schema.validate(object);
    const isValid = error == null;

    if (!isValid) {
        const { details } = error;
        const errors = details.map((i) => i.message);

        return {
            isValid,
            errors,
        };
    }

    return {
        isValid: true,
        errors: [],
    };
}

module.exports = validate;
