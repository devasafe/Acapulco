// backend/services/priceEngine/engineMath.js
// Funções PURAS do motor de preço. Sem DB, sem tempo real implícito (recebe `now` e `rng`).
// Determinístico dado o rng -> fácil de testar.

const MIN_PRICE = 1e-6;
const TICK_MS = Number(process.env.PRICE_ENGINE_TICK_MS) || 30000;
const TICKS_PER_DAY = Math.max(1, Math.round((24 * 60 * 60 * 1000) / TICK_MS));

// PRNG mulberry32 -> [0,1). Semeável (testável).
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Normal padrão via Box-Muller, consumindo o rng.
function gaussian(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const EASINGS = {
  linear: (t) => t,
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

// Preço planejado na trajetória startAt->endAt no instante `now`.
function targetPathPrice(target, now) {
  const { startPrice, targetPrice, startAt, endAt, easing } = target;
  const total = endAt - startAt;
  if (!(total > 0)) return targetPrice;
  const progress = Math.min(1, Math.max(0, (now - startAt) / total));
  const ease = (EASINGS[easing] || EASINGS.easeInOut)(progress);
  return startPrice + (targetPrice - startPrice) * ease;
}

// Próximo preço combinando referência + ruído + tendência + alvo.
// state: { currentPrice, referenceChangeRatio, followStrength, noiseVolatility, trend, target }
function computeNextPrice(state, now, rng) {
  const { currentPrice, referenceChangeRatio, followStrength, noiseVolatility, trend, target } = state;
  let price;

  if (target && target.active) {
    // Quando há alvo, a trajetória planejada manda (garante chegar no alvo no tempo).
    price = targetPathPrice(target, now);
    price *= 1 + gaussian(rng) * noiseVolatility;                 // só "respira" por cima
    price *= 1 + (referenceChangeRatio || 0) * followStrength * 0.3; // leve sabor de mercado real
  } else {
    // Movimento livre: referência + ruído + tendência.
    price = currentPrice * (1 + (referenceChangeRatio || 0) * followStrength);
    price *= 1 + gaussian(rng) * noiseVolatility;
    if (trend && trend.active) {
      const perTick = (trend.dailyDriftPercent / 100) / TICKS_PER_DAY;
      price *= 1 + perTick;
    }
  }
  return Math.max(price, MIN_PRICE);
}

// Pulo instantâneo (não tem estado próprio — só muda o preço).
// Usa Number.isFinite (não typeof): o controller passa Number(req.body.x), que vira
// NaN quando o campo está ausente. NaN é typeof 'number', então typeof deixaria o
// pulo por percentual quebrado. isFinite(NaN)===false faz o fallback correto.
function applyJump(currentPrice, { toPrice, percent }) {
  let p;
  if (Number.isFinite(toPrice)) p = toPrice;
  else if (Number.isFinite(percent)) p = currentPrice * (1 + percent / 100);
  else p = currentPrice;
  return Math.max(p, MIN_PRICE);
}

module.exports = {
  MIN_PRICE, TICK_MS, TICKS_PER_DAY,
  makeRng, gaussian, targetPathPrice, computeNextPrice, applyJump,
};
