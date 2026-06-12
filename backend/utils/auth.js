const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = (req.headers['authorization'] || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    // req.user precisa ser ATRIBUÍDO (era `req.user.userId = ...` num req.user undefined
    // -> TypeError -> sempre "Invalid token"). Mesmo segredo/fallback do middleware/auth.
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

