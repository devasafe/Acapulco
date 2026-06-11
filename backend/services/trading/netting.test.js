const { applyNetting } = require('./netting');

describe('applyNetting (unidades)', () => {
  const P = (net = 0, avgEntry = 0, reserved = 0) => ({ net, avgEntry, reserved });

  test('abre long', () => {
    const r = applyNetting(P(), 'buy', 0.1, 100);
    expect(r).toMatchObject({ net: 0.1, avgEntry: 100 });
    expect(r.reserved).toBeCloseTo(10, 6);
    expect(r.cashDelta).toBeCloseTo(-10, 6);
    expect(r.realizedPnl).toBeCloseTo(0, 6);
  });
  test('aumenta long com preço médio ponderado', () => {
    const r = applyNetting(P(0.1, 100, 10), 'buy', 0.1, 120);
    expect(r.net).toBeCloseTo(0.2, 6);
    expect(r.avgEntry).toBeCloseTo(110, 6);
    expect(r.cashDelta).toBeCloseTo(-12, 6);
  });
  test('reduz long parcial realiza P&L', () => {
    const r = applyNetting(P(0.2, 110, 22), 'sell', 0.1, 130);
    expect(r.net).toBeCloseTo(0.1, 6);
    expect(r.avgEntry).toBeCloseTo(110, 6);
    expect(r.realizedPnl).toBeCloseTo(2, 6);   // (130-110)*0.1
    expect(r.cashDelta).toBeCloseTo(13, 6);     // libera 11 + pnl 2
  });
  test('fecha long exato zera', () => {
    const r = applyNetting(P(0.1, 110, 11), 'sell', 0.1, 130);
    expect(r.net).toBe(0);
    expect(r.avgEntry).toBe(0);
    expect(r.reserved).toBe(0);
    expect(r.realizedPnl).toBeCloseTo(2, 6);
    expect(r.cashDelta).toBeCloseTo(13, 6);
  });
  test('cruza o zero: fecha long e abre short', () => {
    const r = applyNetting(P(0.1, 110, 11), 'sell', 0.3, 130);
    expect(r.net).toBeCloseTo(-0.2, 6);
    expect(r.avgEntry).toBeCloseTo(130, 6);
    expect(r.realizedPnl).toBeCloseTo(2, 6);
    expect(r.cashDelta).toBeCloseTo(-13, 6);    // +13 do fecha, -26 do short
    expect(r.reserved).toBeCloseTo(26, 6);
  });
  test('abre short', () => {
    const r = applyNetting(P(), 'sell', 0.1, 100);
    expect(r.net).toBeCloseTo(-0.1, 6);
    expect(r.avgEntry).toBe(100);
    expect(r.cashDelta).toBeCloseTo(-10, 6);
  });
  test('short lucra na queda ao fechar', () => {
    const r = applyNetting(P(-0.1, 100, 10), 'buy', 0.1, 90);
    expect(r.net).toBe(0);
    expect(r.realizedPnl).toBeCloseTo(1, 6);    // (-1)*(90-100)*0.1
    expect(r.cashDelta).toBeCloseTo(11, 6);
  });
});
