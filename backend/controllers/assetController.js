const Asset = require('../models/Asset');
const market = require('../services/marketData');

// GET /api/assets  → watchlist ativa, com cotação ao vivo anexada
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ isActive: true }).sort('symbol').lean();
    const withQuotes = await Promise.all(
      assets.map(async (a) => {
        try {
          const q = await market.getQuote(a.symbol, a.assetType);
          return { ...a, price: q.price, changePercent: q.changePercent };
        } catch (_) {
          return { ...a, price: null, changePercent: null };
        }
      })
    );
    res.json(withQuotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/assets/:symbol  → detalhe + cotação ao vivo
exports.getAsset = async (req, res) => {
  try {
    const symbol = String(req.params.symbol).toUpperCase();
    const asset = await Asset.findOne({ symbol, isActive: true }).lean();
    if (!asset) return res.status(404).json({ error: 'Ativo não encontrado na watchlist' });
    let quote = null;
    try {
      quote = await market.getQuote(asset.symbol, asset.assetType);
    } catch (_) {}
    res.json({ ...asset, quote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/assets/admin/all  (admin) → lista completa
exports.getAllAdmin = async (req, res) => {
  try {
    const assets = await Asset.find().sort('symbol');
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/assets  (admin) → adiciona ativo por SÍMBOLO (valida no provedor)
exports.addAsset = async (req, res) => {
  try {
    const symbol = String(req.body.symbol || '').toUpperCase().trim();
    const assetType = req.body.assetType || 'crypto';
    if (!symbol) return res.status(400).json({ error: 'Símbolo é obrigatório' });

    const exists = await Asset.findOne({ symbol });
    if (exists) return res.status(400).json({ error: 'Ativo já está na watchlist' });

    const valid = await market.validateSymbol(symbol, assetType);
    if (!valid) {
      return res.status(400).json({ error: `Símbolo "${symbol}" inválido ou não negociável` });
    }

    const asset = await Asset.create({
      symbol,
      name: req.body.name || symbol,
      assetType,
      logo: req.body.logo,
    });
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/assets/:id/toggle  (admin)
exports.toggleAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Ativo não encontrado' });
    asset.isActive = !asset.isActive;
    await asset.save();
    res.json(asset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/assets/:id  (admin)
exports.removeAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Ativo não encontrado' });
    res.json({ message: 'Ativo removido', symbol: asset.symbol });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
