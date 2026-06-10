const mongoose = require('mongoose');

// Janela de intervenção: real -> alvo (rampa), sustenta o nível, volta suave ao real.
const schema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  mode: { type: String, enum: ['absolute', 'percent'], required: true },
  value: { type: Number, required: true },          // alvo (preço) ou % (+10 = +10%)
  rampCandles: { type: Number, required: true },     // nº de velas da rampa
  rampTimeframeMs: { type: Number, required: true }, // duração de cada vela da rampa (ms)
  status: { type: String, enum: ['pending', 'active', 'done', 'cancelled'], default: 'pending' },
  factor: { type: Number },        // F travado na ativação
  realAtStart: { type: Number },   // preço real no início (para F absoluto)
  createdAt: { type: Date, default: Date.now },
});
schema.index({ status: 1, startAt: 1 });
schema.index({ assetId: 1 });

module.exports = mongoose.model('PriceIntervention', schema);
