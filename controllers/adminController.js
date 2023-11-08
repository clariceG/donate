const Donation = require('../models/tracker'); 

exports.updateStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const newStatus = await Donation.findOneAndUpdate({}, { status }, { new: true, upsert: true });
        res.json(newStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating donation status' });
    }
};

exports.clearUpdates = async (req, res) => {
    try {
        // Add logic to clear older donations, e.g., donations older than a certain date.
        // This code will depend on your specific requirements.
        // Example: await Donation.deleteMany({ timestamp: { $lt: new Date('2023-01-01') });

        res.json({ message: 'Older donations cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error clearing older donations' });
    }
};
