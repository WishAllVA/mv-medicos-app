const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/total-amount', reportsController.getTotalAmount);
router.get('/total-bills', reportsController.getTotalBills);
router.get('/top-sold-medicine', reportsController.getTopSoldMedicine);

module.exports = router;
