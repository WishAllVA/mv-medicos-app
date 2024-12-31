const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine')

// Route to get all medicines
router.get('/', async (req, res) => {
    const { sort, limit, offset, search, searchBy } = req.query
    try {
        const pipeline = [
            { $match: search && searchBy ? { [searchBy]: { $regex: search, $options: 'i' } } : {} },
            { $sort: sort ? { [sort]: 1 } : {} },
            { $skip: offset ? parseInt(offset) : 0 }
        ];
        if (limit) {
            pipeline.push({ $limit: parseInt(limit) });
        }
        let totalCount = 0
        const medicines = await Medicine.aggregate(pipeline);
        if (search && searchBy) {
            totalCount = await Medicine.aggregate([
                { $match: { [searchBy]: { $regex: search, $options: 'i' } } },
                { $count: 'count' }
            ])
            totalCount = totalCount.length ? totalCount[0].count : 0
        } else {
            totalCount = await Medicine.countDocuments()
        }
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
