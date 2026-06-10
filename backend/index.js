require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// ✓ CORS FIRST
// Em produção, defina CORS_ORIGIN com a URL do frontend (ex.: https://acapulco.vercel.app).
// Sem essa variável, reflete a origem da requisição (libera geral — útil em demo).
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : true;
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✓ JSON parser
app.use(express.json());

// ✓ Servir uploads com headers CORS corretos
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cache-Control', 'public, max-age=3600');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const assetRoutes = require('./routes/assetRoutes');
const marketRoutes = require('./routes/marketRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const walletRoutes = require('./routes/walletRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const referralRoutes = require('./routes/referralRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const marketControlRoutes = require('./routes/marketControlRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/market', marketControlRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/referrals', referralRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// HTTP server + Socket.io (preços ao vivo)
const server = http.createServer(app);
const { init: initSocket } = require('./utils/socket');
initSocket(server);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    // Inicia o broadcaster de preços ao vivo após DB + socket prontos
    require('./utils/priceBroadcaster').start();
    // Motor de preço dos ativos controlados (gera/persiste candles 24/7)
    require('./services/priceEngine').start();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
