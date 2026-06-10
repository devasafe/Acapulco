// backend/services/priceEngine/index.js
// Motor de preço: a cada TICK_MS computa o próximo preço de cada ativo 'controlled',
// persiste o candle de 5min e atualiza control.currentPrice. Roda 24/7.
const Asset = require('../../models/Asset');
const crypto = require('../marketData/cryptoProvider');
const { TICK_MS, makeRng, computeNextPrice } = require('./engineMath');
const candleStore = require('./candleStore');
const { BASE_MS } = require('./candleMath');

const BACKFILL_CAP_MS = Number(process.env.PRICE_ENGINE_BACKFILL_CAP_MS) || 24 * 60 * 60 * 1000; // 1 dia
let running = false; // trava de reentrância

// Pega a variação relativa da referência desde o último tique e atualiza refLastPrice.
async function referenceChangeRatio(asset) {
  const sym = asset.control?.referenceSymbol;
  if (!sym) return 0;
  try {
    const q = await crypto.getQuote(sym);
    const prev = asset.control.refLastPrice;
    asset.control.refLastPrice = q.price;
    if (!prev || !(prev > 0)) return 0;
    return (q.price - prev) / prev;
  } catch (_) {
    return 0; // falha pontual da Binance: ignora referência neste tique
  }
}

// Processa um ativo: calcula novo preço, persiste candle, atualiza estado.
async function processAsset(asset, now) {
  const c = asset.control || {};
  if (!c.currentPrice || !(c.currentPrice > 0)) return; // sem preço inicial: configurar antes
  const refRatio = await referenceChangeRatio(asset);
  const rng = makeRng((asset._id.toString().slice(-8).split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)) + now);

  const next = computeNextPrice({
    currentPrice: c.currentPrice,
    referenceChangeRatio: refRatio,
    followStrength: c.followStrength,
    noiseVolatility: c.noiseVolatility,
    trend: c.trend,
    target: c.target,
  }, now, rng);

  // Desativa o alvo ao concluir o tempo.
  if (c.target && c.target.active && now >= new Date(c.target.endAt).getTime()) {
    c.target.active = false;
  }

  c.currentPrice = next;
  asset.markModified('control');
  await asset.save();
  await candleStore.recordPrice(asset._id, next, now);
}

// Preenche candles faltantes desde o último salvo (com teto de segurança).
async function backfillAsset(asset) {
  const last = await candleStore.lastCandleTime(asset._id);
  if (!last) return;
  const now = Date.now();
  let gap = now - last;
  if (gap <= BASE_MS) return;          // nada relevante a preencher
  if (gap > BACKFILL_CAP_MS) {         // fora demais: re-larga do último preço, sem simular tudo
    await candleStore.recordPrice(asset._id, asset.control.currentPrice, now);
    return;
  }
  for (let t = last + TICK_MS; t < now; t += TICK_MS) {
    await processAsset(asset, t);
  }
}

async function tick() {
  if (running) return; // não sobrepõe tiques
  running = true;
  try {
    const assets = await Asset.find({ priceMode: 'controlled', isActive: true });
    const now = Date.now();
    for (const a of assets) {
      try { await processAsset(a, now); } catch (e) { console.error(`priceEngine tick ${a.symbol}:`, e.message); }
    }
  } catch (e) {
    console.error('priceEngine tick:', e.message);
  } finally {
    running = false;
  }
}

async function start() {
  try {
    const assets = await Asset.find({ priceMode: 'controlled', isActive: true });
    for (const a of assets) {
      try { await backfillAsset(a); } catch (e) { console.error(`priceEngine backfill ${a.symbol}:`, e.message); }
    }
  } catch (e) {
    console.error('priceEngine backfill:', e.message);
  }
  setInterval(tick, TICK_MS);
  console.log(`Price engine ativo (tique a cada ${TICK_MS}ms)`);
}

module.exports = { start, tick, processAsset, backfillAsset };
