const mongoose = require('mongoose');

// Candle base de 5 minutos de um ativo controlado. O histórico só existe para
// ativos priceMode='controlled' (os 'mirror' usam a Binance ao vivo, sem persistir).
// Agregação para 15min/1h/etc. é feita na leitura (candleMath.aggregateCandles).
const priceCandleSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  openTime: { type: Date, required: true }, // início do bucket de 5min (UTC)
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, default: 0 },
});

// Um candle por (ativo, bucket). Acelera leitura de janela e o upsert do tique.
priceCandleSchema.index({ assetId: 1, openTime: 1 }, { unique: true });

module.exports = mongoose.model('PriceCandle', priceCandleSchema);
