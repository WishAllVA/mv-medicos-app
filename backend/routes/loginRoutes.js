const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET

// Login endpoint
router.post('/', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username, password })
        if (user) {
            const token = jwt.sign({ id: user._id, username: user.username, userType: user.userType }, JWT_SECRET, { expiresIn: '2h' })
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token
            })
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

module.exports = router
