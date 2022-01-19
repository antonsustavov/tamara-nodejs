const defaultParams = {
    limit: 10,
    offset: 0,
    orderBy: -1,
    sortBy: {
        _id: -1,
    },
    search: "",
};

module.exports = {
    ...defaultParams,
};
