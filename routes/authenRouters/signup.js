const express = require('express')
const router = express.Router();

const signupController = require('../../controllers/authenControllers/signup.js');

router.get('/', signupController.show);
router.post('/', signupController.submit);

module.exports = router;

