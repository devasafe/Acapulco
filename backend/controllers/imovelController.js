const Imovel = require('../models/Imovel');

exports.getAll = async (req, res) => {
  try {
    const imoveis = await Imovel.find();
    res.json(imoveis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];
    const imovelData = { ...req.body, images };
    const imovel = new Imovel(imovelData);
    await imovel.save();
    res.status(201).json(imovel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => '/uploads/' + file.filename);
      // Recupera as imagens antigas do imóvel
      const imovelAntigo = await Imovel.findById(req.params.id);
      updateData.images = [...(imovelAntigo.images || []), ...newImages];
    }
    const imovel = await Imovel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!imovel) return res.status(404).json({ error: 'Imóvel não encontrado' });
    res.json(imovel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const imovel = await Imovel.findByIdAndDelete(req.params.id);
    if (!imovel) return res.status(404).json({ error: 'Imóvel não encontrado' });
    res.json({ message: 'Imóvel removido com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
