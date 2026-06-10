const mongoose = require('mongoose');

// Diretiva de movimento gradual até um alvo (a intervenção principal do admin).
const targetSchema = new mongoose.Schema({
  active: { type: Boolean, default: false },
  targetPrice: { type: Number },
  startPrice: { type: Number },
  startAt: { type: Date },
  endAt: { type: Date },
  easing: { type: String, enum: ['linear', 'easeInOut'], default: 'easeInOut' },
}, { _id: false });

// Viés/tendência contínua (vento a favor/contra).
const trendSchema = new mongoose.Schema({
  active: { type: Boolean, default: false },
  dailyDriftPercent: { type: Number, default: 0 }, // ex.: +5 = tende a +5%/dia
}, { _id: false });

// Parâmetros do motor de preço (usados só quando priceMode='controlled').
const controlSchema = new mongoose.Schema({
  referenceSymbol: { type: String, uppercase: true, trim: true }, // ex.: BTCUSDT (null = sintético puro)
  followStrength: { type: Number, default: 0.6, min: 0, max: 1 },  // 0..1 da variação da referência
  noiseVolatility: { type: Number, default: 0.002 },               // ~0.2% de ruído por tique
  currentPrice: { type: Number },                                  // preço ao vivo (estado persistido)
  refLastPrice: { type: Number },                                  // último preço visto da referência (p/ delta)
  target: { type: targetSchema, default: () => ({}) },
  trend: { type: trendSchema, default: () => ({}) },
}, { _id: false });

// Ativo acompanhado no simulador.
// mirror: preço vem ao vivo do provedor (Binance) — comportamento atual.
// controlled: preço vem do motor próprio (priceEngine), armazenado em control.currentPrice + PriceCandle.
const assetSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true },
  assetType: { type: String, enum: ['crypto', 'stock'], default: 'crypto' },
  priceMode: { type: String, enum: ['mirror', 'controlled'], default: 'mirror' },
  logo: { type: String },
  isActive: { type: Boolean, default: true },
  control: { type: controlSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', assetSchema);
