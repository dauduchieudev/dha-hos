const userHomeController = require("../../controllers/homeControllers/userhome.js");

const express = require("express");
const router = express.Router();

router.get("/", userHomeController.show);

module.exports = router;