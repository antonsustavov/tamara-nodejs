const router = require("express").Router();

const controller = require("./version.controller");

router.get("/", controller.get);

module.exports = router;
