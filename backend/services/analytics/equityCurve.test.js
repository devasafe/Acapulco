const { buildEquityCurve } = require('./equityCurve');

// eventos/âncora em datas ao meio-dia UTC para cair sem ambiguidade no dia.
const d = (s) => new Date(`${s}T12:00:00.000Z`);

describe('buildEquityCurve', () => {
  test('curva plana quando não há eventos: tudo = âncora', () => {
    const out = buildEquityCurve([], 1000, d('2026-06-08'), d('2026-06-10'), 'day');
    expect(out).toEqual([
      { period: '2026-06-08', equity: 1000 },
      { period: '2026-06-09', equity: 1000 },
      { period: '2026-06-10', equity: 1000 },
    ]);
  });

  test('último ponto = âncora; acumula eventos por bucket', () => {
    const events = [{ date: d('2026-06-09'), delta: 200 }, { date: d('2026-06-10'), delta: -50 }];
    const out = buildEquityCurve(events, 1000, d('2026-06-08'), d('2026-06-10'), 'day');
    // startValue = 1000 - (200-50) = 850
    expect(out).toEqual([
      { period: '2026-06-08', equity: 850 },
      { period: '2026-06-09', equity: 1050 },
      { period: '2026-06-10', equity: 1000 },
    ]);
  });

  test('bucket sem evento herda o valor acumulado anterior', () => {
    const events = [{ date: d('2026-06-08'), delta: 100 }];
    const out = buildEquityCurve(events, 100, d('2026-06-08'), d('2026-06-10'), 'day');
    expect(out.map((p) => p.equity)).toEqual([100, 100, 100]);
  });

  test('arredonda a 2 casas', () => {
    const events = [{ date: d('2026-06-08'), delta: 33.333 }];
    const out = buildEquityCurve(events, 33.333, d('2026-06-08'), d('2026-06-08'), 'day');
    expect(out).toEqual([{ period: '2026-06-08', equity: 33.33 }]);
  });
});
