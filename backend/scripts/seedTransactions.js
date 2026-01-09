require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

async function seedTransactions() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');

    // Buscar um usuário admin para criar transações
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('❌ Nenhum usuário admin encontrado. Crie um admin primeiro.');
      process.exit(1);
    }

    console.log(`✅ Usando admin: ${adminUser.email}`);

    // Criar transações de teste dos últimos 30 dias
    const now = new Date();
    const transactions = [];

    for (let i = 30; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

      // Deposito aleatório
      transactions.push({
        user: adminUser._id,
        type: 'deposit',
        amount: Math.floor(Math.random() * 1000) + 100,
        createdAt: date,
        updatedAt: date,
      });

      // Aleatoriamente adicionar outros tipos de transações
      if (Math.random() > 0.7) {
        transactions.push({
          user: adminUser._id,
          type: 'yield',
          amount: Math.floor(Math.random() * 100) + 10,
          createdAt: new Date(date.getTime() + 3600000),
          updatedAt: new Date(date.getTime() + 3600000),
        });
      }

      if (Math.random() > 0.8) {
        transactions.push({
          user: adminUser._id,
          type: 'withdrawal',
          amount: Math.floor(Math.random() * 500) + 50,
          createdAt: new Date(date.getTime() + 7200000),
          updatedAt: new Date(date.getTime() + 7200000),
        });
      }
    }

    // Inserir as transações
    await Transaction.insertMany(transactions);
    console.log(`✅ ${transactions.length} transações criadas com sucesso!`);

    await mongoose.disconnect();
    console.log('✅ Desconectado do MongoDB');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

seedTransactions();
