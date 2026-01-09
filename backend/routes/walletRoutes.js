const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, walletController.getWallet);
router.post('/deposit', authenticateToken, walletController.deposit);
router.post('/withdraw', authenticateToken, walletController.withdraw);
router.get('/transactions', authenticateToken, walletController.getTransactions);

module.exports = router;
