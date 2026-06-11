const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken); // todas as rotas de trade exigem login

router.post('/buy', tradeController.buy);
router.post('/sell', tradeController.sell);
router.post('/close', tradeController.close);
router.get('/positions', tradeController.getPositions);
router.get('/stats', tradeController.getStats);
router.get('/', tradeController.getTrades);

module.exports = router;
