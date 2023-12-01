const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/stkpush', donationController.stkPush);

module.exports = router;
