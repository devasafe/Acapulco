const User = require('../models/User');
const Transaction = require('../models/Transaction');

// GET /api/referrals/stats → tudo que a página de indicações precisa
exports.getReferralStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('referrals', 'name email wallet createdAt isActive');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const bonusTransactions = await Transaction.find({ userId: user._id, type: 'referral_bonus' })
      .sort('-createdAt').limit(100);
    const totalBonusEarned = bonusTransactions.reduce((s, t) => s + (t.amount || 0), 0);

    res.json({
      referralCode: user.referralCode || '',
      totalReferrals: user.referrals.length,
      referrals: user.referrals,
      totalBonusEarned,
      bonusCount: bonusTransactions.length,
      bonusTransactions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReferrals = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('referrals');
    res.json(user.referrals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReferral = async (req, res) => {
  try {
    const { referralId } = req.body;
    const user = await User.findById(req.user.userId);
    user.referrals.push(referralId);
    await user.save();
    res.json(user.referrals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

