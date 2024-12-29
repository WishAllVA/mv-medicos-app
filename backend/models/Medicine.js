const mongoose = require('mongoose')

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    manufacturer: {
        type: String
    },
    salt: {
        type: String
    }
})

module.exports = mongoose.model('Medicine', MedicineSchema)
