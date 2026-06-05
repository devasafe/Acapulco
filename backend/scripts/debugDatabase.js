const mongoose = require('mongoose');
const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');

async function debugDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/acapulco', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado\n');

    // 1. Contar usuários
    const userCount = await User.countDocuments();
    console.log(`📊 Total de usuários: ${userCount}`);

    // 2. Contar investimentos
    const investmentCount = await Investment.countDocuments();
    const activeInvestments = await Investment.countDocuments({ status: 'active' });
    const withdrawnInvestments = await Investment.countDocuments({ status: 'withdrawn' });
    console.log(`📊 Total de investimentos: ${investmentCount}`);
    console.log(`   - Ativos: ${activeInvestments}`);
    console.log(`   - Retirados: ${withdrawnInvestments}`);

    // 3. Contar transações
    const transactionCount = await Transaction.countDocuments();
    const profitTransactions = await Transaction.countDocuments({ type: 'profit' });
    const depositTransactions = await Transaction.countDocuments({ type: 'deposit' });
    const withdrawalTransactions = await Transaction.countDocuments({ type: 'withdrawal' });
    console.log(`📊 Total de transações: ${transactionCount}`);
    console.log(`   - Profit: ${profitTransactions}`);
    console.log(`   - Depósito: ${depositTransactions}`);
    console.log(`   - Saque: ${withdrawalTransactions}`);

    console.log('\n--- Detalhes de Usuários ---');
    const users = await User.find().select('name email wallet totalInvested totalRealizedProfit');
    users.forEach((user, i) => {
      console.log(`\n${i + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Carteira: R$ ${user.wallet}`);
      console.log(`   Total Investido: R$ ${user.totalInvested || 0}`);
      console.log(`   Total Lucro Realizado: R$ ${user.totalRealizedProfit || 0}`);
    });

    console.log('\n--- Transações de Profit ---');
    const profitTrans = await Transaction.find({ type: 'profit' })
      .populate('userId', 'name email')
      .sort('-createdAt');
    
    if (profitTrans.length === 0) {
      console.log('⚠️  Nenhuma transação de profit encontrada!');
    } else {
      profitTrans.forEach((t, i) => {
        console.log(`\n${i + 1}. ${t.userId.name} - R$ ${t.amount}`);
        console.log(`   ${t.description}`);
        console.log(`   Data: ${t.createdAt}`);
      });
    }

    console.log('\n--- Investimentos Retirados ---');
    const withdrawnInv = await Investment.find({ status: 'withdrawn' })
      .populate('userId', 'name email')
      .populate('cryptoId', 'name symbol')
      .sort('-updatedAt');
    
    if (withdrawnInv.length === 0) {
      console.log('⚠️  Nenhum investimento retirado encontrado!');
    } else {
      withdrawnInv.forEach((inv, i) => {
        console.log(`\n${i + 1}. ${inv.userId.name} - ${inv.cryptoName}`);
        console.log(`   Investido: R$ ${inv.amount}`);
        console.log(`   Lucro Esperado: R$ ${inv.expectedProfit}`);
        console.log(`   Data de Retiro: ${inv.updatedAt}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Debug concluído!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

debugDatabase();
