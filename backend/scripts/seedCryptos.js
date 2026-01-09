const mongoose = require('mongoose');
const Crypto = require('../models/Crypto');

const cryptos = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    isActive: true,
    plans: [
      { period: 30, yieldPercentage: 15 },
      { period: 60, yieldPercentage: 22 },
      { period: 90, yieldPercentage: 30 }
    ]
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    isActive: true,
    plans: [
      { period: 30, yieldPercentage: 12 },
      { period: 60, yieldPercentage: 18 },
      { period: 90, yieldPercentage: 25 }
    ]
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    isActive: true,
    plans: [
      { period: 30, yieldPercentage: 10 },
      { period: 60, yieldPercentage: 15 },
      { period: 90, yieldPercentage: 20 }
    ]
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    isActive: true,
    plans: [
      { period: 30, yieldPercentage: 14 },
      { period: 60, yieldPercentage: 20 },
      { period: 90, yieldPercentage: 28 }
    ]
  },
  {
    name: 'Ripple',
    symbol: 'XRP',
    isActive: true,
    plans: [
      { period: 30, yieldPercentage: 8 },
      { period: 60, yieldPercentage: 12 },
      { period: 90, yieldPercentage: 18 }
    ]
  }
];

async function seedCryptos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/acapulco', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado');

    // Limpar criptos existentes (opcional)
    await Crypto.deleteMany({});
    console.log('🗑️  Criptos anteriores removidos');

    // Inserir novos dados
    const created = await Crypto.insertMany(cryptos);
    console.log(`✅ ${created.length} criptos criadas:`);
    created.forEach(c => console.log(`   - ${c.name} (${c.symbol}): ${c._id}`));

    await mongoose.connection.close();
    console.log('✅ Seed concluído!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

seedCryptos();
