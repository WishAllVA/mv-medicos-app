require('dotenv').config()
const express = require('express')
const mongoose = require('./mongoose/mongoose')
const billRoutes = require('./routes/billRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const loginRoutes = require('./routes/loginRoutes')
const cors = require('cors')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const reportsRoutes = require('./routes/reportsRoutes')

const app = express()
const API_LISTENER_PORT = process.env.PORT || 3000

// CORS middleware to allow specific headers and credentials
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// Middleware to parse JSON
app.use(express.json())

// JWT Middleware
app.use(jwtMiddleware)

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

// Login routes
app.use('/api/login', loginRoutes)

// Reports routes
app.use('/api/reports', reportsRoutes)

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
