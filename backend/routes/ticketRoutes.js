const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, ticketController.createTicket);
router.get('/mine', authenticateToken, ticketController.getMyTickets);

module.exports = router;
