const mongoose = require('mongoose');

// Ideia / análise educacional publicada pelo admin. Aberta a todos, claramente
// rotulada como opinião/estudo. NÃO há manipulação de resultado — o que acontece
// é o que o mercado real fizer.
const ideaSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String },
  symbol: { type: String, required: true, uppercase: true, trim: true }, // moeda da dica
  title: { type: String, required: true },
  body: { type: String, required: true },
  stance: { type: String, enum: ['bullish', 'bearish', 'neutral'], default: 'neutral' },
  startDate: { type: Date }, // janela de exibição na página da moeda
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Idea', ideaSchema);
