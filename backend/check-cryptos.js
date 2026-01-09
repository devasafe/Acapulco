// Quick test script to check cryptos in database
// Usage: node check-cryptos.js (run from backend folder)

const mongoose = require('mongoose');
require('dotenv').config();

const cryptoSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number,
  image: String,
  isActive: Boolean,
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

async function checkCryptos() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('\n✓ Connected to MongoDB\n');
    
    const cryptos = await Crypto.find().limit(5);
    
    if (cryptos.length === 0) {
      console.log('❌ No cryptos found in database');
    } else {
      console.log(`Found ${cryptos.length} cryptos:\n`);
      
      cryptos.forEach((crypto, idx) => {
        console.log(`${idx + 1}. ${crypto.name} (${crypto.symbol})`);
        console.log(`   Price: R$ ${crypto.price || 'N/A'}`);
        console.log(`   Image: ${crypto.image ? '✓ ' + crypto.image : '❌ NO IMAGE'}`);
        console.log(`   Active: ${crypto.isActive ? 'Yes' : 'No'}`);
        console.log('');
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkCryptos();
