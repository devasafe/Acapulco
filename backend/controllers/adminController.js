const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Setting = require('../models/Setting');

exports.getReferralProfits = async (req, res) => {
  try {
    // Apenas admin pode acessar
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    // Busca todas transações de indicação
    const referralTxs = await Transaction.find({ type: 'referral' }).populate('user');
    // Agrupa por usuário
    const profits = {};
    referralTxs.forEach(tx => {
      if (!profits[tx.user._id]) {
        profits[tx.user._id] = { name: tx.user.name, email: tx.user.email, total: 0 };
      }
      profits[tx.user._id].total += tx.amount;
    });
    res.json(Object.values(profits));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET current referral percentage (admin only)
exports.getReferralPercentage = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
    const setting = await Setting.findOne({ key: 'referralPercentage' });
    const percentage = setting && typeof setting.value === 'number' ? Number(setting.value) : 15;
    res.json({ percentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST update referral percentage (admin only)
exports.setReferralPercentage = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
    const { percentage } = req.body;
    if (percentage === undefined || isNaN(Number(percentage))) return res.status(400).json({ error: 'Porcentagem inválida' });
    const num = Number(percentage);
    if (num < 0 || num > 100) return res.status(400).json({ error: 'Porcentagem deve estar entre 0 e 100' });
    const updated = await Setting.findOneAndUpdate(
      { key: 'referralPercentage' },
      { value: num, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ percentage: updated.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
