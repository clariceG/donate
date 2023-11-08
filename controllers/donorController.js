const Donation = require('../models/tracker');

exports.getStatus = async (req, res) => {
    try {
        const donation = await Donation.find().sort({ timestamp: -1 });
        res.json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting donation status' });
    }
};
