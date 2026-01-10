const Investment = require('../models/Investment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Crypto = require('../models/Crypto');
const { updateUserStats } = require('../utils/updateUserStats');

// Get user's investments
exports.getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.userId })
      .populate('cryptoId', 'name symbol period yieldPercentage')
      .sort('-createdAt');
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create investment (buy crypto)
exports.createInvestment = async (req, res) => {
  try {
    const { cryptoId, amount } = req.body;
    
    if (!cryptoId || !amount) {
      return res.status(400).json({ error: 'Missing cryptoId or amount' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (user.wallet < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) return res.status(404).json({ error: 'Crypto not found' });

    const expectedProfit = (amount * crypto.yieldPercentage / 100).toFixed(2);
    
    const investment = new Investment({
      userId: req.user.userId,
      type: 'crypto',
      cryptoId,
      cryptoName: crypto.name,
      amount,
      investmentPlan: crypto.period,
      yieldPercentage: crypto.yieldPercentage,
      expectedProfit,
      status: 'active'
    });

    await investment.save();

    // Deduct from wallet
    user.wallet -= amount;
    await user.save();

    // Record transaction
    const transaction = new Transaction({
      userId: req.user.userId,
      type: 'investment',
      amount,
      description: `Investimento em ${crypto.name}`,
      relatedInvestment: investment._id
    });
    await transaction.save();

    // Atualizar stats do usuário
    await updateUserStats(req.user.userId);

    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Withdraw/resgate investment
exports.withdrawInvestment = async (req, res) => {
  try {
    const { investmentId } = req.body;
    
    const investment = await Investment.findById(investmentId);
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    
    if (investment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (investment.status !== 'active') {
      return res.status(400).json({ error: 'Investment not active' });
    }

    const user = await User.findById(req.user.userId);
    const totalReturn = parseFloat(investment.amount) + parseFloat(investment.expectedProfit);
    
    user.wallet += totalReturn;
    await user.save();

    investment.status = 'withdrawn';
    await investment.save();

    // Record redemption transaction (resgate - different from withdrawal/saque)
    const redemptionTransaction = new Transaction({
      userId: req.user.userId,
      type: 'redemption',
      amount: totalReturn,
      description: `Resgate do investimento em ${investment.cryptoName}`,
      relatedInvestment: investment._id
    });
    await redemptionTransaction.save();

    // Atualizar stats do usuário
    await updateUserStats(req.user.userId);

    res.json({ message: 'Investment withdrawn', totalReturn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Invest in Crypto (from CryptoDetailPage)
exports.investInCrypto = async (req, res) => {
  try {
    const { cryptoId, amount, period } = req.body;
    
    if (!cryptoId || !amount || !period) {
      return res.status(400).json({ error: 'Missing cryptoId, amount, or period' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (user.wallet < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) return res.status(404).json({ error: 'Crypto not found' });

    // Find the selected plan
    const selectedPlan = crypto.plans.find(p => p.period === Number(period));
    if (!selectedPlan) return res.status(400).json({ error: 'Plan not found' });

    const expectedProfit = (amount * selectedPlan.yieldPercentage / 100).toFixed(2);
    
    const investment = new Investment({
      userId: req.user.userId,
      type: 'crypto',
      cryptoId,
      cryptoName: crypto.name,
      amount,
      investmentPlan: period,
      yieldPercentage: selectedPlan.yieldPercentage,
      expectedProfit,
      status: 'active'
    });

    await investment.save();

    // Deduct from wallet
    user.wallet -= amount;
    await user.save();

    // Record transaction
    const transaction = new Transaction({
      userId: req.user.userId,
      type: 'investment',
      amount,
      description: `Investimento em ${crypto.name} - ${period} dias`,
      relatedInvestment: investment._id
    });
    await transaction.save();

    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    const investments = await Investment.find({ userId });
    const transactions = await Transaction.find({ userId });

    const activeInvestments = investments.filter(i => i.status === 'active');
    const totalInvested = activeInvestments.reduce((sum, i) => sum + i.amount, 0);
    const totalExpectedProfit = activeInvestments.reduce((sum, i) => sum + parseFloat(i.expectedProfit || 0), 0);

    const stats = {
      wallet: user.wallet,
      totalInvested,
      totalExpectedProfit: totalExpectedProfit.toFixed(2),
      activeInvestments: activeInvestments.length,
      completedInvestments: investments.filter(i => i.status === 'completed').length,
      withdrawnInvestments: investments.filter(i => i.status === 'withdrawn').length,
      recentTransactions: transactions.slice(0, 10).reverse()
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

