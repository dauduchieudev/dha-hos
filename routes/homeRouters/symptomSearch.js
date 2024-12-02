const express = require("express");
const router = express.Router();

const gptSymptonController = require('../../controllers/gptSympton.js')

router.post("/", gptSymptonController.getSympton);

module.exports = router;
