const express = require('express')
const { check, validationResult } = require('express-validator')
const Bill = require('../models/Bill')
const Inventory = require('../models/Inventory') // Add Inventory model
const router = express.Router()

// Route to add a new bill
router.post('/add', [
    check('amount').isNumeric().withMessage('Amount must be a number'),
    check('discount').optional().isNumeric().withMessage('Discount must be a number'),
    check('medicines').isArray({ min: 1 }).withMessage('Medicines must be an array with at least one item'),
    check('patientName').optional().isString().withMessage('Patient name must be a string'),
    check('time').custom((value) => {
        if (new Date(value) > Date.now()) {
            throw new Error('Time cannot be in the future')
        }
        return true
    }).withMessage('Invalid time')
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { amount, discount, medicines, patientName, time } = req.body
    try {
        const newBill = new Bill({ amount, discount, medicines, patientName, time })
        await newBill.save()

        // Decrease inventory
        for (const medicine of medicines) {
            await Inventory.updateOne(
                { medicineId: medicine.id },
                { $inc: { quantity: -medicine.quantity } }
            )
        }

        res.status(201).json({
            message: 'Bill added successfully',
            bill: newBill
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Failed to add bill'
        })
    }
})

// Route to get bills with sorting and limiting options
router.get('/', async (req, res) => {
    console.log('getting bills')
    const { sort, limit } = req.query
    try {
        const bills = await Bill.find()
            .sort(sort ? { [sort]: 1 } : {})
            .limit(limit ? parseInt(limit) : 0)
        res.status(200).json(bills)
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve bills'
        })
    }
})

module.exports = router
