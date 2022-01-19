module.exports = (fn) => (req, res, next) => {
    return fn(req, res, next)
        .then((response) => {
            response.status(response.status || 200);

            if (response.payload) {
                return response.json(response.payload);
            }

            return response.send();
        })
        .catch((err) =>
            res.status(err.status | 400).json({ error: err.message })
        );
};
