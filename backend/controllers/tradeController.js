const User = require('../models/User');
const Asset = require('../models/Asset');
const Position = require('../models/Position');
const Trade = require('../models/Trade');
const market = require('../services/marketData');

// Resolve o ativo na watchlist (precisa estar ativo para ser negociável)
async function getTradableAsset(symbol) {
  const s = String(symbol || '').toUpperCase().trim();
  if (!s) return null;
  return Asset.findOne({ symbol: s, isActive: true });
}

// POST /api/trades/buy  { symbol, quantity }
exports.buy = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!quantity || quantity <= 0) return res.status(400).json({ error: 'Quantidade inválida' });

    const asset = await getTradableAsset(req.body.symbol);
    if (!asset) return res.status(400).json({ error: 'Ativo não disponível para negociação' });

    const quote = await market.getQuote(asset.symbol, asset.assetType, asset.priceMode);
    const price = Number(quote.price);
    const cost = price * quantity;

    const user = await User.findById(req.user.userId);
    if (user.wallet < cost) {
      return res.status(400).json({ error: 'Saldo (fictício) insuficiente' });
    }

    // Debita caixa virtual
    user.wallet -= cost;
    await user.save();

    // Atualiza/abre posição com preço médio
    let position = await Position.findOne({ userId: user._id, symbol: asset.symbol });
    if (!position) {
      position = new Position({
        userId: user._id,
        symbol: asset.symbol,
        assetType: asset.assetType,
        quantity,
        avgEntryPrice: price,
        status: 'open',
      });
    } else {
      const newQty = position.quantity + quantity;
      position.avgEntryPrice = (position.quantity * position.avgEntryPrice + quantity * price) / newQty;
      position.quantity = newQty;
      position.status = 'open';
    }
    position.updatedAt = Date.now();
    await position.save();

    const trade = await Trade.create({
      userId: user._id,
      symbol: asset.symbol,
      assetType: asset.assetType,
      side: 'buy',
      quantity,
      price,
      total: cost,
    });

    res.status(201).json({ trade, wallet: user.wallet, position });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST /api/trades/sell  { symbol, quantity }
exports.sell = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!quantity || quantity <= 0) return res.status(400).json({ error: 'Quantidade inválida' });

    const asset = await getTradableAsset(req.body.symbol);
    if (!asset) return res.status(400).json({ error: 'Ativo não disponível para negociação' });

    const user = await User.findById(req.user.userId);
    const position = await Position.findOne({ userId: user._id, symbol: asset.symbol });
    if (!position || position.quantity < quantity) {
      return res.status(400).json({ error: 'Você não tem quantidade suficiente desse ativo' });
    }

    const quote = await market.getQuote(asset.symbol, asset.assetType, asset.priceMode);
    const price = Number(quote.price);
    const proceeds = price * quantity;
    const realizedPnl = (price - position.avgEntryPrice) * quantity;

    // Credita caixa virtual
    user.wallet += proceeds;
    user.totalRealizedProfit = (user.totalRealizedProfit || 0) + realizedPnl;
    await user.save();

    // Atualiza posição
    position.quantity -= quantity;
    position.realizedPnl = (position.realizedPnl || 0) + realizedPnl;
    if (position.quantity <= 1e-12) {
      position.quantity = 0;
      position.status = 'closed';
    }
    position.updatedAt = Date.now();
    await position.save();

    const trade = await Trade.create({
      userId: user._id,
      symbol: asset.symbol,
      assetType: asset.assetType,
      side: 'sell',
      quantity,
      price,
      total: proceeds,
      realizedPnl,
    });

    res.status(201).json({ trade, wallet: user.wallet, position, realizedPnl });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/trades  → histórico de execuções
exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.userId })
      .sort('-createdAt')
      .limit(100);
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/trades/positions  → posições abertas, valorizadas ao vivo
exports.getPositions = async (req, res) => {
  try {
    const positions = await Position.find({ userId: req.user.userId, status: 'open', quantity: { $gt: 0 } }).lean();
    const withLive = await Promise.all(
      positions.map(async (p) => {
        let currentPrice = null;
        try {
          const q = await market.getQuote(p.symbol, p.assetType);
          currentPrice = Number(q.price);
        } catch (_) {}
        const marketValue = currentPrice != null ? currentPrice * p.quantity : null;
        const cost = p.avgEntryPrice * p.quantity;
        const unrealizedPnl = currentPrice != null ? marketValue - cost : null;
        const unrealizedPnlPercent =
          currentPrice != null && cost > 0 ? (unrealizedPnl / cost) * 100 : null;
        return { ...p, currentPrice, marketValue, unrealizedPnl, unrealizedPnlPercent };
      })
    );
    res.json(withLive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/trades/stats  → KPIs do dashboard, calculados ao vivo
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const positions = await Position.find({ userId: user._id, status: 'open', quantity: { $gt: 0 } }).lean();

    let positionsValue = 0;
    let invested = 0;
    let unrealizedPnl = 0;
    for (const p of positions) {
      const cost = p.avgEntryPrice * p.quantity;
      invested += cost;
      let currentPrice = null;
      try {
        const q = await market.getQuote(p.symbol, p.assetType);
        currentPrice = Number(q.price);
      } catch (_) {}
      if (currentPrice != null) {
        positionsValue += currentPrice * p.quantity;
        unrealizedPnl += currentPrice * p.quantity - cost;
      } else {
        positionsValue += cost; // fallback: usa custo se a cotação falhar
      }
    }

    const cash = user.wallet;
    const totalEquity = cash + positionsValue;
    const realizedPnl = user.totalRealizedProfit || 0;

    res.json({
      cash,
      positionsValue,
      totalEquity,
      invested,
      unrealizedPnl,
      realizedPnl,
      openPositions: positions.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
