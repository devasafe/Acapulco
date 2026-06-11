const mongoose = require('mongoose');

// Posição NETTING (uma por usuário+símbolo). netUnits assinado: + long, - short, 0 sem posição.
// reserved = notional travado em USD (|netUnits| * avgEntryPrice), sem alavancagem.
const positionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  assetType: { type: String, enum: ['crypto', 'stock'], default: 'crypto' },
  netUnits: { type: Number, default: 0 },       // unidades líquidas (+ long / - short)
  avgEntryPrice: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },       // USD travado do saldo
  realizedPnl: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  updatedAt: { type: Date, default: Date.now },
});
positionSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Position', positionSchema);
