const express = require('express')
const router = express.Router();

const logoutController = require('../../controllers/authenControllers/logout.js');

router.get('/', logoutController.show);

module.exports = router;

