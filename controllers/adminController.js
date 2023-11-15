const Donation = require('../models/tracker');

exports.clearUpdates = async (req, res) => {
    try {
        // Clear all status updates
        await Donation.updateMany({}, { $set: { statuses: [] } });

        res.json({ message: 'Status updates cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error clearing status updates' });
    }
};

exports.updateStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const newStatus = { status, timestamp: new Date() };

        const updatedDonation = await Donation.findOneAndUpdate({}, { $push: { statuses: newStatus } }, { new: true, upsert: true });
        res.json(updatedDonation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating donation status' });
    }
};
