const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    status: String,
    timestamp: { type: Date, default: Date.now },
});

const trackerSchema = new mongoose.Schema({
    statuses: [statusSchema],
});

module.exports = mongoose.model('Tracker', trackerSchema);
