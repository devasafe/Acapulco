const Transaction = require('../models/Transaction');

exports.getHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
