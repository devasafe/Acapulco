const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imovel: { type: mongoose.Schema.Types.ObjectId, ref: 'Imovel' },
  amount: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Investment', investmentSchema);
