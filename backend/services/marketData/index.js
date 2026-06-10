// Fachada de dados de mercado. Todos os ativos espelham o real (Binance/stock);
// intervenções aplicadas são sobrepostas (overlay) nos candles/quote.
const crypto = require('./cryptoProvider');
const Asset = require('../../models/Asset');
const PriceIntervention = require('../../models/PriceIntervention');
const { overlayCandles } = require('../interventions/overlay');

let stock = null;
try { stock = require('./stockProvider'); } catch (_) { stock = null; }

function providerFor(assetType) {
  if (assetType === 'stock') {
    if (!stock) throw new Error('Provedor de ações ainda não configurado');
    return stock;
  }
  return crypto;
}

// Overrides aplicados de um símbolo, no formato do overlay.
async function overridesFor(symbol, fromTime, toTime) {
  const asset = await Asset.findOne({ symbol: String(symbol || '').toUpperCase() }).lean();
  if (!asset) return [];
  const ivs = await PriceIntervention.find({ assetId: asset._id, status: 'applied' }).lean();
  return ivs
    .filter((iv) => iv.bucketOpenTime)
    .map((iv) => ({
      time: new Date(iv.bucketOpenTime).getTime(),
      open: iv.candle?.open, high: iv.candle?.high, low: iv.candle?.low,
      close: iv.candle?.close ?? iv.resultPrice,
    }))
    .filter((o) => (fromTime == null || o.time >= fromTime) && (toTime == null || o.time <= toTime));
}

async function getQuote(symbol, assetType = 'crypto') {
  const q = await providerFor(assetType).getQuote(symbol);
  const nowBucket = Math.floor(Date.now() / 60000) * 60000;
  const ov = await overridesFor(symbol, nowBucket, nowBucket); // override no minuto atual?
  if (ov.length) q.price = ov[0].close;
  return q;
}

async function getCandles(symbol, interval, limit, assetType = 'crypto') {
  const candles = await providerFor(assetType).getCandles(symbol, interval, limit);
  if (!candles.length) return candles;
  const ov = await overridesFor(symbol, candles[0].time, Date.now());
  return overlayCandles(candles, ov, interval === '1m');
}

async function validateSymbol(symbol, assetType = 'crypto') {
  return providerFor(assetType).validateSymbol(symbol);
}
async function search(query, assetType = 'crypto') {
  return providerFor(assetType).search(query);
}

module.exports = { getQuote, getCandles, validateSymbol, search };
