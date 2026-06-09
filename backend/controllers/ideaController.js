const Idea = require('../models/Idea');
const User = require('../models/User');

// GET /api/ideas  → lista pública (a logados)
exports.list = async (req, res) => {
  try {
    const ideas = await Idea.find().sort('-createdAt').limit(100);
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/ideas  (admin)
exports.create = async (req, res) => {
  try {
    const { symbol, title, body, stance } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    const admin = await User.findById(req.user.userId).select('name');
    const idea = await Idea.create({
      authorId: req.user.userId,
      authorName: admin?.name || 'Admin',
      symbol: symbol ? String(symbol).toUpperCase() : undefined,
      title,
      body,
      stance: stance || 'neutral',
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
