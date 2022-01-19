const router = require("express").Router();

const {
    validateRequest,
    constants: { REQUEST_PARAMS },
} = require("../../middlewares/validator");

const controller = require("./beacons.controller");
const validationSchemas = require("./beacons.validator");

router.get(
    "/",
    validateRequest(validationSchemas.getAll, REQUEST_PARAMS.QUERY),
    controller.get
);
router.get(
    "/:id",
    validateRequest(validationSchemas.getById, REQUEST_PARAMS.PARAMS),
    controller.getById
);
router.post("/", validateRequest(validationSchemas.create), controller.create);
router.put(
    "/:id",
    validateRequest(validationSchemas.getById, REQUEST_PARAMS.PARAMS),
    validateRequest(validationSchemas.update),
    controller.update
);
router.delete(
    "/:id",
    validateRequest(validationSchemas.remove, REQUEST_PARAMS.PARAMS),
    controller.remove
);

module.exports = router;
