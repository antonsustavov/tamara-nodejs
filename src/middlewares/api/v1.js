const router = require("express").Router();
router.get("/b", (rec, res) => {
    console.log(swagger);
    res.send("Hello")
})

module.exports = router