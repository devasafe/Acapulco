const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', authenticateToken, ideaController.list);
router.post('/', authenticateToken, isAdmin, ideaController.create);
router.delete('/:id', authenticateToken, isAdmin, ideaController.remove);

module.exports = router;
