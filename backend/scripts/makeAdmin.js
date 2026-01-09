require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function makeUserAdmin(email) {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuário não encontrado');
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();
    console.log(`Usuário ${email} agora é admin!`);
    process.exit(0);
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Uso: node makeAdmin.js <email>');
  process.exit(1);
}

makeUserAdmin(email);
