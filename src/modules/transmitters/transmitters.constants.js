const tableName = "transmitters";

const userTypes = {
    PATIENT: "PATIENT",
    CARE_GIVER: "CARE_GIVER",
    FAMILY_MEMBER: "FAMILY_MEMBER",
    NURSE: "NURSE",
};

const appTypes = {
    MOBILE: "MOBILE",
    WATCH: "WATCH",
};

const defaultImage =
    "https://www.loftladderscotland.com/avatars/default_avatar.png";

module.exports = {
    tableName,
    userTypes,
    appTypes,
    defaultImage,
};
