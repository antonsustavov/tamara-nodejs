const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const PhysicalParametersService = require("../physicalParameters/physicalParameters.service");

const Transmitters = require("./transmitters.model");
const BeaconsService = require("../beacons/beacons.service");
const BeaconModel = require("../beacons/beacons.model");

const query = require("../../utils/query");

async function get(
    filter = {},
    queryParams = {
        ...query.defaultParams,
    }
) {
    const transmitters = await Transmitters.aggregate([
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
                ],
                count: [{ $count: "count" }],
            },
        },
    ]);

    const transmitterItems = transmitters[0].items;

    return {
        items: transmitterItems,
        count: transmitters[0].count.length
            ? transmitters[0].count[0].count
            : 0,
    };
}

async function getById(id) {
    const transmitters = await get({
        _id: id,
    });

    if (!transmitters.count) {
        return transmitters;
    }

    const toDate = dayjs().endOf("day");
    const fromDate = toDate.clone().subtract(7, "days").startOf("day");

    transmitters.items[0] = {
        ...transmitters.items[0],
        activity: await getActivity(id, new Date(fromDate), new Date(toDate)),
    };

    return transmitters;
}

async function getBeaconsOfTransmitter(
    id,
    queryParams = {
        ...query.defaultParams,
    }
) {
    const beacons = await BeaconsService.get(
        {
            transmitters: {
                $in: [id],
            },
        },
        queryParams
    );

    return beacons;
}

async function removeTransmitterFromBeacon(transmitterId, beaconId) {
    const beacon = await BeaconModel.findOne({
        _id: beaconId,
        transmitters: {
            $in: [transmitterId],
        },
    });

    if (!beacon) {
        return {};
    }

    if (beacon.transmitters && beacon.transmitters.length <= 1) {
        const removeResult = await BeaconsService.remove(beaconId);

        return removeResult;
    }

    const newBeacon = await BeaconsService.update(
        {
            _id: beaconId,
        },
        {
            $pull: {
                transmitters: transmitterId,
            },
        }
    );

    return newBeacon;
}

async function create(data) {
    const newTransmitter = await Transmitters.create(data);

    return newTransmitter;
}

async function update(id, data) {
    const updatedTransmitter = await Transmitters.findByIdAndUpdate(id, data, {
        new: true,
    });

    return updatedTransmitter;
}

async function remove(id) {
    const removedTransmitter = await Transmitters.findByIdAndRemove(id);

    return removedTransmitter;
}

async function getActivity(transmitterId, dateFrom, dateTo) {
    const physicalParameters = await PhysicalParametersService.get(
        {
            transmitter: transmitterId,
            dateTime: {
                $gte: dateFrom,
                $lte: dateTo,
            },
        },
        {
            offset: 0,
            limit: Number.MAX_SAFE_INTEGER,
            sortBy: {
                dateTime: 1,
            },
        }
    );

    if (!physicalParameters.count) {
        return [];
    }

    const items = physicalParameters.items;

    const MAX_INACTIVE_DURATION = 3; // in minutes

    const STATUS = {
        ACTIVE: "ACTIVE",
        INACTIVE: "INACTIVE",
    };

    const periods = [];
    let activeLongPeriodItem;
    let inactiveLongPeriodItem;

    const addPeriod = (fromDate, toDate, status) => {
        periods.push({
            time: {
                from: fromDate.toISOString(),
                to: toDate.toISOString(),
            },
            status,
        });
    };

    const getStatus = (fromDate, toDate) => {
        const inactiveDate = fromDate
            .clone()
            .add(MAX_INACTIVE_DURATION, "minute");

        if (toDate.isBetween(fromDate, inactiveDate)) {
            return STATUS.ACTIVE;
        }

        return STATUS.INACTIVE;
    };

    /* 
		Check is Transmitter wear device.
		Checking this with hear rate param
	*/
    const checkIsDeviceWearing = (heartRate = -1) => {
        return heartRate >= 0 ? true : false;
    };

    for (let i = 0; i < items.length; i++) {
        const firstItem = items[i];
        const nextItem = items[i + 1];

        let fromDate, toDate;

        fromDate = dayjs(firstItem.dateTime);

        if (nextItem) {
            toDate = dayjs(nextItem.dateTime);
        } else {
            toDate = dayjs();
        }

        const status = getStatus(fromDate, toDate);
        const isDeviceWearing = checkIsDeviceWearing(firstItem.heartRate);

        if (!isDeviceWearing) {
            addPeriod(fromDate, toDate, STATUS.INACTIVE);

            continue;
        }

        if (status === STATUS.INACTIVE) {
            const lastActiveDate = fromDate.clone().add(1, "minute");

            addPeriod(fromDate, lastActiveDate, STATUS.ACTIVE);

            fromDate = lastActiveDate.clone();
        }

        addPeriod(fromDate, toDate, status);
    }

    /*
		Group items to ACTIVE/INACTIVE statuses
	*/

    const groupedPeriods = [];
    let acc = null;

    for (let i = 0; i < periods.length; i++) {
        let first = periods[i];
        let second = periods[i + 1];

        if (!second) {
            if (acc) {
                groupedPeriods.unshift({
                    status: acc.status,
                    time: {
                        from: acc.time.from,
                        to: first.time.to,
                    },
                });
            } else {
                groupedPeriods.unshift({ ...first });
            }

            continue;
        }

        if (first.status === second.status) {
            if (!acc) {
                acc = { ...first };
            }
        } else {
            if (acc) {
                groupedPeriods.unshift({
                    status: acc.status,
                    time: {
                        from: acc.time.from,
                        to: first.time.to,
                    },
                });

                acc = null;
            } else {
                groupedPeriods.unshift({ ...first });
            }
        }
    }

    return groupedPeriods;
}

module.exports = {
    get,
    getById,
    getBeaconsOfTransmitter,
    removeTransmitterFromBeacon,
    create,
    update,
    remove,
};
