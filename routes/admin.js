const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');

adminRouter.post('/update-status', adminController.updateStatus);
adminRouter.post('/clear-updates', adminController.clearUpdates);

module.exports = adminRouter;
