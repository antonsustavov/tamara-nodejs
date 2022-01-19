const router = require("express").Router();

const {
    validateRequest,
    constants: { REQUEST_PARAMS },
} = require("../../middlewares/validator");

const controller = require("./proximity.controller");
const validationSchemas = require("./proximity.validator");

router.get(
    "/",
    validateRequest(validationSchemas.getAll, REQUEST_PARAMS.QUERY),
    controller.get
);
router.get(
    "/history",
    validateRequest(validationSchemas.getHistoryByRoom, REQUEST_PARAMS.QUERY),
    controller.getHistoryByRoom
);
router.get(
    "/:id",
    validateRequest(validationSchemas.getById, REQUEST_PARAMS.PARAMS),
    controller.getById
);
router.post("/", validateRequest(validationSchemas.create), controller.create);
router.delete(
    "/:id",
    validateRequest(validationSchemas.remove, REQUEST_PARAMS.PARAMS),
    controller.remove
);

module.exports = router;
