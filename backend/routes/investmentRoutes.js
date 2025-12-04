const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const auth = require('../utils/auth');

router.get('/my', auth, investmentController.getUserInvestments);
router.post('/invest', auth, investmentController.invest);
router.post('/sell', auth, investmentController.sell);

module.exports = router;
