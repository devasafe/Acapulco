const { computeTarget, buildOverrideCandle, overlayCandles } = require('./overlay');

describe('computeTarget', () => {
  test('absolute usa o valor', () => { expect(computeTarget('absolute', 66.37, 100)).toBeCloseTo(66.37, 5); });
  test('percent aplica sobre o preço real', () => { expect(computeTarget('percent', 10, 100)).toBeCloseTo(110, 5); });
  test('percent negativo', () => { expect(computeTarget('percent', -5, 200)).toBeCloseTo(190, 5); });
  test('nunca <= 0', () => { expect(computeTarget('absolute', -5, 100)).toBeGreaterThan(0); });
});

describe('buildOverrideCandle', () => {
  test('abre no real, fecha no alvo, high/low cobrem ambos', () => {
    const oc = buildOverrideCandle({ open: 100, high: 102, low: 99, close: 101, volume: 5 }, 110);
    expect(oc).toMatchObject({ open: 100, high: 110, low: 99, close: 110, volume: 5 });
  });
  test('alvo abaixo estica o low', () => {
    const oc = buildOverrideCandle({ open: 100, high: 102, low: 99, close: 101, volume: 5 }, 90);
    expect(oc).toMatchObject({ open: 100, high: 102, low: 90, close: 90 });
  });
});

describe('overlayCandles', () => {
  const candles = [
    { time: 0, open: 10, high: 11, low: 9, close: 10, volume: 1 },
    { time: 60000, open: 10, high: 12, low: 10, close: 11, volume: 1 },
    { time: 120000, open: 11, high: 13, low: 11, close: 12, volume: 1 },
  ];
  const override = { time: 60000, open: 10, high: 20, low: 10, close: 20 };
  test('1min (base): substitui o candle inteiro', () => {
    const out = overlayCandles(candles, [override], true);
    expect(out[1]).toMatchObject({ time: 60000, open: 10, high: 20, low: 10, close: 20 });
    expect(out[0]).toMatchObject({ close: 10 }); // intactos
    expect(out[2]).toMatchObject({ close: 12 });
  });
  test('timeframe maior: vira pavio (estica high/low, mantém close real)', () => {
    const big = [{ time: 0, open: 10, high: 12, low: 9, close: 12, volume: 3 }];
    const out = overlayCandles(big, [{ time: 60000, close: 20 }], false);
    expect(out[0]).toMatchObject({ high: 20, close: 12 }); // close real, high esticado
  });
  test('sem overrides devolve igual', () => {
    expect(overlayCandles(candles, [], true)).toEqual(candles);
  });
});
