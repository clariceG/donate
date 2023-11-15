const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');

adminRouter.post('/update-status', adminController.updateStatus); //Update status
adminRouter.post('/clear-updates', adminController.clearUpdates); //Clear status updates


module.exports = adminRouter;
