const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String, 
    userId: String
});

module.exports = mongoose.model('Drive', driveSchema);
