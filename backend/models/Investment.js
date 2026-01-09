const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['crypto', 'imovel'], default: 'crypto' },
  
  // Se for crypto
  cryptoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crypto' },
  cryptoName: String,
  
  // Se for imóvel
  imovelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Imovel' },
  imovelName: String,
  
  // Detalhes do investimento
  amount: { type: Number, required: true }, // valor investido em reais
  investmentPlan: { type: Number, required: true }, // período em dias
  yieldPercentage: { type: Number, required: true }, // % de rendimento
  expectedProfit: { type: Number }, // lucro esperado (amount * yield / 100)
  
  status: { type: String, enum: ['active', 'completed', 'withdrawn'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Investment', investmentSchema);
