const mongoose = require('mongoose');

// Log de cada execução, sempre ao preço de mercado (com overlay) do momento.
const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  assetType: { type: String, enum: ['crypto', 'stock'], default: 'crypto' },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  usdAmount: { type: Number, required: true }, // valor em USD da ordem (notional)
  units: { type: Number, required: true },     // usdAmount / price
  price: { type: Number, required: true },
  total: { type: Number, required: true },     // = usdAmount
  realizedPnl: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trade', tradeSchema);
