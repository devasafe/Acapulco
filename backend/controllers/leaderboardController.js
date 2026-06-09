const User = require('../models/User');
const Position = require('../models/Position');
const market = require('../services/marketData');
const { getStartingBalance } = require('../utils/settings');

// GET /api/leaderboard → ranking por patrimônio (caixa + posições a preço real)
exports.getLeaderboard = async (req, res) => {
  try {
    const [users, positions, startingBalance] = await Promise.all([
      User.find({ isActive: true }).select('name wallet totalRealizedProfit').lean(),
      Position.find({ status: 'open', quantity: { $gt: 0 } }).lean(),
      getStartingBalance(),
    ]);

    // Busca cotações únicas uma única vez
    const symbols = [...new Set(positions.map((p) => p.symbol))];
    const priceMap = {};
    await Promise.all(
      symbols.map(async (s) => {
        try {
          const q = await market.getQuote(s);
          priceMap[s] = q.price;
        } catch (_) {}
      })
    );

    // Soma o valor das posições por usuário
    const posValueByUser = {};
    for (const p of positions) {
      const price = priceMap[p.symbol];
      const value = price != null ? price * p.quantity : p.avgEntryPrice * p.quantity;
      const key = String(p.userId);
      posValueByUser[key] = (posValueByUser[key] || 0) + value;
    }

    const ranked = users
      .map((u) => {
        const equity = (u.wallet || 0) + (posValueByUser[String(u._id)] || 0);
        const returnPercent = startingBalance > 0 ? ((equity - startingBalance) / startingBalance) * 100 : 0;
        return {
          name: u.name,
          equity,
          returnPercent,
          realizedPnl: u.totalRealizedProfit || 0,
        };
      })
      .sort((a, b) => b.equity - a.equity)
      .slice(0, 50);

    res.json(ranked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
