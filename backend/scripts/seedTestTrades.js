// Cria (ou remove) TRADES de teste para popular a curva de retenção do dashboard admin.
// Gera trades com createdAt espalhados após o cadastro de cada usuário, com "lifespans"
// variados (viés para baixo) para formar uma curva de sobrevivência realista.
//
// Uso:
//   node scripts/seedTestTrades.js           -> cria trades para TODAS as contas
//   node scripts/seedTestTrades.js --clean    -> remove SÓ os trades que este script criou
//
// Reversível com precisão: os _ids criados são salvos em scripts/.seeded-trade-ids.json,
// e o --clean apaga exatamente esses (não toca em trades reais nem em saldos — só insere
// no log Trade, sem rodar netting).

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Trade = require('../models/Trade');

const DAY = 24 * 3600 * 1000;
const IDS_FILE = path.join(__dirname, '.seeded-trade-ids.json');
const SYMBOLS = [
  { symbol: 'BTCUSDT', price: 64000 },
  { symbol: 'ETHUSDT', price: 3400 },
  { symbol: 'SOLUSDT', price: 150 },
  { symbol: 'BNBUSDT', price: 580 },
];

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function removeSeeded() {
  if (!fs.existsSync(IDS_FILE)) return 0;
  const ids = JSON.parse(fs.readFileSync(IDS_FILE, 'utf8'));
  fs.unlinkSync(IDS_FILE);
  if (!ids.length) return 0;
  const r = await Trade.deleteMany({ _id: { $in: ids } });
  return r.deletedCount;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco');
  console.log('Conectado ao banco:', mongoose.connection.name);

  const removed = await removeSeeded();
  if (removed) console.log(`Trades de seed anteriores removidos: ${removed}`);

  if (process.argv.includes('--clean')) {
    await mongoose.connection.close();
    return;
  }

  const users = await User.find().select('_id createdAt').lean();
  const now = Date.now();
  const createdIds = [];

  for (const u of users) {
    const ageDays = (now - new Date(u.createdAt).getTime()) / DAY;
    // lifespan alvo: viés para baixo, limitado pela idade da conta (gera curva decrescente).
    const lifespanMax = Math.min(Math.max(ageDays - 0.5, 0), 160);
    const lifespanDays = Math.floor(lifespanMax * Math.pow(Math.random(), 1.5));
    const nTrades = 3 + Math.floor(Math.random() * 10); // 3..12 trades

    const baseMs = new Date(u.createdAt).getTime();
    // offsets em dias após o cadastro; garante 1 trade no extremo (= lifespan).
    const offsets = [lifespanDays];
    for (let k = 1; k < nTrades; k++) offsets.push(rand(0, lifespanDays || 0.2));
    offsets.sort((a, b) => a - b);

    for (const offDays of offsets) {
      const s = pick(SYMBOLS);
      const usd = Math.round(rand(10, 500));
      const price = Math.round(s.price * rand(0.9, 1.1) * 100) / 100;
      const units = Math.round((usd / price) * 1e8) / 1e8;
      const trade = new Trade({
        userId: u._id,
        symbol: s.symbol,
        assetType: 'crypto',
        side: Math.random() < 0.5 ? 'buy' : 'sell',
        usdAmount: usd,
        units,
        price,
        total: usd,
        realizedPnl: Math.round(rand(-20, 30) * 100) / 100,
        createdAt: new Date(baseMs + offDays * DAY),
      });
      await trade.save();
      createdIds.push(trade._id.toString());
    }
  }

  fs.writeFileSync(IDS_FILE, JSON.stringify(createdIds));
  console.log(`${createdIds.length} trades criados para ${users.length} contas.`);
  console.log(`IDs salvos em ${path.basename(IDS_FILE)} (use --clean para remover só estes).`);

  await mongoose.connection.close();
}

main().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
