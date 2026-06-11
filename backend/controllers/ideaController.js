const Idea = require('../models/Idea');
const User = require('../models/User');

// GET /api/ideas?symbol=BTCUSDT&active=1  → admin: tudo; página da moeda: filtrada e ativa
exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.symbol) filter.symbol = String(req.query.symbol).toUpperCase();
    if (req.query.active === '1') {
      const now = new Date();
      // ativa: dentro da janela [startDate, endDate]; datas ausentes = sem limite (legado)
      filter.$and = [
        { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] },
      ];
    }
    const ideas = await Idea.find(filter).sort('-createdAt').limit(100);
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/ideas  (admin)
exports.create = async (req, res) => {
  try {
    const { symbol, title, body, stance, startDate, endDate } = req.body;
    if (!symbol) return res.status(400).json({ error: 'Símbolo (moeda) é obrigatório' });
    if (!title || !body) return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && isNaN(start.getTime())) return res.status(400).json({ error: 'Data de início inválida' });
    if (end && isNaN(end.getTime())) return res.status(400).json({ error: 'Data de fim inválida' });
    if (start && end && end < start) return res.status(400).json({ error: 'A data de fim deve ser ≥ início' });
    const admin = await User.findById(req.user.userId).select('name');
    const idea = await Idea.create({
      authorId: req.user.userId,
      authorName: admin?.name || 'Admin',
      symbol: String(symbol).toUpperCase(),
      title,
      body,
      stance: stance || 'neutral',
      startDate: start,
      endDate: end,
    });
    res.status(201).json(idea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/ideas/:id  (admin)
exports.remove = async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Ideia não encontrada' });
    res.json({ message: 'Removida' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
