// backend/services/priceEngine/candleMath.test.js
const {
  BASE_MS, bucketStart, newCandle, applyPrice, aggregateCandles,
} = require('./candleMath');

describe('bucketStart', () => {
  test('arredonda para o bucket de 5min', () => {
    const t = new Date('2026-06-10T12:07:30Z').getTime();
    const expected = new Date('2026-06-10T12:05:00Z').getTime();
    expect(bucketStart(t)).toBe(expected);
  });
});

describe('newCandle / applyPrice', () => {
  test('newCandle inicia OHLC iguais ao preço', () => {
    const c = newCandle(1000, 50);
    expect(c).toMatchObject({ openTime: 1000, open: 50, high: 50, low: 50, close: 50, volume: 1 });
  });
  test('applyPrice atualiza high/low/close e incrementa volume', () => {
    let c = newCandle(1000, 50);
    c = applyPrice(c, 60); // novo high
    c = applyPrice(c, 40); // novo low
    c = applyPrice(c, 55); // close
    expect(c).toMatchObject({ open: 50, high: 60, low: 40, close: 55, volume: 4 });
  });
});

describe('aggregateCandles', () => {
  // 3 candles de 5min -> 1 candle de 15min
  const base = [
    { openTime: 0, open: 10, high: 12, low: 9, close: 11, volume: 3 },
    { openTime: 300000, open: 11, high: 15, low: 11, close: 14, volume: 5 },
    { openTime: 600000, open: 14, high: 14, low: 8, close: 9, volume: 2 },
  ];
  test('agrega 3x5min em 1x15min com OHLC correto', () => {
    const out = aggregateCandles(base, 15);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ openTime: 0, open: 10, high: 15, low: 8, close: 9, volume: 10 });
  });
  test('fator 5 (sem agregação) devolve os mesmos candles', () => {
    const out = aggregateCandles(base, 5);
    expect(out).toHaveLength(3);
    expect(out[0]).toMatchObject({ openTime: 0, open: 10, close: 11 });
  });
});
