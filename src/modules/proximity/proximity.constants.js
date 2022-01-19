const tableName = "proximity";

const periodValues = {
    CURRENT_MONTH: "CURRENT_MONTH",
    PREVIOUS_MONTH: "PREVIOUS_MONTH",
    LAST_20_DAYS: "LAST_20_DAYS",
};

const sortValues = ["dateTime"];

module.exports = {
    tableName,
    periodValues,
    sortValues,
};
