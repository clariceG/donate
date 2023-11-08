const express = require('express');
const donorRouter = express.Router();
const donorController = require('../controllers/donorController');

donorRouter.get('/get-status', donorController.getStatus);

module.exports = donorRouter;
