const { Types } = require("mongoose");

const PhysicalParameters = require("./physicalParameters.model");

const query = require("../../utils/query");

async function get(
    filter = {},
    queryParams = {
        ...query.defaultParams,
    }
) {
    const parameters = await PhysicalParameters.aggregate([
        { $match: filter },
        {
            $facet: {
                items: [
                    {
                        $sort: queryParams.sortBy,
                    },
                    {
                        $skip: queryParams.offset,
                    },
                    {
                        $limit: queryParams.limit,
                    },
                    {
                        $lookup: {
                            from: "transmitters",
                            localField: "transmitter",
                            foreignField: "_id",
                            as: "transmitter",
                        },
                    },
                ],
                count: [{ $count: "count" }],
            },
        },
    ]);

    const items = parameters[0].items;

    return {
        items: items,
        count: parameters[0].count.length ? parameters[0].count[0].count : 0,
    };
}

async function getById(id) {
    const physicalParameter = await get({
        _id: Types.ObjectId(id),
    });

    return physicalParameter;
}

async function create(data) {
    const newPhysicalParameter = await PhysicalParameters.create(data);

    return newPhysicalParameter;
}

async function remove(ids) {
    const removedItems = [];

    if (Array.isArray(ids)) {
        await PhysicalParameters.deleteMany({
            _id: {
                $in: ids,
            },
        });

        removedItems.push(...ids);
    } else {
        await PhysicalParameters.findByIdAndRemove(ids);

        removedItems.push(ids);
    }

    return {
        items: removedItems,
        count: removedItems.length,
    };
}

module.exports = {
    get,
    getById,
    create,
    remove,
};
