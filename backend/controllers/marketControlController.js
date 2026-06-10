// backend/controllers/marketControlController.js
// Endpoints de admin para pilotar ativos controlados.
const Asset = require('../models/Asset');
const { applyJump } = require('../services/priceEngine/engineMath');

async function getControlled(id) {
  const asset = await Asset.findById(id);
  if (!asset) return { error: 404, msg: 'Ativo não encontrado' };
  if (asset.priceMode !== 'controlled') return { error: 400, msg: 'Ativo não está em modo controlado' };
  return { asset };
}

// PUT /api/admin/market/:id  -> configura modo e parâmetros do motor
exports.configure = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Ativo não encontrado' });
    const { priceMode, referenceSymbol, followStrength, noiseVolatility, initialPrice } = req.body;

    if (priceMode) asset.priceMode = priceMode;
    asset.control = asset.control || {};
    if (referenceSymbol !== undefined) asset.control.referenceSymbol = referenceSymbol;
    if (followStrength !== undefined) asset.control.followStrength = followStrength;
    if (noiseVolatility !== undefined) asset.control.noiseVolatility = noiseVolatility;

    // Ao virar controlado sem preço, exige/usa um preço inicial.
    if (asset.priceMode === 'controlled' && !asset.control.currentPrice) {
      const p = Number(initialPrice);
      if (!p || p <= 0) return res.status(400).json({ error: 'initialPrice obrigatório (> 0) ao ativar modo controlado' });
      asset.control.currentPrice = p;
    }
    asset.markModified('control');
    await asset.save();
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/market/:id/jump  { toPrice } | { percent }
exports.jump = async (req, res) => {
  try {
    const { asset, error, msg } = await getControlled(req.params.id);
    if (error) return res.status(error).json({ error: msg });
    const { toPrice, percent } = req.body;
    asset.control.currentPrice = applyJump(asset.control.currentPrice, { toPrice: Number(toPrice), percent: Number(percent) });
    asset.markModified('control');
    await asset.save();
    res.json({ currentPrice: asset.control.currentPrice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/market/:id/target  { targetPrice, durationMinutes, easing }
exports.setTarget = async (req, res) => {
  try {
    const { asset, error, msg } = await getControlled(req.params.id);
    if (error) return res.status(error).json({ error: msg });
    const targetPrice = Number(req.body.targetPrice);
    const durationMinutes = Number(req.body.durationMinutes);
    const easing = req.body.easing === 'linear' ? 'linear' : 'easeInOut';
    if (!(targetPrice > 0)) return res.status(400).json({ error: 'targetPrice deve ser > 0' });
    if (!(durationMinutes > 0)) return res.status(400).json({ error: 'durationMinutes deve ser > 0' });
    const now = Date.now();
    asset.control.target = {
      active: true,
      targetPrice,
      startPrice: asset.control.currentPrice,
      startAt: new Date(now),
      endAt: new Date(now + durationMinutes * 60 * 1000),
      easing,
    };
    asset.markModified('control');
    await asset.save();
    res.json(asset.control.target);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/market/:id/trend  { dailyDriftPercent } | { off: true }
exports.setTrend = async (req, res) => {
  try {
    const { asset, error, msg } = await getControlled(req.params.id);
    if (error) return res.status(error).json({ error: msg });
    if (req.body.off) {
      asset.control.trend = { active: false, dailyDriftPercent: 0 };
    } else {
      asset.control.trend = { active: true, dailyDriftPercent: Number(req.body.dailyDriftPercent) || 0 };
    }
    asset.markModified('control');
    await asset.save();
    res.json(asset.control.trend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/market/:id/preset  { type: 'pump'|'dump'|'flat' }
exports.preset = async (req, res) => {
  try {
    const { asset, error, msg } = await getControlled(req.params.id);
    if (error) return res.status(error).json({ error: msg });
    const now = Date.now();
    const cur = asset.control.currentPrice;
    const type = req.body.type;
    if (type === 'pump') {
      asset.control.target = { active: true, targetPrice: cur * 1.5, startPrice: cur, startAt: new Date(now), endAt: new Date(now + 30 * 60 * 1000), easing: 'easeInOut' };
      asset.control.trend = { active: false, dailyDriftPercent: 0 };
    } else if (type === 'dump') {
      asset.control.target = { active: true, targetPrice: cur * 0.5, startPrice: cur, startAt: new Date(now), endAt: new Date(now + 15 * 60 * 1000), easing: 'easeInOut' };
      asset.control.trend = { active: false, dailyDriftPercent: 0 };
    } else if (type === 'flat') {
      asset.control.target = { active: false };
      asset.control.trend = { active: false, dailyDriftPercent: 0 };
      asset.control.noiseVolatility = 0.0005; // segura de lado
    } else {
      return res.status(400).json({ error: 'type deve ser pump | dump | flat' });
    }
    asset.markModified('control');
    await asset.save();
    res.json(asset.control);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/market/:id/state
exports.state = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).lean();
    if (!asset) return res.status(404).json({ error: 'Ativo não encontrado' });
    res.json({ symbol: asset.symbol, priceMode: asset.priceMode, control: asset.control });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/market  -> lista ativos controlados (para o painel)
exports.list = async (req, res) => {
  try {
    const assets = await Asset.find({ priceMode: 'controlled' }).lean();
    res.json(assets.map((a) => ({ _id: a._id, symbol: a.symbol, name: a.name, control: a.control })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
