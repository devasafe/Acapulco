const mongoose = require('mongoose');

// Ideia / análise educacional publicada pelo admin. Aberta a todos, claramente
// rotulada como opinião/estudo. NÃO há manipulação de resultado — o que acontece
// é o que o mercado real fizer.
const ideaSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String },
  symbol: { type: String, uppercase: true, trim: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  stance: { type: String, enum: ['bullish', 'bearish', 'neutral'], default: 'neutral' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Idea', ideaSchema);
