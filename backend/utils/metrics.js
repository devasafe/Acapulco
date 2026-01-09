const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Investment = require('../models/Investment');

// Helper: formata data YYYY-MM-DD
function toDateKey(d) {
  const dt = new Date(d);
  return dt.toISOString().slice(0,10);
}

async function computeMetrics(days = 30) {
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - (days - 1));
  start.setHours(0,0,0,0);

  const totalUsers = await User.countDocuments();

  // Sum totals
  const depositsAgg = await Transaction.aggregate([
    { $match: { type: 'deposit' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalDeposits = (depositsAgg[0] && depositsAgg[0].total) || 0;

  const withdrawalsAgg = await Transaction.aggregate([
    { $match: { type: 'withdrawal' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalWithdrawals = (withdrawalsAgg[0] && withdrawalsAgg[0].total) || 0;

  const investedAgg = await Transaction.aggregate([
    { $match: { type: 'buy' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalInvested = (investedAgg[0] && investedAgg[0].total) || 0;

  const netFlow = totalDeposits - totalWithdrawals;

  // Series by day
  const depositsByDayRaw = await Transaction.aggregate([
    { $match: { type: 'deposit', createdAt: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$amount' } } },
    { $sort: { _id: 1 } }
  ]);

  const withdrawalsByDayRaw = await Transaction.aggregate([
    { $match: { type: 'withdrawal', createdAt: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$amount' } } },
    { $sort: { _id: 1 } }
  ]);

  // users by day
  const usersByDayRaw = await User.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  // normalize arrays to every date in range
  const byDate = {};
  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0,10);
    byDate[key] = { deposit: 0, withdrawal: 0, users: 0 };
  }
  depositsByDayRaw.forEach(r => { if (byDate[r._id]) byDate[r._id].deposit = r.total; });
  withdrawalsByDayRaw.forEach(r => { if (byDate[r._id]) byDate[r._id].withdrawal = r.total; });
  usersByDayRaw.forEach(r => { if (byDate[r._id]) byDate[r._id].users = r.count; });

  const dates = Object.keys(byDate).sort();
  const depositsByDay = dates.map(d => ({ date: d, amount: byDate[d].deposit }));
  const withdrawalsByDay = dates.map(d => ({ date: d, amount: byDate[d].withdrawal }));
  const usersByDay = dates.map(d => ({ date: d, count: byDate[d].users }));

  return {
    totalUsers,
    totalDeposits,
    totalWithdrawals,
    totalInvested,
    netFlow,
    depositsByDay,
    withdrawalsByDay,
    usersByDay
  };
}

async function emitMetricsSnapshot() {
  try {
    const { getIO } = require('./socket');
    const io = getIO();
    const metrics = await computeMetrics(30);
    io.to('admins').emit('metrics_snapshot', metrics);
    return metrics;
  } catch (err) {
    console.warn('Não foi possível emitir snapshot de métricas:', err.message || err);
    throw err;
  }
}

module.exports = { computeMetrics, emitMetricsSnapshot };
