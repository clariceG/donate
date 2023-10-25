const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String, // Store the URL of the image
    // Add more fields as needed
});

module.exports = mongoose.model('Drive', driveSchema);
