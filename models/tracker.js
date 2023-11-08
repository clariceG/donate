const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    status: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tracker', trackerSchema);