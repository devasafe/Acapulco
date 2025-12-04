const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Middleware de autenticação
const auth = require('../utils/auth');

router.get('/', auth, walletController.getWallet);
router.post('/deposit', auth, walletController.deposit);

module.exports = router;
