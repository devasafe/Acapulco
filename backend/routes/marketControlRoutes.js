// backend/routes/marketControlRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/marketControlController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.use(authenticateToken, isAdmin); // tudo aqui é admin

router.get('/', ctrl.list);
router.get('/all', ctrl.listAll);
router.get('/:id/state', ctrl.state);
router.put('/:id', ctrl.configure);
router.post('/:id/jump', ctrl.jump);
router.post('/:id/target', ctrl.setTarget);
router.post('/:id/trend', ctrl.setTrend);
router.post('/:id/preset', ctrl.preset);

module.exports = router;
