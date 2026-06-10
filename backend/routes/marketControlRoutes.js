const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/marketControlController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.use(authenticateToken, isAdmin);

router.get('/all', ctrl.listAll);
router.get('/:id/interventions', ctrl.listInterventions);
router.post('/:id/interventions', ctrl.schedule);
router.delete('/interventions/:interventionId', ctrl.cancel);

module.exports = router;
