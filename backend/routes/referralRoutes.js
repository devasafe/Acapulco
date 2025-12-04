const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const auth = require('../utils/auth');

router.get('/', auth, referralController.getReferrals);
router.post('/', auth, referralController.addReferral);

module.exports = router;
