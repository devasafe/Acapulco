const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, investmentController.getMyInvestments);
router.post('/', authenticateToken, investmentController.createInvestment);
router.post('/crypto', authenticateToken, investmentController.investInCrypto);
router.post('/withdraw', authenticateToken, investmentController.withdrawInvestment);

module.exports = router;
