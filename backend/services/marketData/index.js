const crypto = require('./cryptoProvider');
const Asset = require('../../models/Asset');
const PriceOverride = require('../../models/PriceOverride');
const { aggregateRange, mergeOverrides, widenWithOverrides } = require('../interventions/windowMath');

let stock = null;
try { stock = require('./stockProvider'); } catch (_) { stock = null; }

function providerFor(assetType) {
  if (assetType === 'stock') {
    if (!stock) throw new Error('Provedor de ações ainda não configurado');
    return stock;
  }
  return crypto;
}

const MS = { '1m': 60000, '5m': 300000, '15m': 900000, '1h': 3600000, '4h': 14400000, '1d': 86400000, '1w': 604800000, '1M': 2592000000 };
const REAGG_MAX_MS = 3600000; // reagrega de 1min até 1h; acima disso, pavio
const bucket1m = (ts) => Math.floor(ts / 60000) * 60000;

async function overridesFor(symbol, fromTime, toTime) {
  const asset = await Asset.findOne({ symbol: String(symbol || '').toUpperCase() }).lean();
  if (!asset) return [];
  const ovs = await PriceOverride.find({ assetId: asset._id }).lean();
  return ovs
    .map((o) => ({ time: new Date(o.openTime).getTime(), open: o.open, high: o.high, low: o.low, close: o.close, volume: o.volume }))
    .filter((o) => (fromTime == null || o.time >= fromTime) && (toTime == null || o.time <= toTime));
}

async function getQuote(symbol, assetType = 'crypto') {
  const q = await providerFor(assetType).getQuote(symbol);
  const nb = bucket1m(Date.now());
  const ov = await overridesFor(symbol, nb, nb);
  if (ov.length) q.price = ov[0].close;
  return q;
}

async function getCandles(symbol, interval, limit, assetType = 'crypto') {
  const prov = providerFor(assetType);
  const candles = await prov.getCandles(symbol, interval, limit);
  if (!candles.length) return candles;
  const ov = await overridesFor(symbol, candles[0].time, Date.now());
  if (!ov.length) return candles;

  const ivMs = MS[interval] || 3600000;
  if (ivMs > REAGG_MAX_MS) return widenWithOverrides(candles, ov); // timeframes largos: pavio

  // ≤1h: reagrega de 1min (real + overrides) os candles afetados.
  const from = Math.min(...ov.map((o) => o.time));
  const to = Math.max(...ov.map((o) => o.time)) + 60000;
  const minsNeeded = Math.min(Math.ceil((Date.now() - from) / 60000) + 5, 1000);
  let real1m = [];
  try { real1m = await prov.getCandles(symbol, '1m', minsNeeded); } catch (_) { return candles; }
  const merged = mergeOverrides(real1m, ov);
  return candles.map((c, i) => {
    const next = candles[i + 1] ? candles[i + 1].time : c.time + ivMs;
    if (c.time + ivMs <= from || c.time >= to) return c; // não afetado
    const agg = aggregateRange(merged, c.time, next);
    return agg ? { ...c, open: agg.open, high: agg.high, low: agg.low, close: agg.close, volume: agg.volume } : c;
  });
}

async function validateSymbol(symbol, assetType = 'crypto') { return providerFor(assetType).validateSymbol(symbol); }
async function search(query, assetType = 'crypto') { return providerFor(assetType).search(query); }

module.exports = { getQuote, getCandles, validateSymbol, search };
