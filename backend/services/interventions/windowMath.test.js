const { shape, factorFor, multiplier, scaleCandle, aggregateRange, mergeOverrides, widenWithOverrides } = require('./windowMath');

describe('shape (trapézio)', () => {
  const s = 1000, e = 5000, ramp = 1000; // janela 1000..5000, rampa 1000ms
  test('fora da janela = 0', () => { expect(shape(500, s, e, ramp)).toBe(0); expect(shape(6000, s, e, ramp)).toBe(0); });
  test('meio da rampa de entrada', () => { expect(shape(1500, s, e, ramp)).toBeCloseTo(0.5, 5); });
  test('topo da entrada / sustentação = 1', () => { expect(shape(2000, s, e, ramp)).toBe(1); expect(shape(3000, s, e, ramp)).toBe(1); });
  test('meio da rampa de saída', () => { expect(shape(4500, s, e, ramp)).toBeCloseTo(0.5, 5); });
});

describe('factorFor', () => {
  test('percent', () => { expect(factorFor('percent', 10, 100)).toBeCloseTo(1.1, 5); });
  test('absolute = alvo/real', () => { expect(factorFor('absolute', 120, 100)).toBeCloseTo(1.2, 5); });
});

describe('multiplier', () => {
  test('shape 0 = 1 (sem efeito)', () => { expect(multiplier(1.2, 0)).toBeCloseTo(1, 5); });
  test('shape 1 = F', () => { expect(multiplier(1.2, 1)).toBeCloseTo(1.2, 5); });
  test('shape 0.5 = meio do caminho', () => { expect(multiplier(1.2, 0.5)).toBeCloseTo(1.1, 5); });
});

describe('scaleCandle', () => {
  test('escala OHLC, mantém volume', () => {
    expect(scaleCandle({ open: 10, high: 12, low: 9, close: 11, volume: 5 }, 1.1))
      .toMatchObject({ open: 11, high: 13.200000000000001, low: 9.9, close: 12.100000000000001, volume: 5 });
  });
});

describe('aggregateRange', () => {
  const c = [
    { time: 0, open: 10, high: 12, low: 9, close: 11, volume: 1 },
    { time: 60000, open: 11, high: 15, low: 11, close: 14, volume: 2 },
    { time: 120000, open: 14, high: 14, low: 8, close: 9, volume: 3 },
  ];
  test('agrega [0,180000) em 1 candle', () => {
    expect(aggregateRange(c, 0, 180000)).toMatchObject({ open: 10, high: 15, low: 8, close: 9, volume: 6 });
  });
  test('range vazio = null', () => { expect(aggregateRange(c, 200000, 300000)).toBeNull(); });
});

describe('mergeOverrides', () => {
  test('substitui o minuto com override', () => {
    const real = [{ time: 0, open: 1, high: 1, low: 1, close: 1, volume: 1 }, { time: 60000, open: 2, high: 2, low: 2, close: 2, volume: 1 }];
    const out = mergeOverrides(real, [{ time: 60000, open: 9, high: 9, low: 9, close: 9, volume: 7 }]);
    expect(out[0].close).toBe(1);
    expect(out[1]).toMatchObject({ time: 60000, close: 9, volume: 7 });
  });
});

describe('widenWithOverrides', () => {
  test('estica high/low do candle que contém o override (pavio)', () => {
    const candles = [{ time: 0, open: 10, high: 12, low: 9, close: 11, volume: 1 }];
    const out = widenWithOverrides(candles, [{ time: 30000, high: 20, low: 5, close: 18 }]);
    expect(out[0]).toMatchObject({ high: 20, low: 5, open: 10, close: 11 });
  });
});
