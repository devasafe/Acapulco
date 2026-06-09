const market = require('../services/marketData');

// GET /api/market/quote/:symbol?assetType=crypto
exports.getQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const assetType = req.query.assetType || 'crypto';
    const quote = await market.getQuote(symbol, assetType);
    res.json(quote);
  } catch (err) {
    res.status(502).json({ error: `Falha ao obter cotação: ${err.message}` });
  }
};

// GET /api/market/candles/:symbol?interval=1h&limit=200&assetType=crypto
exports.getCandles = async (req, res) => {
  try {
    const { symbol } = req.params;
    const interval = req.query.interval || '1h';
    const limit = Math.min(Number(req.query.limit) || 200, 1000);
    const assetType = req.query.assetType || 'crypto';
    const candles = await market.getCandles(symbol, interval, limit, assetType);
    res.json(candles);
  } catch (err) {
    res.status(502).json({ error: `Falha ao obter candles: ${err.message}` });
  }
};

// GET /api/market/search?q=btc&assetType=crypto
exports.search = async (req, res) => {
  try {
    const q = req.query.q || '';
    const assetType = req.query.assetType || 'crypto';
    const results = await market.search(q, assetType);
    res.json(results);
  } catch (err) {
    res.status(502).json({ error: `Falha na busca: ${err.message}` });
  }
};
