const MIN_PRICE = 1e-6;

// Alvo a partir do modo e do preço real no instante agendado.
function computeTarget(mode, value, realPrice) {
  let t;
  if (mode === 'absolute') t = Number(value);
  else if (mode === 'percent') t = realPrice * (1 + Number(value) / 100);
  else t = realPrice;
  return Math.max(t, MIN_PRICE);
}

// Candle de override de 1min: abre no real, fecha no alvo, high/low cobrem ambos.
function buildOverrideCandle(realCandle, target) {
  const r = realCandle || { open: target, high: target, low: target, volume: 0 };
  return {
    open: r.open,
    high: Math.max(r.high, target),
    low: Math.min(r.low, target),
    close: target,
    volume: r.volume || 0,
  };
}

// Sobrepõe overrides nos candles reais (asc por time).
// overrides: [{ time (ms, bucket 1min), open?, high?, low?, close }]
// isBaseInterval: true no gráfico de 1min (substitui o candle); senão pavio (estica high/low).
function overlayCandles(candles, overrides, isBaseInterval) {
  if (!overrides || !overrides.length || !candles.length) return candles;
  const out = candles.map((c) => ({ ...c }));
  for (const o of overrides) {
    let idx = -1;
    for (let i = 0; i < out.length; i++) {
      if (out[i].time <= o.time) idx = i; else break;
    }
    if (idx < 0) continue;
    const c = out[idx];
    if (isBaseInterval && c.time === o.time) {
      c.open = o.open; c.high = o.high; c.low = o.low; c.close = o.close;
    } else {
      c.high = Math.max(c.high, o.close);
      c.low = Math.min(c.low, o.close);
    }
  }
  return out;
}

module.exports = { MIN_PRICE, computeTarget, buildOverrideCandle, overlayCandles };
