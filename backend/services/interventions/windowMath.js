const MIN_PRICE = 1e-6;

// Trapézio 0->1->0: sobe na rampa de entrada, 1 na sustentação, desce na rampa de saída.
function shape(now, startAt, endAt, rampMs) {
  if (now <= startAt || now >= endAt) return 0;
  return Math.max(0, Math.min((now - startAt) / rampMs, (endAt - now) / rampMs, 1));
}

// Fator alvo travado: percent -> 1+v/100; absolute -> alvo/realInício.
function factorFor(mode, value, realAtStart) {
  if (mode === 'percent') return 1 + Number(value) / 100;
  if (mode === 'absolute') return realAtStart > 0 ? Number(value) / realAtStart : 1;
  return 1;
}

// Multiplicador no instante: 1 (sem efeito) .. F (no topo).
function multiplier(factor, shapeVal) { return 1 + (factor - 1) * shapeVal; }

function scaleCandle(c, m) {
  return {
    open: Math.max(c.open * m, MIN_PRICE),
    high: Math.max(c.high * m, MIN_PRICE),
    low: Math.max(c.low * m, MIN_PRICE),
    close: Math.max(c.close * m, MIN_PRICE),
    volume: c.volume || 0,
  };
}

// Agrega candles de 1min dentro de [from, to) em 1 OHLC.
function aggregateRange(candles1m, from, to) {
  const slice = candles1m.filter((c) => c.time >= from && c.time < to);
  if (!slice.length) return null;
  return {
    time: from,
    open: slice[0].open,
    high: Math.max(...slice.map((c) => c.high)),
    low: Math.min(...slice.map((c) => c.low)),
    close: slice[slice.length - 1].close,
    volume: slice.reduce((s, c) => s + (c.volume || 0), 0),
  };
}

// Substitui, por time, candles reais de 1min pelos overrides.
function mergeOverrides(real1m, overrides) {
  const map = new Map(overrides.map((o) => [o.time, o]));
  return real1m.map((c) => {
    const o = map.get(c.time);
    return o ? { time: c.time, open: o.open, high: o.high, low: o.low, close: o.close, volume: o.volume ?? c.volume } : c;
  });
}

// Timeframes largos (>1h): estica high/low do candle que contém cada override (pavio); open/close reais.
function widenWithOverrides(candles, overrides) {
  if (!overrides.length) return candles;
  const out = candles.map((c) => ({ ...c }));
  for (const o of overrides) {
    let idx = -1;
    for (let i = 0; i < out.length; i++) { if (out[i].time <= o.time) idx = i; else break; }
    if (idx < 0) continue;
    out[idx].high = Math.max(out[idx].high, o.high ?? o.close, o.close);
    out[idx].low = Math.min(out[idx].low, o.low ?? o.close, o.close);
  }
  return out;
}

module.exports = { MIN_PRICE, shape, factorFor, multiplier, scaleCandle, aggregateRange, mergeOverrides, widenWithOverrides };
