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
