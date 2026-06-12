const { computeRetention } = require('./retention');

const DAY = 24 * 3600 * 1000;
const now = new Date('2026-06-12T00:00:00.000Z');
const daysAgo = (n) => new Date(now.getTime() - n * DAY);

describe('computeRetention', () => {
  test('D0 = 100% quando há usuários ativados', () => {
    const users = [
      { createdAt: daysAgo(10), lastTradeAt: daysAgo(10) },
      { createdAt: daysAgo(40), lastTradeAt: daysAgo(35) },
    ];
    const [d0] = computeRetention(users, [0], now);
    expect(d0).toEqual({ day: 0, retained: 100, eligible: 2, retainedCount: 2 });
  });

  test('retenção por marco: lifespan (últimoTrade − cadastro) determina permanência', () => {
    const users = [
      { createdAt: daysAgo(100), lastTradeAt: daysAgo(50) }, // lifespan 50d
      { createdAt: daysAgo(100), lastTradeAt: daysAgo(95) }, // lifespan 5d
    ];
    const pts = computeRetention(users, [1, 7, 30, 60], now);
    expect(pts.find((p) => p.day === 1)).toEqual({ day: 1, retained: 100, eligible: 2, retainedCount: 2 });
    expect(pts.find((p) => p.day === 7)).toEqual({ day: 7, retained: 50, eligible: 2, retainedCount: 1 });
    expect(pts.find((p) => p.day === 30)).toEqual({ day: 30, retained: 50, eligible: 2, retainedCount: 1 });
    expect(pts.find((p) => p.day === 60)).toEqual({ day: 60, retained: 0, eligible: 2, retainedCount: 0 });
  });

  test('censoring: conta nova não entra no denominador de marcos além da sua idade', () => {
    const users = [
      { createdAt: daysAgo(100), lastTradeAt: daysAgo(60) }, // idade 100, lifespan 40
      { createdAt: daysAgo(5), lastTradeAt: daysAgo(5) },    // idade 5, lifespan 0
    ];
    const pts = computeRetention(users, [30], now);
    expect(pts[0]).toEqual({ day: 30, retained: 100, eligible: 1, retainedCount: 1 });
  });

  test('eligible === 0 retorna 0%', () => {
    const users = [{ createdAt: daysAgo(5), lastTradeAt: daysAgo(5) }];
    const pts = computeRetention(users, [30], now);
    expect(pts[0]).toEqual({ day: 30, retained: 0, eligible: 0, retainedCount: 0 });
  });

  test('sem usuários ativados: tudo zerado', () => {
    const pts = computeRetention([], [0, 7, 30], now);
    expect(pts).toEqual([
      { day: 0, retained: 0, eligible: 0, retainedCount: 0 },
      { day: 7, retained: 0, eligible: 0, retainedCount: 0 },
      { day: 30, retained: 0, eligible: 0, retainedCount: 0 },
    ]);
  });

  test('arredonda a 1 casa decimal', () => {
    const users = [
      { createdAt: daysAgo(100), lastTradeAt: daysAgo(10) }, // lifespan 90 -> retido em D7
      { createdAt: daysAgo(100), lastTradeAt: daysAgo(99) }, // lifespan 1  -> não
      { createdAt: daysAgo(100), lastTradeAt: daysAgo(98) }, // lifespan 2  -> não
    ];
    const [d7] = computeRetention(users, [7], now);
    expect(d7).toEqual({ day: 7, retained: 33.3, eligible: 3, retainedCount: 1 });
  });
});
