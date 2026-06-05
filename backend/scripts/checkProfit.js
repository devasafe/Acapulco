require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

async function manualFix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao MongoDB');

    // 1. Somar TODOS os profits
    const profitTransactions = await Transaction.find({ type: 'profit' });
    const totalProfit = profitTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    console.log(`\n💰 Total de Profit Transactions: ${profitTransactions.length}`);
    console.log(`💵 Total de Lucro: R$ ${totalProfit}`);
    
    // 2. Para cada usuário, mostrar quanto tem de profit
    console.log('\n👥 Profit por Usuário:');
    const users = await User.find();
    
    let grandTotal = 0;
    for (const user of users) {
      const userProfits = await Transaction.find({ 
        userId: user._id, 
        type: 'profit' 
      });
      const userTotal = userProfits.reduce((sum, t) => sum + t.amount, 0);
      if (userTotal > 0) {
        console.log(`   ${user.name || user.email}: R$ ${userTotal}`);
        grandTotal += userTotal;
      }
    }
    
    console.log(`\n✅ Total Geral de Lucro: R$ ${grandTotal}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

manualFix();
