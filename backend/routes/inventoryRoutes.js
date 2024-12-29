const express = require('express')
const { check, validationResult } = require('express-validator')
const Bill = require('../models/Bill')
const Inventory = require('../models/Inventory')
const router = express.Router()

// Add item to inventory
router.post('/add', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('quantity').isInt({ gt: 0 }).withMessage('Quantity should be a positive integer')
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, quantity, manufacturer, salt } = req.body

    try {
        const newItem = new Inventory({ name, quantity, manufacturer, salt })
        await newItem.save()
        res.status(201).json(newItem)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// Route to get inventory list
router.get('/', async (req, res) => {
    const { sort, limit, offset } = req.query
    try {
        const totalCount = await Inventory.countDocuments();
        const pipeline = [
            { $sort: sort ? { [sort]: 1 } : {} },
            { $skip: offset ? parseInt(offset) : 0 },
            { $limit: limit ? parseInt(limit) : 0 },
            { $match: {} }
        ];

        const medicines = await Inventory.aggregate(pipeline);

        res.status(200).json({ success: true, medicines, totalCount });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to retrieve inventory' })
    }
})

module.exports = router

