const mongoose = require('mongoose')

const InventorySchema = new mongoose.Schema({
    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    placement: {
        type: Number
    }
})

module.exports = mongoose.model('Inventory', InventorySchema)
