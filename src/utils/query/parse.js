const defaultParams = require("./defaultParams");

function prepare(item, _default) {
    const regExp = /^\d+$/;

    if (regExp.test(item)) {
        item = +item;
    } else {
        item = _default;
    }

    return item;
}

function parseLimit(limit, _default = defaultParams.limit) {
    const _limit = prepare(limit, _default);

    if (_limit < 1) {
        return _default;
    }

    return _limit;
}

function parseOffset(offset, _default = defaultParams.offset) {
    return prepare(offset, _default);
}

function parseOrderBy(orderBy) {
    if (orderBy === "desc" || orderBy === -1) {
        return -1;
    } else {
        return 1;
    }
}

function parseSort(sortBy, orderBy) {
    if (!sortBy) {
        return { _id: -1 };
    }

    orderBy = parseOrderBy(orderBy);

    return {
        [sortBy]: orderBy,
    };
}

function parseSearch(search) {
    if (search) {
        search = search.trim();

        return search;
    }

    return "";
}

function parse(query) {
    if (!query) {
        return { ...defaultParams };
    }

    let { limit, offset, sortBy, orderBy, search } = query;

    limit = parseLimit(limit);
    offset = parseOffset(offset);
    orderBy = parseOrderBy(orderBy);
    sortBy = parseSort(sortBy, orderBy);
    search = parseSearch(search);

    return {
        ...query,
        limit,
        offset,
        sortBy,
        orderBy,
        search,
    };
}

module.exports = parse;
