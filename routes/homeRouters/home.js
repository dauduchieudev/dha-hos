const homeController = require("../../controllers/homeControllers/home.js");

const express = require("express");
const router = express.Router();

router.get("/", homeController.show);

module.exports = router;