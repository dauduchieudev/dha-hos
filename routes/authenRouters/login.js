const express = require('express')
const router = express.Router();

const loginController = require('../../controllers/authenControllers/login.js');
const passport = require('passport');

router.get('/', loginController.show);
router.post('/', loginController.submit(passport));

module.exports = router;

