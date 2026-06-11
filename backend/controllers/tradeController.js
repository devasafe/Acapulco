const User = require('../models/User');
const Asset = require('../models/Asset');
const Position = require('../models/Position');
const Trade = require('../models/Trade');
const market = require('../services/marketData');
const { applyNetting } = require('../services/trading/netting');

const EPS = 1e-6;
const MIN_USD = 1;

async function getTradableAsset(symbol) {
  const s = String(symbol || '').toUpperCase().trim();
  if (!s) return null;
  return Asset.findOne({ symbol: s, isActive: true });
}

// Núcleo: resolve preço, decide o side (string fixa OU função do estado p/ close),
// calcula as unidades (via computeUnits) e aplica o netting.
async function core(req, res, sideOrFn, computeUnits) {
  const asset = await getTradableAsset(req.body.symbol);
  if (!asset) return res.status(400).json({ error: 'Ativo não disponível para negociação' });

  const quote = await market.getQuote(asset.symbol, asset.assetType);
  const price = Number(quote.price);
  if (!(price > 0)) return res.status(502).json({ error: 'Preço indisponível' });

  const user = await User.findById(req.user.userId);
  let position = await Position.findOne({ userId: user._id, symbol: asset.symbol });
  const cur = { net: position?.netUnits || 0, avgEntry: position?.avgEntryPrice || 0, reserved: position?.reserved || 0 };

  const side = typeof sideOrFn === 'function' ? sideOrFn(cur) : sideOrFn;
  const units = computeUnits(price, cur);
  if (side !== 'buy' && side !== 'sell') return res.status(400).json({ error: 'Ordem inválida' });
  if (!(units > 0)) return res.status(400).json({ error: 'Sem posição para fechar ou valor inválido' });

  const r = applyNetting(cur, side, units, price);
  if (user.wallet + r.cashDelta < -EPS) {
    return res.status(400).json({ error: 'Saldo (fictício) insuficiente para esse valor' });
  }

  user.wallet += r.cashDelta;
  user.totalRealizedProfit = (user.totalRealizedProfit || 0) + r.realizedPnl;
  await user.save();

  if (!position) position = new Position({ userId: user._id, symbol: asset.symbol, assetType: asset.assetType });
  position.netUnits = r.net;
  position.avgEntryPrice = r.avgEntry;
  position.reserved = r.reserved;
  position.realizedPnl = (position.realizedPnl || 0) + r.realizedPnl;
  position.status = Math.abs(r.net) < 1e-9 ? 'closed' : 'open';
  position.updatedAt = Date.now();
  await position.save();

  const usdAmount = units * price;
  const trade = await Trade.create({
    userId: user._id, symbol: asset.symbol, assetType: asset.assetType,
    side, usdAmount, units, price, total: usdAmount, realizedPnl: r.realizedPnl,
  });

  return res.status(201).json({ trade, wallet: user.wallet, position, realizedPnl: r.realizedPnl });
}

// POST /api/trades/buy  { symbol, usd }
exports.buy = (req, res) => {
  const usd = Number(req.body.usd);
  if (!(usd >= MIN_USD)) return res.status(400).json({ error: `Valor mínimo $${MIN_USD}` });
  return core(req, res, 'buy', (price) => usd / price).catch((e) => res.status(400).json({ error: e.message }));
};

// POST /api/trades/sell { symbol, usd }
exports.sell = (req, res) => {
  const usd = Number(req.body.usd);
  if (!(usd >= MIN_USD)) return res.status(400).json({ error: `Valor mínimo $${MIN_USD}` });
  return core(req, res, 'sell', (price) => usd / price).catch((e) => res.status(400).json({ error: e.message }));
};

// POST /api/trades/close { symbol } — fecha a posição líquida inteira (side pelo sentido).
exports.close = (req, res) =>
  core(req, res, (cur) => (cur.net > 0 ? 'sell' : 'buy'), (price, cur) => Math.abs(cur.net))
    .catch((e) => res.status(400).json({ error: e.message }));

// GET /api/trades  → histórico
exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.userId }).sort('-createdAt').limit(100);
    res.json(trades);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/trades/positions → posições abertas, valorizadas ao vivo
exports.getPositions = async (req, res) => {
  try {
    const positions = await Position.find({ userId: req.user.userId, status: 'open' }).lean();
    const open = positions.filter((p) => Math.abs(p.netUnits) > 1e-9);
    const withLive = await Promise.all(open.map(async (p) => {
      let currentPrice = null;
      try { currentPrice = Number((await market.getQuote(p.symbol, p.assetType)).price); } catch (_) {}
      const floatingPnl = currentPrice != null ? (currentPrice - p.avgEntryPrice) * p.netUnits : null;
      const floatingPnlPercent = currentPrice != null && p.reserved > 0 ? (floatingPnl / p.reserved) * 100 : null;
      return {
        ...p,
        direction: p.netUnits > 0 ? 'long' : 'short',
        units: Math.abs(p.netUnits),
        invested: p.reserved,
        currentPrice, floatingPnl, floatingPnlPercent,
        // compat com o dashboard atual:
        quantity: p.netUnits, unrealizedPnl: floatingPnl, unrealizedPnlPercent: floatingPnlPercent,
      };
    }));
    res.json(withLive);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/trades/stats → KPIs ao vivo
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const positions = await Position.find({ userId: user._id, status: 'open' }).lean();
    let marginUsed = 0;
    let floatingPnl = 0;
    let openPositions = 0;
    for (const p of positions) {
      if (Math.abs(p.netUnits) < 1e-9) continue;
      openPositions += 1;
      marginUsed += p.reserved;
      let currentPrice = null;
      try { currentPrice = Number((await market.getQuote(p.symbol, p.assetType)).price); } catch (_) {}
      if (currentPrice != null) floatingPnl += (currentPrice - p.avgEntryPrice) * p.netUnits;
    }
    const balance = user.wallet;
    const equity = balance + marginUsed + floatingPnl;
    const realizedPnl = user.totalRealizedProfit || 0;
    res.json({
      balance, equity, floatingPnl, marginUsed, freeMargin: balance, realizedPnl, openPositions,
      // compat com o dashboard atual:
      cash: balance, totalEquity: equity, unrealizedPnl: floatingPnl,
      positionsValue: marginUsed + floatingPnl, invested: marginUsed,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
