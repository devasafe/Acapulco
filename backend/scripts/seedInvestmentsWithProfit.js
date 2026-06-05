const mongoose = require('mongoose');
const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
const Crypto = require('../models/Crypto');

async function seedInvestmentsWithProfit() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/acapulco', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado');

    // Get a user or create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password_here',
        wallet: 50000,
        cpf: '12345678900'
      });
      await testUser.save();
      console.log('✅ Usuário de teste criado');
    } else {
      console.log('✅ Usuário de teste encontrado');
    }

    // Get a crypto
    const bitcoin = await Crypto.findOne({ symbol: 'BTC' });
    if (!bitcoin) {
      console.error('❌ Bitcoin não encontrado. Execute seedCryptos.js primeiro');
      process.exit(1);
    }

    console.log(`✅ Bitcoin encontrado: ${bitcoin._id}`);

    // Create a withdrawn investment with profit (simulating a completed investment)
    const withdrawnInvestment = new Investment({
      userId: testUser._id,
      type: 'crypto',
      cryptoId: bitcoin._id,
      cryptoName: bitcoin.name,
      amount: 1000, // R$ 1000
      investmentPlan: 30,
      yieldPercentage: 15, // 15% yield
      expectedProfit: (1000 * 15 / 100).toFixed(2), // R$ 150
      status: 'withdrawn',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
    });
    await withdrawnInvestment.save();
    console.log(`✅ Investimento retirado criado: ${withdrawnInvestment._id}`);

    // Create profit transaction for this investment
    const profitTransaction = new Transaction({
      userId: testUser._id,
      type: 'profit',
      amount: 150,
      description: `Lucro do resgate de investimento em ${bitcoin.name}`,
      relatedInvestment: withdrawnInvestment._id,
      createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) // 29 dias atrás
    });
    await profitTransaction.save();
    console.log(`✅ Transação de profit criada: ${profitTransaction._id}`);

    // Create redemption transaction for this investment
    const redemptionTransaction = new Transaction({
      userId: testUser._id,
      type: 'redemption',
      amount: 1000,
      description: `Devolução de capital - Investimento em ${bitcoin.name}`,
      relatedInvestment: withdrawnInvestment._id,
      createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) // 29 dias atrás
    });
    await redemptionTransaction.save();
    console.log(`✅ Transação de resgate criada: ${redemptionTransaction._id}`);

    // Create another withdrawn investment
    const ethereum = await Crypto.findOne({ symbol: 'ETH' });
    if (ethereum) {
      const withdrawnInvestment2 = new Investment({
        userId: testUser._id,
        type: 'crypto',
        cryptoId: ethereum._id,
        cryptoName: ethereum.name,
        amount: 2000,
        investmentPlan: 60,
        yieldPercentage: 18,
        expectedProfit: (2000 * 18 / 100).toFixed(2), // R$ 360
        status: 'withdrawn',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      });
      await withdrawnInvestment2.save();

      const profitTransaction2 = new Transaction({
        userId: testUser._id,
        type: 'profit',
        amount: 360,
        description: `Lucro do resgate de investimento em ${ethereum.name}`,
        relatedInvestment: withdrawnInvestment2._id,
        createdAt: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000)
      });
      await profitTransaction2.save();

      const redemptionTransaction2 = new Transaction({
        userId: testUser._id,
        type: 'redemption',
        amount: 2000,
        description: `Devolução de capital - Investimento em ${ethereum.name}`,
        relatedInvestment: withdrawnInvestment2._id,
        createdAt: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000)
      });
      await redemptionTransaction2.save();
      
      console.log(`✅ Segundo investimento retirado criado com profit R$ 360`);
    }

    // Update user wallet with the returns
    testUser.wallet += 150 + 1000; // First investment return
    if (ethereum) {
      testUser.wallet += 360 + 2000; // Second investment return
    }
    testUser.totalRealizedProfit = 150 + (ethereum ? 360 : 0);
    await testUser.save();

    console.log(`✅ Carteira do usuário atualizada: R$ ${testUser.wallet}`);
    console.log(`✅ Lucro realizado do usuário: R$ ${testUser.totalRealizedProfit}`);

    await mongoose.connection.close();
    console.log('✅ Seed concluído com sucesso!');
    console.log('\nResumo dos dados criados:');
    console.log(`- Usuário: ${testUser.email}`);
    console.log(`- Investimentos retirados: 2`);
    console.log(`- Total de lucro: R$ ${150 + (ethereum ? 360 : 0)}`);
    console.log(`- Total de retorno: R$ ${1000 + 150 + (ethereum ? 2000 + 360 : 0)}`);
    console.log(`- Carteira atual: R$ ${testUser.wallet}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

seedInvestmentsWithProfit();
