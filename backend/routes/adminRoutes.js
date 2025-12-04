const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../utils/auth');
const isAdmin = require('../utils/isAdmin');

router.get('/referral-profits', auth, adminController.getReferralProfits);

// Settings: get/set referral percentage
router.get('/settings/referral-percentage', auth, isAdmin, adminController.getReferralPercentage);
router.post('/settings/referral-percentage', auth, isAdmin, adminController.setReferralPercentage);

module.exports = router;
