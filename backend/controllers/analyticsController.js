const { getAnalytics, getEquityCurve } = require('../services/analytics/userAnalytics');
const { UNITS } = require('../services/analytics/registrationBuckets');

function parseDateOnly(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const dt = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function resolveRange(req) {
  const granularity = req.query.granularity || 'week';
  if (!UNITS.includes(granularity)) return { error: `granularity inválida: use ${UNITS.join(' | ')}` };
  const today = new Date();
  const defaultTo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const defaultFrom = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 6, today.getUTCDate()));
  const from = req.query.from ? parseDateOnly(req.query.from) : defaultFrom;
  const to = req.query.to ? parseDateOnly(req.query.to) : defaultTo;
  if (!from || !to) return { error: 'from/to devem estar no formato YYYY-MM-DD' };
  if (from.getTime() > to.getTime()) return { error: 'from não pode ser maior que to' };
  return { from, to, granularity };
}

async function sendAnalytics(userId, res) {
  const data = await getAnalytics(userId);
  if (!data) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(data);
}

async function sendCurve(userId, req, res) {
  const r = resolveRange(req);
  if (r.error) return res.status(400).json({ error: r.error });
  const data = await getEquityCurve(userId, r.from, r.to, r.granularity);
  if (data == null) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(data);
}

exports.meAnalytics = (req, res) => sendAnalytics(req.user.userId, res).catch((e) => res.status(500).json({ error: e.message }));
exports.meEquityCurve = (req, res) => sendCurve(req.user.userId, req, res).catch((e) => res.status(500).json({ error: e.message }));
exports.adminUserAnalytics = (req, res) => sendAnalytics(req.params.id, res).catch((e) => res.status(500).json({ error: e.message }));
exports.adminUserEquityCurve = (req, res) => sendCurve(req.params.id, req, res).catch((e) => res.status(500).json({ error: e.message }));
