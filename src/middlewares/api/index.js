const router = require("express").Router();

const setNotFoundError = require("./setNotFoundError");
const setUnknownError = require("./setUnknownError");

const v1 = require("./v1");

router.use("/api/v1", v1);

// eslint-disable-next-line no-unused-vars
router.use(function (req, res, next) {
    res.promise(setNotFoundError());
});
// eslint-disable-next-line no-unused-vars
router.use(function (err, req, res, next) {
    res.promise(setUnknownError(err));
});

module.exports = router;
