const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { authenticateToken } = require('../middleware/auth');

router.get('/search', authenticateToken, marketController.search);
router.get('/quote/:symbol', authenticateToken, marketController.getQuote);
router.get('/candles/:symbol', authenticateToken, marketController.getCandles);

module.exports = router;
