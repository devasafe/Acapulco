// backend/services/priceEngine/candleStore.js
// Wrapper de DB sobre candleMath. Faz upsert do candle de 5min vigente e lê janelas.
const PriceCandle = require('../../models/PriceCandle');
const { BASE_MS, bucketStart, aggregateCandles } = require('./candleMath');

// Registra um preço no candle de 5min correspondente a `ts` (ms). Atualiza OHLC/volume.
async function recordPrice(assetId, price, ts = Date.now()) {
  const openTime = new Date(bucketStart(ts));
  await PriceCandle.findOneAndUpdate(
    { assetId, openTime },
    {
      $setOnInsert: { assetId, openTime, open: price },
      $max: { high: price },
      $min: { low: price },
      $set: { close: price },
      $inc: { volume: 1 },
    },
    { upsert: true, new: true }
  );
}

// Lê os últimos `limit` candles do intervalo pedido (em minutos), agregando os de 5min.
async function getCandles(assetId, intervalMinutes = 60, limit = 200) {
  const intervalMs = intervalMinutes * 60 * 1000;
  // Busca candles base suficientes para montar `limit` candles agregados.
  const baseNeeded = Math.ceil((limit * intervalMs) / BASE_MS) + (intervalMs / BASE_MS);
  const raw = await PriceCandle.find({ assetId })
    .sort({ openTime: -1 })
    .limit(baseNeeded)
    .lean();
  raw.reverse(); // asc
  const normalized = raw.map((c) => ({
    openTime: new Date(c.openTime).getTime(),
    open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume,
  }));
  const agg = aggregateCandles(normalized, intervalMinutes);
  return agg.slice(-limit).map((c) => ({
    time: c.openTime, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume,
  }));
}

// Variação % das últimas 24h a partir dos candles de 5min.
async function change24h(assetId, currentPrice) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const first = await PriceCandle.findOne({ assetId, openTime: { $gte: since } })
    .sort({ openTime: 1 })
    .lean();
  if (!first || !first.open) return 0;
  return ((currentPrice - first.open) / first.open) * 100;
}

// openTime (ms) do último candle salvo (para o backfill saber de onde retomar).
async function lastCandleTime(assetId) {
  const last = await PriceCandle.findOne({ assetId }).sort({ openTime: -1 }).lean();
  return last ? new Date(last.openTime).getTime() : null;
}

module.exports = { recordPrice, getCandles, change24h, lastCandleTime };
