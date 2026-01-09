const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('referrals', 'name email wallet createdAt isActive')
      .populate('referredBy', 'name email');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      wallet: user.wallet,
      isAdmin: user.isAdmin,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      referrals: user.referrals,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name },
      { new: true }
    );

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        wallet: user.wallet,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get referrals
exports.getReferrals = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('referrals', 'name email wallet createdAt isActive');

    const referrals = user.referrals || [];

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate('referrals', 'isActive');
    const investments = await Investment.find({ userId });
    const transactions = await Transaction.find({ userId });

    // Calcular totais
    const totalInvested = investments
      .filter(inv => inv.status === 'active')
      .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    // Lucro realizado = soma dos lucros esperados dos investimentos já resgatados
    const completedInvestments = investments.filter(inv => inv.status === 'withdrawn');
    const totalRealizedProfit = completedInvestments
      .reduce((sum, inv) => sum + (Number(inv.expectedProfit) || 0), 0);

    // Contar usuários indicados ativos
    const activeReferrals = (user.referrals && Array.isArray(user.referrals)) 
      ? user.referrals.filter(ref => ref && ref.isActive === true).length 
      : 0;

    // Calcular total recebido por referência
    const referralBonuses = transactions.filter(t => t.type === 'referral_bonus');
    const totalReferralBonus = referralBonuses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    res.json({
      wallet: user.wallet,
      totalInvested,
      totalDeposits,
      totalRealizedProfit,
      activeReferrals,
      totalReferralBonus,
      recentTransactions: transactions.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get referral stats for user
exports.getReferralStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).populate('referrals', 'name email wallet createdAt');
    
    // Get bonus transactions for this user
    const bonusTransactions = await Transaction.find({
      userId,
      type: 'referral_bonus'
    });

    const totalBonusEarned = bonusTransactions.reduce((sum, t) => sum + t.amount, 0);
    const bonusCount = bonusTransactions.length;

    res.json({
      referralCode: user.referralCode,
      totalReferrals: user.referrals.length,
      referrals: user.referrals,
      totalBonusEarned,
      bonusCount,
      bonusTransactions: bonusTransactions.sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

