const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Admin middleware
const adminAuth = [authenticateToken, isAdmin];

router.get('/users', ...adminAuth, adminController.getAllUsers);
router.get('/stats', ...adminAuth, adminController.getAdminStats);
router.get('/registrations', ...adminAuth, adminController.getRegistrations);
router.get('/cashflow', ...adminAuth, adminController.getCashflow);
router.get('/members-split', ...adminAuth, adminController.getMembersSplit);
router.get('/retention', ...adminAuth, adminController.getRetention);
router.get('/tickets', ...adminAuth, adminController.listTickets);
router.patch('/tickets/:id', ...adminAuth, adminController.updateTicketStatus);
router.post('/tickets/:id/responses', ...adminAuth, adminController.replyTicket);
router.get('/referral-settings', ...adminAuth, adminController.getReferralSettings);
router.put('/referral-settings', ...adminAuth, adminController.updateReferralSettings);
router.get('/referral-profits', ...adminAuth, adminController.getReferralProfits);
router.get('/referral-bonus-details', ...adminAuth, adminController.getReferralBonusDetails);

module.exports = router;
