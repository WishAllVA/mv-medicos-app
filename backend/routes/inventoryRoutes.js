const express = require('express')
const { check, validationResult } = require('express-validator')
const Bill = require('../models/Bill')
const Inventory = require('../models/Inventory')
const Medicine = require('../models/Medicine')
const router = express.Router()

// Add item to inventory
router.post('/add', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('quantity').isInt({ gt: 0 }).withMessage('Quantity should be a positive integer'),
    check('manufacturer').not().isEmpty().withMessage('Manufacturer is required'),
    check('salt').not().isEmpty().withMessage('Salt is required'),
    check('price').isFloat({ gt: 0 }).withMessage('Price should be a positive number'),
    // check('expiryDate').isISO8601().withMessage('Expiry date is required and should be a valid date')
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, quantity, manufacturer, salt, price, expiryDate } = req.body

    try {
        const newMedicine = new Medicine({ name, manufacturer, salt, expiryDate, price })
        await newMedicine.save()

        const newItem = new Inventory({ medicineId: newMedicine._id, quantity })
        await newItem.save()

        res.status(201).json({ newMedicine, newItem })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

// Route to get inventory list
router.get('/', async (req, res) => {
    const { sort, limit, offset, search, searchBy } = req.query
    try {
        const totalCount = await Inventory.countDocuments()
        const pipeline = [
            { $sort: sort ? { [sort]: 1 } : {} },
            { $skip: offset ? parseInt(offset) : 0 },
            { $limit: limit ? parseInt(limit) : 0 },
            { $lookup: {
                from: 'medicines',
                localField: 'medicineId',
                foreignField: '_id',
                as: 'medicine'
            }},
            { $unwind: '$medicine' },
            { $match: search && searchBy ? { [`medicine.${searchBy}`]: { $regex: search, $options: 'i' } } : {} }
        ];

        const medicines = await Inventory.aggregate(pipeline);

        res.status(200).json({ success: true, medicines, totalCount });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to retrieve inventory' })
    }
})

// Update item in inventory
router.put('/update/:id', [
    check('quantity').optional().isInt({ gte: 0 }).withMessage('Quantity should be a non negative integer'),
    // check('expiryDate').optional().isISO8601().withMessage('Expiry date should be a valid date')
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { quantity, expiryDate } = req.body

    try {
        const inventoryItem = await Inventory.findById(id).populate('medicine')
        if (!inventoryItem) {
            return res.status(404).json({ error: 'Inventory item not found' })
        }

        if (quantity !== undefined) {
            inventoryItem.quantity = quantity
        }

        if (expiryDate !== undefined) {
            inventoryItem.medicine.expiryDate = expiryDate
            await inventoryItem.medicine.save()
        }

        await inventoryItem.save()
        res.status(200).json(inventoryItem)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router

