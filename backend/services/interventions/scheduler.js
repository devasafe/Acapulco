// Aplica intervenções vencidas: calcula o alvo, grava o candle de override e marca 'applied'.
const Asset = require('../../models/Asset');
const PriceIntervention = require('../../models/PriceIntervention');
const crypto = require('../marketData/cryptoProvider');
const { computeTarget, buildOverrideCandle } = require('./overlay');

const TICK_MS = Number(process.env.INTERVENTION_TICK_MS) || 15000;
const bucket1m = (ts) => Math.floor(ts / 60000) * 60000;
let running = false;

async function applyOne(iv) {
  const asset = await Asset.findById(iv.assetId).lean();
  if (!asset) { iv.status = 'cancelled'; await iv.save(); return; }
  const bucket = bucket1m(new Date(iv.scheduledAt).getTime());

  let realCandle = null, realPrice = null;
  try {
    const candles = await crypto.getCandles(asset.symbol, '1m', 1000);
    realCandle = candles.find((c) => c.time === bucket) || candles[candles.length - 1];
    realPrice = realCandle ? realCandle.close : null;
  } catch (_) { /* tenta quote abaixo */ }
  if (realPrice == null) {
    try { const q = await crypto.getQuote(asset.symbol); realPrice = q.price; } catch (_) {}
  }
  if (realPrice == null) return; // sem rede: tenta no próximo tique

  const target = computeTarget(iv.mode, iv.value, realPrice);
  iv.resultPrice = target;
  iv.bucketOpenTime = new Date(bucket);
  iv.candle = buildOverrideCandle(realCandle, target);
  iv.appliedAt = new Date();
  iv.status = 'applied';
  await iv.save();
}

async function tick() {
  if (running) return;
  running = true;
  try {
    const due = await PriceIntervention.find({ status: 'pending', scheduledAt: { $lte: new Date() } });
    for (const iv of due) {
      try { await applyOne(iv); } catch (e) { console.error('intervention apply:', e.message); }
    }
  } catch (e) {
    console.error('intervention tick:', e.message);
  } finally {
    running = false;
  }
}

function start() {
  setInterval(tick, TICK_MS);
  console.log(`Intervention scheduler ativo (a cada ${TICK_MS}ms)`);
}

module.exports = { start, tick, applyOne };
