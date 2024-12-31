const express = require('express')
const { check, validationResult } = require('express-validator')
const Bill = require('../models/Bill')
const Inventory = require('../models/Inventory')
const Medicine = require('../models/Medicine')
const router = express.Router()

// Route to add a new bill
router.post('/add', [
    check('amount').isNumeric().withMessage('Amount must be a number'),
    check('discount').optional().isNumeric().withMessage('Discount must be a number'),
    check('medicines').isArray({ min: 1 }).withMessage('Medicines must be an array with at least one item'),
    check('patientName').optional().isString().withMessage('Patient name must be a string'),
    check('paymentMode').isIn(['cash', 'online']).withMessage('Invalid payment mode'),
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

    const { amount, discount, medicines, patientName, paymentMode, time } = req.body
    try {
        const newBill = new Bill({ amount, discount, medicines, patientName, paymentMode, time })
        await newBill.save()

        // Decrease inventory
        for (const medicine of medicines) {
            const checkMedicine = await Medicine.findOne({ name: medicine.name })
            await Inventory.updateOne(
                { medicineId: checkMedicine._id },
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
    const { sort, limit, start, end } = req.query
    console.log(req.query)
    const filter = {}

    if (start) {
        filter.time = { $gte: new Date(start) }
    }
    if (end) {
        filter.time = filter.time || {}
        filter.time.$lte = new Date(end)
    }

    try {
        const bills = await Bill.find(filter)
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
