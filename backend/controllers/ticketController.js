const SupportTicket = require('../models/SupportTicket');

// POST /api/tickets (autenticado) — abre um ticket do usuário logado.
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }
    const ticket = await SupportTicket.create({
      userId: req.user.userId,
      subject: subject && String(subject).trim() ? subject : 'Outros Assuntos',
      message: String(message).trim(),
      status: 'open',
    });
    res.status(201).json({ message: 'Ticket criado', ticketId: ticket._id });
  } catch (err) {
    console.error('Erro em createTicket:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tickets/mine (autenticado) — tickets do próprio usuário.
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(tickets);
  } catch (err) {
    console.error('Erro em getMyTickets:', err);
    res.status(500).json({ error: err.message });
  }
};
