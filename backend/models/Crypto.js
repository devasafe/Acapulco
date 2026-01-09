const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  period: { type: Number, required: true }, // em dias
  yieldPercentage: { type: Number, required: true }, // % de rendimento
}, { _id: false });

const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
  price: { type: Number, default: 0 }, // Preço de investimento em reais
  plans: [planSchema], // Array de múltiplos períodos/rendimentos
  isActive: { type: Boolean, default: true },
  description: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Crypto', cryptoSchema);
