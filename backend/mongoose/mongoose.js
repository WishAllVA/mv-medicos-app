require('dotenv').config()
const mongoose = require('mongoose')
const ATLAS_USERNAME = process.env.ATLAS_USERNAME
const ATLAS_PASSWORD = process.env.ATLAS_PASSWORD
const ATLAS_HOST = process.env.ATLAS_HOST
const ATLAS_DB = process.env.ATLAS_DB
const MONGO_URI = `mongodb+srv://${ATLAS_USERNAME}:${ATLAS_PASSWORD}@${ATLAS_HOST}/${ATLAS_DB}?retryWrites=true&w=majority`
console.log(MONGO_URI)

mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})

module.exports = mongoose
