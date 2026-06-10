const Asset = require('../models/Asset');
const PriceIntervention = require('../models/PriceIntervention');

// GET /api/admin/market/all  -> todos os ativos (para escolher no painel)
exports.listAll = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ symbol: 1 }).lean();
    res.json(assets.map((a) => ({ _id: a._id, symbol: a.symbol, name: a.name, assetType: a.assetType })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET /api/admin/market/:id/interventions  -> intervenções de um ativo
exports.listInterventions = async (req, res) => {
  try {
    const ivs = await PriceIntervention.find({ assetId: req.params.id }).sort({ scheduledAt: 1 }).lean();
    res.json(ivs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// POST /api/admin/market/:id/interventions  { scheduledAt, mode, value }
exports.schedule = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Ativo não encontrado' });
    const { scheduledAt, mode, value } = req.body;
    const when = new Date(scheduledAt);
    if (isNaN(when.getTime())) return res.status(400).json({ error: 'Data/hora inválida' });
    if (!['absolute', 'percent'].includes(mode)) return res.status(400).json({ error: 'mode deve ser absolute | percent' });
    const v = Number(value);
    if (!Number.isFinite(v)) return res.status(400).json({ error: 'value inválido' });
    if (mode === 'absolute' && !(v > 0)) return res.status(400).json({ error: 'preço-alvo deve ser > 0' });
    const iv = await PriceIntervention.create({ assetId: asset._id, scheduledAt: when, mode, value: v });
    res.status(201).json(iv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// DELETE /api/admin/market/interventions/:interventionId  -> cancela pendente
exports.cancel = async (req, res) => {
  try {
    const iv = await PriceIntervention.findById(req.params.interventionId);
    if (!iv) return res.status(404).json({ error: 'Intervenção não encontrada' });
    if (iv.status !== 'pending') return res.status(400).json({ error: 'Só dá para cancelar intervenções pendentes' });
    iv.status = 'cancelled';
    await iv.save();
    res.json(iv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
