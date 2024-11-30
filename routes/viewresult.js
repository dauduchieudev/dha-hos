const viewResultController = require("../controllers/viewresult.js");

const express = require("express");
const router = express.Router();

router.get("/", viewResultController.show);
router.get("/:appointment_id", viewResultController.showResult);

module.exports = router;