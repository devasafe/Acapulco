// Cria (ou remove) TICKETS de teste para popular a gestão admin e o gráfico de tickets.
// Tickets variados (assunto, status, datas espalhadas nos últimos ~120 dias), alguns com
// resposta do suporte. Reversível: ids salvos em scripts/.seeded-ticket-ids.json.
//
// Uso:
//   node scripts/seedTestTickets.js           -> cria tickets para todas as contas
//   node scripts/seedTestTickets.js --clean    -> remove SÓ os tickets que este script criou

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const SupportTicket = require('../models/SupportTicket');

const DAY = 24 * 3600 * 1000;
const IDS_FILE = path.join(__dirname, '.seeded-ticket-ids.json');
const SUBJECTS = ['Suporte Técnico', 'Dúvidas sobre Investimentos', 'Compliance e Segurança', 'Outros Assuntos'];
const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];
const MESSAGES = [
  'Não consigo concluir meu saque, aparece um erro.',
  'Como funciona o rendimento dos ativos da plataforma?',
  'Minha conta apresentou um erro ao tentar operar.',
  'Gostaria de atualizar meus dados cadastrais.',
  'Tive um problema no login, não recebo o acesso.',
  'Dúvida sobre as taxas cobradas nas operações.',
];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];

async function removeSeeded() {
  if (!fs.existsSync(IDS_FILE)) return 0;
  const ids = JSON.parse(fs.readFileSync(IDS_FILE, 'utf8'));
  fs.unlinkSync(IDS_FILE);
  if (!ids.length) return 0;
  const r = await SupportTicket.deleteMany({ _id: { $in: ids } });
  return r.deletedCount;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/acapulco');
  console.log('Conectado ao banco:', mongoose.connection.name);

  const removed = await removeSeeded();
  if (removed) console.log(`Tickets de seed anteriores removidos: ${removed}`);

  if (process.argv.includes('--clean')) {
    await mongoose.connection.close();
    return;
  }

  const users = await User.find().select('_id').lean();
  if (!users.length) {
    console.log('Sem usuários, nada a fazer.');
    await mongoose.connection.close();
    return;
  }

  const now = Date.now();
  const ids = [];
  for (const u of users) {
    const n = 2 + Math.floor(Math.random() * 4); // 2..5 tickets
    for (let i = 0; i < n; i++) {
      const daysAgo = Math.floor(rand(0, 120));
      const createdAt = new Date(now - daysAgo * DAY);
      const status = pick(STATUSES);
      const responses = (status === 'resolved' || status === 'closed' || Math.random() < 0.3)
        ? [{
            message: 'Obrigado pelo contato! Já estamos verificando sua solicitação.',
            author: 'admin',
            createdAt: new Date(createdAt.getTime() + rand(1, 48) * 3600 * 1000),
          }]
        : [];
      const t = await SupportTicket.create({
        userId: u._id,
        subject: pick(SUBJECTS),
        message: pick(MESSAGES),
        status,
        responses,
        createdAt,
        updatedAt: createdAt,
      });
      ids.push(t._id.toString());
    }
  }

  fs.writeFileSync(IDS_FILE, JSON.stringify(ids));
  console.log(`${ids.length} tickets criados para ${users.length} contas.`);
  console.log(`IDs salvos em ${path.basename(IDS_FILE)} (use --clean para remover só estes).`);

  await mongoose.connection.close();
}

main().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
