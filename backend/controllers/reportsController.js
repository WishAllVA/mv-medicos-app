const Bill = require('../models/Bill');

module.exports = {
    getTotalAmount: async (req, res) => {
        try {
            const { start, end, days } = req.query;
            console.log(start, end, days)
            const filter = {};
            if (start) {
                filter.time = { $gte: new Date(start) };
            }
            if (end) {
                filter.time = filter.time || {};
                filter.time.$lte = new Date(end);
            }
            const bills = await Bill.find(filter);
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - Number(days) + 1);
            const numberOfDays = +days;
            const amounts = [];
            const labels = [];
            for (let i = 0; i < numberOfDays; i++) {
                const date = new Date(currentDate);
                const amount = bills.reduce((total, bill) => {
                    if (bill.time.getDate() === date.getDate() && bill.time.getMonth() === date.getMonth() && bill.time.getFullYear() === date.getFullYear()) {
                        return total + bill.amount;
                    }
                    return total;
                }, 0);
                amounts.push(amount);
                // Jan 1, 2021
                labels.push(date.toDateString().split(' ').slice(1).join(' '));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            res.status(200).json({ amounts, labels });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'An error occurred while fetching the total amount' });
        }
    },
    getTotalBills: async (req, res) => {
        try {
            const { start, end, days } = req.query;
            const filter = {};
            if (start) {
                filter.time = { $gte: new Date(start) };
            }
            if (end) {
                filter.time = filter.time || {};
                filter.time.$lte = new Date(end);
            }
            const bills = await Bill.find(filter);
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - Number(days) + 1);
            const numberOfDays = +days;
            const labels = [];
            const billCounts = [];
            for (let i = 0; i < numberOfDays; i++) {
                const date = new Date(currentDate);
                const count = bills.reduce((total, bill) => {
                    if (bill.time.getDate() === date.getDate() && bill.time.getMonth() === date.getMonth() && bill.time.getFullYear() === date.getFullYear()) {
                        return total + 1;
                    }
                    return total;
                }, 0);
                billCounts.push(count);
                labels.push(date.toDateString().split(' ').slice(1).join(' '));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            res.status(200).json({ bills: billCounts, labels });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'An error occurred while fetching the total number of bills' });
        }
    },
    getTopSoldMedicine: async (req, res) => {
        try {
            const bills = await Bill.find();
            const medicines = bills.reduce((medicines, bill) => {
                bill.medicines.forEach(medicine => {
                    if (medicines[medicine.name]) {
                        medicines[medicine.name] += medicine.quantity;
                    } else {
                        medicines[medicine.name] = medicine.quantity;
                    }
                });
                return medicines;
            }, {});
            // sort the medicines by quantity sold
            const topSoldMedicines = Object.keys(medicines)
                .sort((a, b) => medicines[b] - medicines[a])
                .map(name => ({ name, sold: medicines[name] }))
                .slice(0, 5);
            res.status(200).json({ topSoldMedicines });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the top sold medicine' });
        }
    }
}
