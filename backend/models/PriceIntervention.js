const mongoose = require('mongoose');

// Candle de override de 1min persistido junto da intervenção aplicada.
const candleSchema = new mongoose.Schema({
  open: Number, high: Number, low: Number, close: Number, volume: Number,
}, { _id: false });

// Intervenção pontual agendada pelo admin. O ativo continua espelhando o real;
// quando 'scheduledAt' vence, o scheduler calcula o alvo, grava o candle de override
// e marca como 'applied'. O overlay (marketData) sobrepõe esse candle no gráfico real.
const schema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  scheduledAt: { type: Date, required: true },
  mode: { type: String, enum: ['absolute', 'percent'], required: true },
  value: { type: Number, required: true }, // absolute: preço-alvo; percent: ex. +10 = +10%
  status: { type: String, enum: ['pending', 'applied', 'cancelled'], default: 'pending' },
  resultPrice: Number,        // alvo calculado ao aplicar
  bucketOpenTime: Date,       // bucket de 1min em que caiu
  candle: candleSchema,       // candle de override (open real, close = alvo)
  appliedAt: Date,
  createdAt: { type: Date, default: Date.now },
});
schema.index({ assetId: 1, status: 1 });
schema.index({ status: 1, scheduledAt: 1 });

module.exports = mongoose.model('PriceIntervention', schema);
