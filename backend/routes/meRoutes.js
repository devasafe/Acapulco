const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/analytics', authenticateToken, analyticsController.meAnalytics);
router.get('/equity-curve', authenticateToken, analyticsController.meEquityCurve);

module.exports = router;
