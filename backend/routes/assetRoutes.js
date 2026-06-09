const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Público (logado): watchlist
router.get('/', assetController.getAssets);

// Admin
router.get('/admin/all', authenticateToken, isAdmin, assetController.getAllAdmin);
router.post('/', authenticateToken, isAdmin, assetController.addAsset);
router.patch('/:id/toggle', authenticateToken, isAdmin, assetController.toggleAsset);
router.delete('/:id', authenticateToken, isAdmin, assetController.removeAsset);

// Detalhe por símbolo (deixar por último para não conflitar com /admin)
router.get('/:symbol', assetController.getAsset);

module.exports = router;
