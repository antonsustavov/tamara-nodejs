const { Types } = require("mongoose");
const dayjs = require("dayjs");
const isToday = require("dayjs/plugin/isToday");
const isYesterday = require("dayjs/plugin/isYesterday");
const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isBetween);

const Proximity = require("./proximity.model");

const query = require("../../utils/query");
const translate = require("../../utils/locale/translate");

async function get(
    filter = {},
    queryParams = {
        ...query.defaultParams,
    }
) {
    const proximity = await Proximity.aggregate([
        { $match: filter },
        {
            $facet: {
                items: [
                    {
                        $sort: queryParams.sortBy || {
                            dateTime: -1,
                        },
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

    const proximityItems = proximity[0].items;

    return {
        items: proximityItems,
        count: proximity[0].count.length ? proximity[0].count[0].count : 0,
    };
}

async function getById(id) {
    const proximity = await get({
        _id: Types.ObjectId(id),
    });

    return proximity;
}

async function getHistoryByRoom(
    filter = {},
    queryParams = {
        ...query.defaultParams,
    }
) {
    const searchFilter = {
        transmitter: filter.transmitter,
    };

    if (filter.dateTime) {
        searchFilter.dateTime = filter.dateTime;
    }

    const history = await get(searchFilter, {
        ...queryParams,
        offset: 0,
        limit: Number.MAX_SAFE_INTEGER,
        sortBy: {
            dateTime: 1,
        },
    });

    const todayStingTranslationPath = "proximity.history.today";
    const yesterdayStingTranslationPath = "proximity.history.yesterday";
    const locale = queryParams.locale;

    /*
		1. Group all found items by dates
			Example:
				{
					2021-06-11: [item1, item2, ...]
					yesterday: [item1, item2, ...]
					today: [item1, item2, ...]
				}
	*/

    const todaySting = translate(locale, todayStingTranslationPath);
    const yesterdaySting = translate(locale, yesterdayStingTranslationPath);

    const daysObj = {};

    for (const item of history.items) {
        const itemDateTime = dayjs(item.dateTime);

        /* 
			Get date string value. Examples: "today" | "yesterday" | 06-11-2021
		*/

        let dateStringValue;

        if (itemDateTime.isToday()) {
            dateStringValue = todaySting;
        } else if (itemDateTime.isYesterday()) {
            dateStringValue = yesterdaySting;
        } else {
            dateStringValue = itemDateTime.format("DD-MM-YYYY");
        }

        /* 
			Add item to object
		*/

        if (!daysObj[dateStringValue]) {
            daysObj[dateStringValue] = [];
        }

        daysObj[dateStringValue].push(item);
    }

    /*
		2. Calculate the periods of the transmitter's stay 
		in the selected room
			Example:
				[
					{
						"date": "06-11-2021",
						"time": [
						{
							"from": "06-11-2021T21:13:30.518Z",
							"to": "06-11-2021T23:59:31.285Z"
						},
						...
					},
					{
						"date": "07-11-2021",
						"time": [
						{
							"from": "07-11-2021T21:13:30.518Z",
							"to": "07-11-2021T23:59:31.285Z"
						},
						...
					},
					...
				]
	*/

    const MAX_INACTIVE_DURATION = 3; // in minutes
    const selectedRoom = filter.room;
    const periods = [];

    /* 
		2.1 For each of the found days we find translations
		of the transmitter's stay in the selected room.
	*/

    for (const day in daysObj) {
        const dayString = day;
        const daySignals = daysObj[day];

        const endOfDay = dayjs(dayString).endOf("day");

        const daysPeriods = [];

        let longPeriodDate = null;

        /* 
			2.2 The period of stay in the room is calculated
			by comparing 2 neighboring signals received from
			the client. Compare the dates of the 2 signals 
			firstDate and secondDate, which are taken from
			firstSignal and secondSignal, respectively. 
			The value 
			inactiveDate = firstDate + MAX_INACTIVE_DURATION
			is also added.

			Periods of activity and their duration are
			defined as follows:
			If toDate is between firstDate and inactiveDate,
				then
					this means that the period can be long.
					In this case, the value fromDate is
					written to the variable longPeriodDate,
					which serves as a accumulator.
				otherwise
					the value of longPeriodDate is checked
					(check if we are now and for a long period).
					If so,
						then
							the value of the period from is
							written to the value of
							longPeriodDate, and the value to
							is from fromDate.
						otherwise
							the period is considered short
							and the values fromDate and toDate
							are written to the array of periods
							of that day.
			It is also important to note that at each iteration,
			the signal is checked to see if it was sent from the
			room we need. If the next signal was from another
			room, it is checked for a long period. If the check
			is true, then the values from - longPeriodDate and
			to - fromDate are written to the period array.
		*/

        for (let i = 0; i < daySignals.length; i++) {
            const firstSignal = daySignals[i];
            const secondSignal = daySignals[i + 1];

            let fromDate, toDate, inactiveDate;

            fromDate = dayjs(firstSignal.dateTime);
            inactiveDate = fromDate
                .clone()
                .add(MAX_INACTIVE_DURATION, "minutes");

            if (selectedRoom !== firstSignal.closestRoom) {
                if (longPeriodDate) {
                    daysPeriods.unshift({
                        from: longPeriodDate.toISOString(),
                        to: fromDate.toISOString(),
                    });

                    longPeriodDate = null;
                }
                continue;
            }

            if (secondSignal) {
                toDate = dayjs(secondSignal.dateTime);
            } else {
                toDate = endOfDay.clone();
            }

            if (toDate.isBetween(fromDate, inactiveDate)) {
                if (!longPeriodDate) {
                    longPeriodDate = fromDate.clone();
                }
            } else {
                if (longPeriodDate) {
                    daysPeriods.unshift({
                        from: longPeriodDate.toISOString(),
                        to: fromDate.add(1, "minutes").toISOString(),
                    });

                    longPeriodDate = null;
                } else {
                    daysPeriods.unshift({
                        from: fromDate.toISOString(),
                        to: fromDate.add(1, "minutes").toISOString(),
                    });
                }
            }
        }

        if (queryParams.sortBy && queryParams.sortBy.dateTime) {
            const { dateTime } = queryParams.sortBy;

            if (dateTime > 0) {
                periods.push({
                    date: dayString,
                    time: daysPeriods,
                });
            } else {
                periods.unshift({
                    date: dayString,
                    time: daysPeriods,
                });
            }
        }
    }

    return periods;
}

async function create(data) {
    data.dateTime = new Date(data.dateTime);

    const newProximity = await Proximity.create(data);

    return newProximity;
}

async function remove(id) {
    const removedItems = [];

    await Proximity.findByIdAndRemove(id).lean();

    removedItems.push(id);

    return {
        items: removedItems,
        count: removedItems.length,
    };
}

module.exports = {
    get,
    getById,
    getHistoryByRoom,
    create,
    remove,
};
