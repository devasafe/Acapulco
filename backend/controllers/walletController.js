const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Setting = require('../models/Setting');

exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deposit with referral bonus: if this user was referred, the referrer
// receives (referralPercentage)% of the deposit amount. Percentage is read
// from settings (key: 'referralPercentage') with default 15%.
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const user = await User.findById(req.userId);
    user.wallet += Number(amount);
    await user.save();

    const transaction = new Transaction({ user: user._id, type: 'deposit', amount: Number(amount) });
    await transaction.save();

    // Check referral and award bonus
    let referralResult = null;
    if (user.indicadoPor) {
      // read percentage from settings
      const setting = await Setting.findOne({ key: 'referralPercentage' });
      const percentage = setting && typeof setting.value === 'number' ? Number(setting.value) : 15;
      const bonus = Number(amount) * (percentage / 100);
      if (bonus > 0) {
        const indicante = await User.findById(user.indicadoPor);
        if (indicante) {
          indicante.wallet += bonus;
          await indicante.save();
          await Transaction.create({ user: indicante._id, type: 'referral', amount: bonus });
          referralResult = { to: indicante._id, amount: bonus, percentage };
        }
      }
    }

    res.json({ wallet: user.wallet, referralBonus: referralResult });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
