const mongoose = require('mongoose');

// Posição (holding) agregada do usuário num ativo. P&L realizado é calculado
// no fechamento usando o PREÇO REAL de mercado. P&L não-realizado é calculado
// na leitura, comparando avgEntryPrice com o preço real atual.
const positionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  assetType: { type: String, enum: ['crypto', 'stock'], default: 'crypto' },
  quantity: { type: Number, default: 0 },       // quantidade atual em carteira
  avgEntryPrice: { type: Number, default: 0 },  // preço médio de entrada
  realizedPnl: { type: Number, default: 0 },    // lucro/prejuízo já realizado
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  updatedAt: { type: Date, default: Date.now },
});

positionSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Position', positionSchema);
