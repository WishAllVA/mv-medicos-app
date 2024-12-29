const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

const billSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number
    },
    medicines: [medicineSchema],
    patientName: {
        type: String,
        default: null
    },
    time: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value <= Date.now()
            },
            message: 'Time cannot be in the future'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Bill = mongoose.model('Bill', billSchema)

module.exports = Bill
