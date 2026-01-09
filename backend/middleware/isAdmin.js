const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Admin apenas.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
};

