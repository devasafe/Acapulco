const Asset = require('../../models/Asset');
const PriceIntervention = require('../../models/PriceIntervention');
const PriceOverride = require('../../models/PriceOverride');
const crypto = require('../marketData/cryptoProvider');
const { shape, factorFor, multiplier, scaleCandle } = require('./windowMath');

const TICK_MS = Number(process.env.INTERVENTION_TICK_MS) || 15000;
const bucket1m = (ts) => Math.floor(ts / 60000) * 60000;
let running = false;

// Ativa janelas pendentes que já começaram: trava o fator com o preço real do início.
async function activatePending(now) {
  const pendings = await PriceIntervention.find({ status: 'pending', startAt: { $lte: now } });
  for (const w of pendings) {
    try {
      let real = null;
      try { const q = await crypto.getQuote((await Asset.findById(w.assetId).lean()).symbol); real = q.price; } catch (_) {}
      if (real == null) continue; // tenta no próximo tique
      w.realAtStart = real;
      w.factor = factorFor(w.mode, w.value, real);
      w.status = 'active';
      await w.save();
    } catch (e) { console.error('activate window:', e.message); }
  }
}

// Gera/atualiza os candles de override de uma janela ativa, de startAt até min(now, endAt).
async function generate(w, now) {
  const asset = await Asset.findById(w.assetId).lean();
  if (!asset) { w.status = 'cancelled'; await w.save(); return; }
  const rampMs = w.rampCandles * w.rampTimeframeMs;
  const startMs = new Date(w.startAt).getTime();
  const endMs = new Date(w.endAt).getTime();
  const until = Math.min(now, endMs);

  let real1m = [];
  try { real1m = await crypto.getCandles(asset.symbol, '1m', 1000); } catch (_) {}
  const realByTime = new Map(real1m.map((c) => [c.time, c]));

  for (let b = bucket1m(startMs); b <= until; b += 60000) {
    const realC = realByTime.get(b);
    if (!realC) continue; // sem candle real desse minuto (ainda)
    const m = multiplier(w.factor, shape(b, startMs, endMs, rampMs));
    const oc = scaleCandle(realC, m);
    await PriceOverride.findOneAndUpdate(
      { assetId: w.assetId, openTime: new Date(b) },
      { $set: { ...oc, interventionId: w._id } },
      { upsert: true }
    );
  }
  if (now >= endMs) { w.status = 'done'; await w.save(); }
}

async function tick() {
  if (running) return;
  running = true;
  try {
    const now = Date.now();
    await activatePending(now);
    const actives = await PriceIntervention.find({ status: 'active' });
    for (const w of actives) {
      try { await generate(w, now); } catch (e) { console.error('window generate:', e.message); }
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

module.exports = { start, tick, generate, activatePending };
