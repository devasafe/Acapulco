const crypto = require('./cryptoProvider');
const Asset = require('../../models/Asset');
const PriceOverride = require('../../models/PriceOverride');
const PriceIntervention = require('../../models/PriceIntervention');
const { shape, multiplier, manipulatedCandle, aggregateRange, mergeOverrides, widenWithOverrides } = require('../interventions/windowMath');

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
const MIN_PRICE = 1e-6;
const bucket1m = (ts) => Math.floor(ts / 60000) * 60000;

const resolveAsset = (symbol) => Asset.findOne({ symbol: String(symbol || '').toUpperCase() }).lean();

// Calcula AO VIVO os candles de override das janelas ativas (sem depender do scheduler),
// a partir dos candles reais de 1min. É isso que elimina o lag no início de cada candle:
// o minuto corrente já sai manipulado, não espera o scheduler gravar.
function liveOverrides(activeWindows, real1mByTime, now) {
  const out = [];
  for (const w of activeWindows) {
    if (!(w.factor > 0)) continue;
    const startMs = new Date(w.startAt).getTime();
    const endMs = new Date(w.endAt).getTime();
    const rampMs = w.rampCandles * w.rampTimeframeMs;
    const until = Math.min(now, endMs);
    for (let b = bucket1m(startMs); b <= until; b += 60000) {
      const realC = real1mByTime.get(b);
      if (!realC) continue;
      const mOpen = multiplier(w.factor, shape(b, startMs, endMs, rampMs));
      const mMid = multiplier(w.factor, shape(b + 30000, startMs, endMs, rampMs));
      const mClose = multiplier(w.factor, shape(b + 60000, startMs, endMs, rampMs));
      out.push({ time: b, ...manipulatedCandle(realC, mOpen, mMid, mClose) });
    }
  }
  return out;
}

// Overrides gravados (janelas concluídas) + ao vivo (janelas ativas). Ao vivo tem precedência.
function combine(stored, live) {
  const byTime = new Map(stored.map((o) => [o.time, o]));
  for (const o of live) byTime.set(o.time, o);
  return Array.from(byTime.values()).sort((a, b) => a.time - b.time);
}

async function getQuote(symbol, assetType = 'crypto') {
  const q = await providerFor(assetType).getQuote(symbol);
  const asset = await resolveAsset(symbol);
  if (!asset) return q;
  const now = Date.now();
  // Janela ativa cobrindo agora -> manipula o preço AO VIVO (sem depender do override gravado).
  const w = await PriceIntervention.findOne({
    assetId: asset._id, status: 'active',
    startAt: { $lte: new Date(now) }, endAt: { $gte: new Date(now) },
  }).lean();
  if (w && w.factor > 0) {
    const startMs = new Date(w.startAt).getTime();
    const endMs = new Date(w.endAt).getTime();
    const rampMs = w.rampCandles * w.rampTimeframeMs;
    q.price = Math.max(q.price * multiplier(w.factor, shape(now, startMs, endMs, rampMs)), MIN_PRICE);
  }
  return q;
}

async function getCandles(symbol, interval, limit, assetType = 'crypto') {
  const prov = providerFor(assetType);
  const candles = await prov.getCandles(symbol, interval, limit);
  if (!candles.length) return candles;
  const asset = await resolveAsset(symbol);
  if (!asset) return candles;

  const now = Date.now();
  const stored = (await PriceOverride.find({ assetId: asset._id }).lean())
    .map((o) => ({ time: new Date(o.openTime).getTime(), open: o.open, high: o.high, low: o.low, close: o.close, volume: o.volume }))
    .filter((o) => o.time >= candles[0].time && o.time <= now);
  const active = await PriceIntervention.find({ assetId: asset._id, status: 'active' }).lean();
  if (!stored.length && !active.length) return candles;

  const ivMs = MS[interval] || REAGG_MAX_MS;

  // Timeframes largos (>1h): pavio com os overrides gravados (o close fica real; o lag do
  // minuto corrente é imperceptível aqui).
  if (ivMs > REAGG_MAX_MS) return widenWithOverrides(candles, stored);

  // ≤1h: reagrega de 1min (real + overrides gravados + ao vivo das janelas ativas).
  const activeStarts = active.map((w) => new Date(w.startAt).getTime());
  const refTimes = [...stored.map((o) => o.time), ...activeStarts];
  const from = Math.min(...refTimes);
  const minsNeeded = Math.min(Math.ceil((now - from) / 60000) + 5, 1000);
  let real1m = [];
  try { real1m = await prov.getCandles(symbol, '1m', minsNeeded); } catch (_) { return candles; }
  const real1mByTime = new Map(real1m.map((c) => [c.time, c]));
  const overrides = combine(stored, liveOverrides(active, real1mByTime, now));
  if (!overrides.length) return candles;

  const lo = Math.min(...overrides.map((o) => o.time));
  const hi = Math.max(...overrides.map((o) => o.time)) + 60000;
  const merged = mergeOverrides(real1m, overrides);
  return candles.map((c, i) => {
    const next = candles[i + 1] ? candles[i + 1].time : c.time + ivMs;
    if (c.time + ivMs <= lo || c.time >= hi) return c; // não afetado
    const agg = aggregateRange(merged, c.time, next);
    return agg ? { ...c, open: agg.open, high: agg.high, low: agg.low, close: agg.close, volume: agg.volume } : c;
  });
}

async function validateSymbol(symbol, assetType = 'crypto') { return providerFor(assetType).validateSymbol(symbol); }
async function search(query, assetType = 'crypto') { return providerFor(assetType).search(query); }

module.exports = { getQuote, getCandles, validateSymbol, search };
