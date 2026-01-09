const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');
const { authenticateToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');

// Public routes
router.get('/', cryptoController.getAllCryptos);
router.get('/:id', cryptoController.getCryptoById);

// Admin routes
router.get('/admin/all', authenticateToken, isAdmin, cryptoController.getAllCryptosAdmin);
router.post('/', authenticateToken, isAdmin, upload.single('image'), cryptoController.createCrypto);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), cryptoController.updateCrypto);
router.delete('/:id', authenticateToken, isAdmin, cryptoController.deleteCrypto);
router.patch('/:id/toggle', authenticateToken, isAdmin, cryptoController.toggleCryptoStatus);

// Seed route (apenas para desenvolvimento)
router.post('/seed/init', cryptoController.seedCryptos);

module.exports = router;
