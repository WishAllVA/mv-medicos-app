const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/total-amount', reportsController.getTotalAmount);

module.exports = router;
