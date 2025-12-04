require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const path = require('path');
// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const userRoutes = require('./routes/userRoutes');
const imovelRoutes = require('./routes/imovelRoutes');
const walletRoutes = require('./routes/walletRoutes');
const referralRoutes = require('./routes/referralRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const investmentRoutes = require('./routes/investmentRoutes');

app.use('/api/users', userRoutes);
app.use('/api/imoveis', imovelRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/investments', investmentRoutes);

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
