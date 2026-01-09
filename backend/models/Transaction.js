const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal', 'referral_bonus', 'investment', 'yield', 'redemption'],
    required: true 
  },
  amount: { type: Number, required: true },
  description: { type: String },
  relatedInvestment: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
