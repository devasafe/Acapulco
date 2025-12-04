const User = require('../models/User');

exports.getReferrals = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('referrals');
    res.json(user.referrals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReferral = async (req, res) => {
  try {
    const { referralId } = req.body;
    const user = await User.findById(req.userId);
    user.referrals.push(referralId);
    await user.save();
    res.json(user.referrals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
