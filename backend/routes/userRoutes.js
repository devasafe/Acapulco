const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.get('/referrals', authenticateToken, userController.getReferrals);
router.get('/dashboard-stats', authenticateToken, userController.getDashboardStats);
router.get('/referral-stats', authenticateToken, userController.getReferralStats);

module.exports = router;
