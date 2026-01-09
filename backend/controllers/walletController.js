const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Setting = require('../models/Setting');

exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deposit with referral bonus
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ error: 'Invalid amount' });

    // Check if this is the first deposit
    const previousDeposits = await Transaction.findOne({
      userId: req.user.userId,
      type: 'deposit'
    });

    const user = await User.findById(req.user.userId);
    user.wallet += Number(amount);
    await user.save();

    const transaction = new Transaction({ 
      userId: user._id, 
      type: 'deposit', 
      amount: Number(amount),
      description: 'Depósito em carteira'
    });
    await transaction.save();

    // If first deposit and user has a referrer, calculate bonus
    if (!previousDeposits && user.referredBy) {
      try {
        const referralSetting = await Setting.findOne({ key: 'referral_percentage' });
        const referralPercentage = referralSetting ? Number(referralSetting.value) : 10;
        
        const bonusAmount = (Number(amount) * referralPercentage) / 100;

        const referrer = await User.findById(user.referredBy);
        if (referrer) {
          referrer.wallet += bonusAmount;
          await referrer.save();

          const bonusTransaction = new Transaction({
            userId: referrer._id,
            type: 'referral_bonus',
            amount: bonusAmount,
            description: `Bônus de referência - ${user.name} fez primeiro depósito de R$ ${Number(amount).toFixed(2)}`
          });
          await bonusTransaction.save();
        }
      } catch (bonusErr) {
        console.error('Error processing referral bonus:', bonusErr);
      }
    }

    res.json({ wallet: user.wallet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Withdraw
exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const user = await User.findById(req.user.userId);
    if (user.wallet < Number(amount)) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    user.wallet -= Number(amount);
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'withdrawal',
      amount: Number(amount),
      description: 'Saque de carteira'
    });
    await transaction.save();

    res.json({ wallet: user.wallet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort('-createdAt')
      .limit(50);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
