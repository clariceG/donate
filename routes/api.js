const express = require('express');
const router = express.Router();
const Drive = require("../models/drive")

// Get all donation drives (for the donor home page)
router.get('/drives', async (req, res) => {
    try {
        const drives = await Drive.find({});
        res.json(drives);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Load more donation drives (pagination)
router.get('/drives/more/:skip/:limit', async (req, res) => {
    const skip = parseInt(req.params.skip);
    const limit = parseInt(req.params.limit);

    try {
        const drives = await Drive.find({}).skip(skip).limit(limit);
        res.json(drives);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new donation drive (for NGO personnel)
router.post('/drives', async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const newDrive = new Drive({ title, description });

    try {
        const savedDrive = await newDrive.save();
        res.json(savedDrive);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add a new drive' });
    }
});

// Update a donation drive (for NGO personnel)
router.put('/drives/:id', async (req, res) => {
    const driveId = req.params.id;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const updatedDrive = await Drive.findByIdAndUpdate(
            driveId,
            { title, description },
            { new: true }
        );
        res.json(updatedDrive);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update the drive' });
    }
});

// Delete a donation drive (for NGO personnel)
router.delete('/drives/:id', async (req, res) => {
    const driveId = req.params.id;

    try {
        await Drive.findByIdAndRemove(driveId);
        res.json({ message: 'Drive deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete the drive' });
    }
});

module.exports = router;
