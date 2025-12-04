module.exports = (req, res, next) => {
  if (!req.userId) return res.status(401).json({ error: 'Não autenticado' });
  const User = require('../models/User');
  User.findById(req.userId).then(user => {
    if (user && user.isAdmin) return next();
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores' });
  }).catch(() => res.status(403).json({ error: 'Acesso permitido apenas para administradores' }));
};
