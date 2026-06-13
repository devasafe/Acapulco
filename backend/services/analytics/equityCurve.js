// Reconstrução pura da curva de patrimônio realizado a partir de eventos datados.
// Reusa a grade de buckets de registrationBuckets. PURO (sem I/O).

const { startOfBucket, nextBucket, bucketKey } = require('./registrationBuckets');

// events: [{ date: Date, delta: Number }] (todos com date <= to)
// anchorValue: patrimônio realizado em `to` (fim do período)
// Retorna [{ period: 'YYYY-MM-DD', equity }] — equity ao fim de cada bucket; o último = âncora.
function buildEquityCurve(events, anchorValue, from, to, granularity) {
  const startValue = anchorValue - events.reduce((s, e) => s + e.delta, 0);
  const result = [];
  let cursor = startOfBucket(from, granularity);
  const lastStart = startOfBucket(to, granularity);
  while (cursor.getTime() <= lastStart.getTime()) {
    const nextStart = nextBucket(cursor, granularity).getTime();
    let acc = startValue;
    for (const e of events) {
      if (e.date.getTime() < nextStart) acc += e.delta;
    }
    result.push({ period: bucketKey(cursor), equity: Math.round(acc * 100) / 100 });
    cursor = nextBucket(cursor, granularity);
  }
  return result;
}

module.exports = { buildEquityCurve };
