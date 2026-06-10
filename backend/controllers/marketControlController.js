const Asset = require('../models/Asset');
const PriceIntervention = require('../models/PriceIntervention');
const PriceOverride = require('../models/PriceOverride');

exports.listAll = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ symbol: 1 }).lean();
    res.json(assets.map((a) => ({ _id: a._id, symbol: a.symbol, name: a.name, assetType: a.assetType })));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.listInterventions = async (req, res) => {
  try {
    const ivs = await PriceIntervention.find({ assetId: req.params.id }).sort({ startAt: -1 }).lean();
    res.json(ivs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// POST /:id/interventions { startAt, endAt, mode, value, rampCandles, rampTimeframeMs }
exports.schedule = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Ativo não encontrado' });
    const { startAt, endAt, mode, value, rampCandles, rampTimeframeMs } = req.body;
    const s = new Date(startAt); const e = new Date(endAt);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return res.status(400).json({ error: 'Datas inválidas' });
    if (e <= s) return res.status(400).json({ error: 'Fim deve ser depois do início' });
    if (!['absolute', 'percent'].includes(mode)) return res.status(400).json({ error: 'mode inválido' });
    const v = Number(value);
    if (!Number.isFinite(v)) return res.status(400).json({ error: 'value inválido' });
    if (mode === 'absolute' && !(v > 0)) return res.status(400).json({ error: 'preço-alvo deve ser > 0' });
    const n = Number(rampCandles); const tf = Number(rampTimeframeMs);
    if (!(n > 0) || !(tf > 0)) return res.status(400).json({ error: 'rampa inválida' });
    const rampMs = n * tf;
    if (2 * rampMs > (e.getTime() - s.getTime())) {
      return res.status(400).json({ error: 'As rampas de entrada e saída não cabem na janela. Reduza o nº de velas ou aumente a janela.' });
    }
    const iv = await PriceIntervention.create({ assetId: asset._id, startAt: s, endAt: e, mode, value: v, rampCandles: n, rampTimeframeMs: tf });
    res.status(201).json(iv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// DELETE /interventions/:interventionId -> cancela pendente/ativa e remove os overrides gerados
exports.cancel = async (req, res) => {
  try {
    const iv = await PriceIntervention.findById(req.params.interventionId);
    if (!iv) return res.status(404).json({ error: 'Intervenção não encontrada' });
    if (!['pending', 'active'].includes(iv.status)) return res.status(400).json({ error: 'Só dá para cancelar intervenções pendentes ou ativas' });
    await PriceOverride.deleteMany({ interventionId: iv._id });
    iv.status = 'cancelled';
    await iv.save();
    res.json(iv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
