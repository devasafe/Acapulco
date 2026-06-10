// backend/services/priceEngine/engineMath.test.js
const {
  makeRng, gaussian, targetPathPrice, computeNextPrice, applyJump, TICKS_PER_DAY,
} = require('./engineMath');

describe('makeRng', () => {
  test('é determinístico para a mesma semente', () => {
    const a = makeRng(123); const b = makeRng(123);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });
  test('retorna valores em [0,1)', () => {
    const r = makeRng(7);
    for (let i = 0; i < 50; i++) { const v = r(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
});

describe('gaussian', () => {
  test('média perto de 0 em muitas amostras', () => {
    const r = makeRng(42); let sum = 0; const N = 5000;
    for (let i = 0; i < N; i++) sum += gaussian(r);
    expect(Math.abs(sum / N)).toBeLessThan(0.1);
  });
});

describe('targetPathPrice', () => {
  const t = { startPrice: 100, targetPrice: 200, startAt: 1000, endAt: 2000, easing: 'linear' };
  test('no início retorna startPrice', () => { expect(targetPathPrice(t, 1000)).toBe(100); });
  test('no fim retorna targetPrice', () => { expect(targetPathPrice(t, 2000)).toBe(200); });
  test('no meio (linear) retorna o ponto médio', () => { expect(targetPathPrice(t, 1500)).toBeCloseTo(150, 5); });
  test('clampa antes do início e depois do fim', () => {
    expect(targetPathPrice(t, 0)).toBe(100);
    expect(targetPathPrice(t, 9999)).toBe(200);
  });
});

describe('computeNextPrice', () => {
  test('com alvo ativo e ruído zero, no endAt chega no targetPrice', () => {
    const rng = makeRng(1);
    const price = computeNextPrice({
      currentPrice: 100, referenceChangeRatio: 0, followStrength: 0.6, noiseVolatility: 0,
      trend: { active: false }, target: { active: true, startPrice: 100, targetPrice: 150, startAt: 0, endAt: 100, easing: 'linear' },
    }, 100, rng);
    expect(price).toBeCloseTo(150, 5);
  });
  test('sem diretivas, só referência move o preço', () => {
    const rng = makeRng(1);
    const price = computeNextPrice({
      currentPrice: 100, referenceChangeRatio: 0.10, followStrength: 0.5, noiseVolatility: 0,
      trend: { active: false }, target: { active: false },
    }, 0, rng);
    expect(price).toBeCloseTo(105, 5); // 100 * (1 + 0.10*0.5)
  });
  test('preço nunca fica <= 0', () => {
    const rng = makeRng(1);
    const price = computeNextPrice({
      currentPrice: 0.0001, referenceChangeRatio: -0.99, followStrength: 1, noiseVolatility: 0,
      trend: { active: false }, target: { active: false },
    }, 0, rng);
    expect(price).toBeGreaterThan(0);
  });
});

describe('applyJump', () => {
  test('por preço absoluto', () => { expect(applyJump(100, { toPrice: 137 })).toBe(137); });
  test('por percentual', () => { expect(applyJump(100, { percent: 10 })).toBeCloseTo(110, 5); });
  test('nunca <= 0', () => { expect(applyJump(100, { toPrice: -5 })).toBeGreaterThan(0); });
  // Reproduz como o controller chama: Number(req.body.x) vira NaN no campo ausente.
  test('percentual funciona mesmo com toPrice=NaN (caminho do controller)', () => {
    expect(applyJump(100, { toPrice: NaN, percent: 5 })).toBeCloseTo(105, 5);
  });
  test('preço absoluto funciona mesmo com percent=NaN (caminho do controller)', () => {
    expect(applyJump(100, { toPrice: 150, percent: NaN })).toBe(150);
  });
});
