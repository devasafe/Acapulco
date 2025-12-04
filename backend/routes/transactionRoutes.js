const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../utils/auth');

router.get('/', auth, transactionController.getHistory);

module.exports = router;
