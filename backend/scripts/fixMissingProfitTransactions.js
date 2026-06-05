require('dotenv').config();
const mongoose = require('mongoose');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');

async function fixMissingProfitTransactions() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco';
    console.log(`🔗 Tentando conectar: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB conectado');

    // Encontrar todos os investimentos retirados
    const withdrawnInvestments = await Investment.find({ status: 'withdrawn' });
    console.log(`📊 Encontrados ${withdrawnInvestments.length} investimentos retirados`);

    let profitTransactionsCreated = 0;
    let redemptionTransactionsCreated = 0;

    for (const investment of withdrawnInvestments) {
      try {
        // Verificar se já existe profit transaction para este investimento
        const existingProfitTx = await Transaction.findOne({
          userId: investment.userId,
          type: 'profit',
          relatedInvestment: investment._id
        });

        const existingRedemptionTx = await Transaction.findOne({
          userId: investment.userId,
          type: 'redemption',
          relatedInvestment: investment._id
        });

        // Criar profit transaction se não existir
        if (!existingProfitTx && investment.expectedProfit > 0) {
          const profitTransaction = new Transaction({
            userId: investment.userId,
            type: 'profit',
            amount: investment.expectedProfit,
            description: `Lucro do resgate de investimento em ${investment.cryptoName}`,
            relatedInvestment: investment._id,
            createdAt: investment.updatedAt || new Date()
          });
          await profitTransaction.save();
          profitTransactionsCreated++;
          console.log(`✅ Profit transaction criada: ${investment.cryptoName} - R$ ${investment.expectedProfit}`);
        } else if (existingProfitTx) {
          console.log(`⏭️  Profit transaction já existe: ${investment.cryptoName}`);
        }

        // Criar redemption transaction se não existir
        if (!existingRedemptionTx) {
          const redemptionTransaction = new Transaction({
            userId: investment.userId,
            type: 'redemption',
            amount: investment.amount,
            description: `Devolução de capital - Investimento em ${investment.cryptoName}`,
            relatedInvestment: investment._id,
            createdAt: investment.updatedAt || new Date()
          });
          await redemptionTransaction.save();
          redemptionTransactionsCreated++;
          console.log(`✅ Redemption transaction criada: ${investment.cryptoName} - R$ ${investment.amount}`);
        } else if (existingRedemptionTx) {
          console.log(`⏭️  Redemption transaction já existe: ${investment.cryptoName}`);
        }
      } catch (err) {
        console.error(`❌ Erro ao processar investimento ${investment._id}:`, err.message);
      }
    }

    console.log(`\n📈 RESUMO:`);
    console.log(`   Profit transactions criadas: ${profitTransactionsCreated}`);
    console.log(`   Redemption transactions criadas: ${redemptionTransactionsCreated}`);
    console.log(`   Total de transações criadas: ${profitTransactionsCreated + redemptionTransactionsCreated}`);

    // Calcular total de profit criado
    const totalProfit = await Transaction.aggregate([
      { $match: { type: 'profit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    if (totalProfit.length > 0) {
      console.log(`\n💰 Total de Lucro no Sistema: R$ ${totalProfit[0].total}`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Fix concluído!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

fixMissingProfitTransactions();
