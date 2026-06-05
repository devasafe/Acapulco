require('dotenv').config();
const express = require('express');
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

// ✓ Servir uploads ANTES de tudo com headers CORS corretos
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


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const walletRoutes = require('./routes/walletRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const referralRoutes = require('./routes/referralRoutes');
const imovelRoutes = require('./routes/imovelRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cryptos', cryptoRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/imovels', imovelRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Job agendado para atualizar lucros dos investimentos a cada 24h
const updateProfitsForAllUsers = require('./utils/updateInvestmentProfits');
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
setInterval(() => {
  updateProfitsForAllUsers()
    .then(() => console.log('Lucros dos investimentos atualizados para todos os usuários.'))
    .catch(err => console.error('Erro ao atualizar lucros dos investimentos:', err));
}, ONE_DAY_MS);
