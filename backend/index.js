require('dotenv').config()
const express = require('express')
const mongoose = require('./mongoose/mongoose')
const billRoutes = require('./routes/billRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const cors = require('cors')

const app = express()
const API_LISTENER_PORT = process.env.PORT || 3000

// Middleware to parse JSON
app.use(express.json())

// CORS middleware to allow everything
app.use(cors())

// Health check endpoint
app.use('/health', (req, res, next) => {
    res.status(200).json({
        success: 'ok'
    })
})

// Bill routes
app.use('/api/bills', billRoutes)

// Inventory routes
app.use('/api/inventory', inventoryRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        error: 'Something went wrong!'
    })
})

app.listen(API_LISTENER_PORT, () => {
    console.log('Server started on PORT:%d', API_LISTENER_PORT)
})
