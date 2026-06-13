const User = require('../../models/User');
const Position = require('../../models/Position');
const Trade = require('../../models/Trade');
const Transaction = require('../../models/Transaction');
const market = require('../marketData');
const { buildEquityCurve } = require('./equityCurve');

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// Snapshot ao vivo (espelha tradeController.getStats). Retorna null se o usuário não existe.
async function liveSnapshot(userId) {
  const user = await User.findById(userId);
  if (!user) return null;
  const positions = await Position.find({ userId, status: 'open' }).lean();
  let marginUsed = 0;
  let floatingPnl = 0;
  for (const p of positions) {
    if (Math.abs(p.netUnits) < 1e-9) continue;
    marginUsed += p.reserved;
    let cp = null;
    try { cp = Number((await market.getQuote(p.symbol, p.assetType)).price); } catch (_) {}
    if (cp != null) floatingPnl += (cp - p.avgEntryPrice) * p.netUnits;
  }
  return { user, balance: user.wallet, marginUsed, floatingPnl, realizedPnl: user.totalRealizedProfit || 0 };
}

async function getAnalytics(userId) {
  const snap = await liveSnapshot(userId);
  if (!snap) return null;
  const { user, balance, marginUsed, floatingPnl, realizedPnl } = snap;
  const equity = balance + marginUsed + floatingPnl;

  const trades = await Trade.find({ userId }).lean();
  const nTrades = trades.length;
  const volume = trades.reduce((s, t) => s + (Number(t.usdAmount) || 0), 0);
  const closed = trades.filter((t) => Math.abs(Number(t.realizedPnl) || 0) > 1e-9);
  const wins = closed.filter((t) => (Number(t.realizedPnl) || 0) > 0).length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 1000) / 10 : 0;
  const pnls = trades.map((t) => Number(t.realizedPnl) || 0);
  const bestTrade = pnls.length ? Math.max(...pnls) : 0;
  const worstTrade = pnls.length ? Math.min(...pnls) : 0;
  const base = (balance + marginUsed) - realizedPnl;
  const roi = base > 0 ? Math.round((realizedPnl / base) * 1000) / 10 : 0;

  return {
    user: { name: user.name, email: user.email },
    equity: round2(equity), balance: round2(balance), marginUsed: round2(marginUsed),
    floatingPnl: round2(floatingPnl), realizedPnl: round2(realizedPnl),
    nTrades, volume: round2(volume), winRate,
    bestTrade: round2(bestTrade), worstTrade: round2(worstTrade), roi,
  };
}

async function getEquityCurve(userId, from, to, granularity) {
  const snap = await liveSnapshot(userId);
  if (!snap) return null;
  const anchorValue = snap.balance + snap.marginUsed;

  const events = [];
  const txs = await Transaction.find({ userId, createdAt: { $lte: to } }).lean();
  for (const t of txs) {
    const a = Number(t.amount) || 0;
    if (t.type === 'deposit' || t.type === 'referral_bonus' || t.type === 'profit') events.push({ date: t.createdAt, delta: a });
    else if (t.type === 'withdrawal') events.push({ date: t.createdAt, delta: -a });
  }
  const trades = await Trade.find({ userId, createdAt: { $lte: to } }).lean();
  for (const tr of trades) events.push({ date: tr.createdAt, delta: Number(tr.realizedPnl) || 0 });

  return buildEquityCurve(events, anchorValue, from, to, granularity);
}

module.exports = { getAnalytics, getEquityCurve };
