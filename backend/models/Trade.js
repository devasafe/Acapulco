const mongoose = require('mongoose');

// Log de cada execução de compra/venda, sempre ao PREÇO REAL do momento.
const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  assetType: { type: String, enum: ['crypto', 'stock'], default: 'crypto' },
  side: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },   // preço real de mercado no momento
  total: { type: Number, required: true },   // quantity * price (em caixa fictício)
  realizedPnl: { type: Number, default: 0 }, // P&L realizado quando é venda
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trade', tradeSchema);
