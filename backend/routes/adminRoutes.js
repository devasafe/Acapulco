const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Admin middleware
const adminAuth = [authenticateToken, isAdmin];

router.get('/users', ...adminAuth, adminController.getAllUsers);
router.get('/stats', ...adminAuth, adminController.getAdminStats);
router.get('/referral-settings', ...adminAuth, adminController.getReferralSettings);
router.put('/referral-settings', ...adminAuth, adminController.updateReferralSettings);
router.get('/referral-profits', ...adminAuth, adminController.getReferralProfits);
router.get('/referral-bonus-details', ...adminAuth, adminController.getReferralBonusDetails);

module.exports = router;
