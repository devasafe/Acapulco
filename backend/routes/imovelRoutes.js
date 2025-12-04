const express = require('express');
const router = express.Router();
const imovelController = require('../controllers/imovelController');
const auth = require('../utils/auth');
const isAdmin = require('../utils/isAdmin');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });

router.get('/', imovelController.getAll);
router.post('/', auth, isAdmin, upload.array('images', 10), imovelController.create);
router.put('/:id', auth, isAdmin, imovelController.update);
router.delete('/:id', auth, isAdmin, imovelController.remove);

module.exports = router;
