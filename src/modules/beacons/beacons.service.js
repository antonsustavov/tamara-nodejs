const { Types } = require("mongoose");

const Beacons = require("./beacons.model");
const query = require("../../utils/query");

async function get(
    filter = {},
    queryParams = {
        ...query.defaultParams,
    }
) {
    const beacons = await Beacons.aggregate([
        { $match: filter },
        {
            $facet: {
                items: [
                    {
                        $skip: queryParams.offset,
                    },
                    {
                        $limit: queryParams.limit,
                    },
                    {
                        $lookup: {
                            from: "transmitters",
                            localField: "transmitters",
                            foreignField: "_id",
                            as: "transmitters",
                        },
                    },
                ],
                count: [{ $count: "count" }],
            },
        },
    ]);

    const beaconItems = beacons[0].items;

    return {
        items: beaconItems,
        count: beacons[0].count.length ? beacons[0].count[0].count : 0,
    };
}

async function create(data) {
    const beacon = await Beacons.findOne({
        macAddress: data.macAddress,
    });

    let newBeacon = null;

    if (beacon) {
        newBeacon = await Beacons.findByIdAndUpdate(
            beacon._id,
            {
                room: data.room,
                $addToSet: { transmitters: Types.ObjectId(data.transmitter) },
            },
            {
                new: true,
            }
        );
    } else {
        data.transmitters = [data.transmitter];

        newBeacon = await Beacons.create(data);
    }

    return newBeacon;
}

async function update(id, data) {
    const updatedBeacon = await Beacons.findByIdAndUpdate(id, data, {
        new: true,
    });

    return updatedBeacon;
}

async function remove(id) {
    const removedBeacon = await Beacons.findByIdAndRemove(id);

    return removedBeacon;
}

module.exports = {
    get,
    create,
    update,
    remove,
};
