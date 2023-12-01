const express = require('express');
const router = express.Router();
const Drive = require("../models/drive")

// Get all donation drives (for the donor home page)
router.get('/drives', async (req, res) => {
    try {
        const drives = await Drive.find({},'id title description image');
        res.json(drives);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get drive by ID
router.get('/drives/:id', async (req, res) => {
    try {
        const driveId = req.params.id;

        // Use findById to get a single drive by its ID
        const drive = await Drive.findById(driveId);

        if (!drive) {
            return res.status(404).json({ error: 'Drive not found' });
        }

        res.json(drive);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


// // Load more donation drives (pagination)
// router.get('/drives/more/:skip/:limit', async (req, res) => {
//     const skip = parseInt(req.params.skip);
//     const limit = parseInt(req.params.limit);

//     try {
//         const drives = await Drive.find({}).skip(skip).limit(limit);
//         res.json(drives);
//     } catch (err) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// Add a new donation drive (for NGO personnel)
router.post('/drives', async (req, res) => {
    const { title, description, image } = req.body;

    if (!title || !description || !image) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const newDrive = new Drive({ title, description, image });

    try {
        const savedDrive = await newDrive.save();
        res.status(200).json({message: "Donation drive added successfully"});
    } catch (err) {
        res.status(500).json({ error: 'Failed to add a new drive' });
    }
});

// Update a donation drive (for NGO personnel)
router.put('/drives/:id', async (req, res) => {
    const driveId = req.params.id;
    const { title, description, image } = req.body;

    if (!title || !description || !image) {
        return res.status(400).json({ error: 'Title, description and Image are required' });
    }

    try {
        const updatedDrive = await Drive.findByIdAndUpdate(
            driveId,
            { title, description, image },
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
