// backend/services/priceEngine/candleMath.js
// Funções PURAS de candle. Candle base = 5 minutos. Agregação para intervalos maiores
// (15min/1h/...) feita sobre arrays, sem DB -> testável.

const BASE_MS = 5 * 60 * 1000; // 5 minutos

// Início do bucket de 5min que contém `ts` (ms epoch).
function bucketStart(ts) {
  return Math.floor(ts / BASE_MS) * BASE_MS;
}

function newCandle(openTime, price) {
  return { openTime, open: price, high: price, low: price, close: price, volume: 1 };
}

// Retorna um NOVO candle com o preço aplicado (imutável).
function applyPrice(candle, price) {
  return {
    ...candle,
    high: Math.max(candle.high, price),
    low: Math.min(candle.low, price),
    close: price,
    volume: candle.volume + 1,
  };
}

// Agrega candles base de 5min em candles de `intervalMinutes` (múltiplo de 5).
// `candles` deve vir ordenado por openTime asc.
function aggregateCandles(candles, intervalMinutes) {
  const intervalMs = intervalMinutes * 60 * 1000;
  const groups = new Map();
  for (const c of candles) {
    const key = Math.floor(c.openTime / intervalMs) * intervalMs;
    const g = groups.get(key);
    if (!g) {
      groups.set(key, { openTime: key, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume });
    } else {
      g.high = Math.max(g.high, c.high);
      g.low = Math.min(g.low, c.low);
      g.close = c.close; // candles vêm ordenados -> o último fecha
      g.volume += c.volume;
    }
  }
  return Array.from(groups.values()).sort((a, b) => a.openTime - b.openTime);
}

module.exports = { BASE_MS, bucketStart, newCandle, applyPrice, aggregateCandles };
