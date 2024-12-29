require('dotenv').config()
const express = require('express')
const mongoose = require('./mongoose/mongoose')
const billRoutes = require('./routes/billRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const reportsRoutes = require('./routes/reportsRoutes')
const medicinesRoutes = require('./routes/medicinesRoutes'); // Add this line to import the medicines routes

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

// Health check endpoint
app.use('/health', (req, res, next) => {
    res.status(200).json({
        success: 'ok'
    })
})

// Login routes
app.use('/api/auth', authRoutes) // Move this line before the JWT middleware

// JWT Middleware
app.use(jwtMiddleware)

// Bill routes
app.use('/api/bills', billRoutes)

// Inventory routes
app.use('/api/inventory', inventoryRoutes)

// Reports routes
app.use('/api/reports', reportsRoutes)

// Medicines routes
app.use('/api/medicines', medicinesRoutes); // Add this line to use the medicines routes

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
