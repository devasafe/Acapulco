const { startOfBucket, nextBucket, bucketKey } = require('./registrationBuckets');

// Helpers: datas-calendário em UTC date-only (sem componente de hora).
const d = (s) => new Date(`${s}T00:00:00.000Z`);
const key = (date) => date.toISOString().slice(0, 10);

describe('startOfBucket', () => {
  test('day: mesmo dia', () => {
    expect(key(startOfBucket(d('2026-06-12'), 'day'))).toBe('2026-06-12');
  });
  test('week: volta para a segunda (sexta -> segunda)', () => {
    // 2026-06-12 é uma sexta-feira; a segunda da semana é 2026-06-08
    expect(key(startOfBucket(d('2026-06-12'), 'week'))).toBe('2026-06-08');
  });
  test('week: segunda permanece na segunda', () => {
    expect(key(startOfBucket(d('2026-06-08'), 'week'))).toBe('2026-06-08');
  });
  test('week: domingo pertence à semana que começou na segunda anterior', () => {
    // 2026-06-14 é domingo -> segunda 2026-06-08
    expect(key(startOfBucket(d('2026-06-14'), 'week'))).toBe('2026-06-08');
  });
  test('month: dia 1 do mês', () => {
    expect(key(startOfBucket(d('2026-06-12'), 'month'))).toBe('2026-06-01');
  });
});

describe('nextBucket', () => {
  test('day: +1 dia', () => {
    expect(key(nextBucket(d('2026-06-12'), 'day'))).toBe('2026-06-13');
  });
  test('week: +7 dias', () => {
    expect(key(nextBucket(d('2026-06-08'), 'week'))).toBe('2026-06-15');
  });
  test('month: +1 mês', () => {
    expect(key(nextBucket(d('2026-06-01'), 'month'))).toBe('2026-07-01');
  });
  test('month: vira o ano (dez -> jan)', () => {
    expect(key(nextBucket(d('2026-12-01'), 'month'))).toBe('2027-01-01');
  });
});

describe('bucketKey', () => {
  test('formata YYYY-MM-DD', () => {
    expect(bucketKey(d('2026-06-08'))).toBe('2026-06-08');
  });
});

const { fillBuckets } = require('./registrationBuckets');

describe('fillBuckets', () => {
  const from = d('2026-06-08'); // segunda
  const to = d('2026-06-22');   // segunda, 2 semanas depois

  test('day: gera todos os dias do range, vazios com count 0', () => {
    const counts = new Map([['2026-06-08', 2], ['2026-06-10', 5]]);
    const out = fillBuckets(counts, from, to, 'day');
    expect(out).toHaveLength(15); // 08..22 inclusive
    expect(out[0]).toEqual({ period: '2026-06-08', count: 2 });
    expect(out[1]).toEqual({ period: '2026-06-09', count: 0 });
    expect(out[2]).toEqual({ period: '2026-06-10', count: 5 });
    expect(out[14]).toEqual({ period: '2026-06-22', count: 0 });
  });

  test('week: 3 segundas (08, 15, 22)', () => {
    const counts = new Map([['2026-06-15', 4]]);
    const out = fillBuckets(counts, from, to, 'week');
    expect(out.map((b) => b.period)).toEqual(['2026-06-08', '2026-06-15', '2026-06-22']);
    expect(out.map((b) => b.count)).toEqual([0, 4, 0]);
  });

  test('month: alinha o início ao dia 1 mesmo se from for no meio do mês', () => {
    const out = fillBuckets(new Map([['2026-07-01', 3]]), d('2026-06-12'), d('2026-08-20'), 'month');
    expect(out.map((b) => b.period)).toEqual(['2026-06-01', '2026-07-01', '2026-08-01']);
    expect(out.map((b) => b.count)).toEqual([0, 3, 0]);
  });

  test('range de um único bucket', () => {
    const out = fillBuckets(new Map([['2026-06-08', 1]]), from, from, 'day');
    expect(out).toEqual([{ period: '2026-06-08', count: 1 }]);
  });

  test('chave sem correspondência no Map conta 0', () => {
    const out = fillBuckets(new Map(), from, d('2026-06-09'), 'day');
    expect(out).toEqual([
      { period: '2026-06-08', count: 0 },
      { period: '2026-06-09', count: 0 },
    ]);
  });
});
