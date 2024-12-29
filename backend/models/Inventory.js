const mongoose = require('mongoose')

const InventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
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

module.exports = mongoose.model('Inventory', InventorySchema)
