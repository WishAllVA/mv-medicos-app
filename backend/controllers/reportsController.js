const Bill = require('../models/Bill');

exports.getTotalAmount = async (req, res) => {
    try {
        const bills = await Bill.find();
        const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
        res.status(200).json({ totalAmount });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the total amount' });
    }
};
