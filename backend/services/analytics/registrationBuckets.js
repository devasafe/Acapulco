// Buckets de séries temporais para o dashboard admin.
// PURO: opera em datas-calendário UTC date-only (new Date(Date.UTC(y, m, d))).
// O fuso (America/Sao_Paulo) é aplicado na aggregation do Mongo, não aqui —
// este módulo só lida com a grade de buckets e o preenchimento de vazios.

const UNITS = ['day', 'week', 'month'];

// Zera a hora, mantendo o dia de calendário (UTC).
function toUTCDateOnly(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

// Início do bucket que contém `date`, para a granularidade dada.
// week começa na segunda-feira (igual ao $dateTrunc startOfWeek:'monday').
function startOfBucket(date, granularity) {
  const base = toUTCDateOnly(date);
  if (granularity === 'day') return base;
  if (granularity === 'month') {
    return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1));
  }
  // week: recua até segunda. getUTCDay(): 0=domingo..6=sábado.
  const dow = base.getUTCDay();
  const deltaToMonday = (dow + 6) % 7; // domingo(0)->6, segunda(1)->0, terça(2)->1...
  return new Date(base.getTime() - deltaToMonday * 86400000);
}

// Início do próximo bucket.
function nextBucket(date, granularity) {
  const base = toUTCDateOnly(date);
  if (granularity === 'day') return new Date(base.getTime() + 86400000);
  if (granularity === 'week') return new Date(base.getTime() + 7 * 86400000);
  // month
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 1));
}

// Chave string YYYY-MM-DD de uma data-calendário.
function bucketKey(date) {
  return toUTCDateOnly(date).toISOString().slice(0, 10);
}

module.exports = { UNITS, startOfBucket, nextBucket, bucketKey };
