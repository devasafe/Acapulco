// Cria (ou remove) contas de TESTE "antigas" (createdAt > 90 dias) para testar a
// pirâmide de membros novos vs antigos no dashboard admin.
//
// Uso:
//   node scripts/seedTestMembers.js          -> cria 10 contas antigas
//   node scripts/seedTestMembers.js --clean   -> remove todas as contas de teste
//
// As contas usam emails do padrão teste-antigo-N@acapulco.test (fáceis de identificar
// e remover). Senha de todas: teste123. São idempotentes: re-rodar recria do zero.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const TEST_EMAIL_REGEX = /^teste-antigo-\d+@acapulco\.test$/;
const COUNT = 10;
const DAY = 24 * 3600 * 1000;

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco');
  console.log('Conectado ao banco:', mongoose.connection.name);

  // Limpa contas de teste anteriores (também é o modo --clean).
  const removed = await User.deleteMany({ email: { $regex: TEST_EMAIL_REGEX } });
  console.log(`Contas de teste removidas: ${removed.deletedCount}`);

  if (process.argv.includes('--clean')) {
    await mongoose.connection.close();
    return;
  }

  const hashed = await bcrypt.hash('teste123', 10);
  const now = Date.now();

  for (let i = 1; i <= COUNT; i++) {
    // createdAt entre ~100 e ~500 dias atrás (todos > 90 dias => "antigos").
    const daysAgo = 100 + Math.floor(Math.random() * 400);
    const createdAt = new Date(now - daysAgo * DAY);
    const user = new User({
      name: `Teste Antigo ${i}`,
      email: `teste-antigo-${i}@acapulco.test`,
      password: hashed,
      createdAt,
      updatedAt: createdAt,
    });
    await user.save();
  }
  console.log(`${COUNT} contas de teste criadas (senha: teste123).`);

  const total = await User.countDocuments({});
  const cutoff90 = new Date(now - 90 * DAY);
  const novos = await User.countDocuments({ createdAt: { $gte: cutoff90 } });
  console.log(`Agora no banco: total=${total}, novos(<90d)=${novos}, antigos(>90d)=${total - novos}`);

  await mongoose.connection.close();
}

main().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
