const mongoose = require('mongoose');

// Candle de override de 1min gerado pelo scheduler durante uma janela ativa.
// O overlay (marketData) sobrepõe/reagrega esses candles sobre os reais.
const schema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  interventionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PriceIntervention', required: true },
  openTime: { type: Date, required: true }, // bucket de 1min (UTC)
  open: Number, high: Number, low: Number, close: Number, volume: Number,
});
schema.index({ assetId: 1, openTime: 1 }, { unique: true });
schema.index({ interventionId: 1 });

module.exports = mongoose.model('PriceOverride', schema);
