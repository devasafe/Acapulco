// ...existing code...
const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  wallet: { type: Number, default: 0 },
  
  // Histórico de valores
  totalInvested: { type: Number, default: 0 },
  totalRealizedProfit: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },
  totalReferralBonus: { type: Number, default: 0 },
  
  // Referral System
  referralCode: { 
    type: String, 
    unique: true, 
    default: () => crypto.randomBytes(8).toString('hex')
  },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
