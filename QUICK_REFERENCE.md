# 🚀 Acapulco Quick Reference Guide

**Versão:** 1.0  
**Última Atualização:** 15 de Janeiro de 2026

---

## ⚡ Quick Start

### Rodando o Projeto:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
# Port: 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
# Port: 3000
```

---

## 📍 Principais URLs

### Frontend:
| Página | URL | Acesso |
|--------|-----|--------|
| Home | `/` | Público |
| Login | `/login` | Público |
| Register | `/register` | Público |
| Dashboard | `/dashboard` | Protegido |
| Criptos | `/cryptos` | Protegido |
| Cripto Detalhe | `/cryptos/:id` | Protegido |
| Perfil | `/profile` | Protegido |
| Sobre | `/about` | Público |
| Contato | `/contact` | Público |
| Admin | `/admin` | Admin Only |
| Admin Cryptos | `/admin/cryptos` | Admin Only |

### Backend APIs:
```
BASE_URL: http://localhost:5000/api

Auth:
  POST /auth/login
  POST /auth/register

Users:
  GET /users/profile
  PUT /users/profile
  GET /users/referrals

Cryptos:
  GET /cryptos
  GET /cryptos/:id
  POST /cryptos (admin)
  PUT /cryptos/:id (admin)
  DELETE /cryptos/:id (admin)

Investments:
  GET /investments
  POST /investments/create
  POST /investments/withdraw

Wallet:
  POST /wallet/deposit
  POST /wallet/withdraw

Transactions:
  GET /transactions

Admin:
  GET /admin/referral-settings
  PUT /admin/referral-settings
  GET /admin/referral-profits
```

---

## 🎨 Color Palette

```javascript
primary: '#7C3AED'        // Roxo vibrante
secondary: '#6B46C1'      // Roxo escuro
success: '#10B981'        // Verde
error: '#EF4444'          // Vermelho
warning: '#F59E0B'        // Amarelo
dark: '#0a0e27'           // Azul muito escuro
text: '#F1F5F9'           // Branco
textSecondary: '#CBD5E1'  // Cinza claro
textTertiary: '#94A3B8'   // Cinza escuro
```

---

## 🔐 Authentication

### Token Storage:
```javascript
// Após login bem-sucedido
localStorage.setItem('token', jwt_token);

// Usar em requisições
const token = localStorage.getItem('token');
axios.get('/api/endpoint', {
  headers: { Authorization: `Bearer ${token}` }
});

// Logout
localStorage.removeItem('token');
```

---

## 📊 Estrutura de Dados

### User:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  isAdmin: Boolean,
  wallet: Number,
  totalInvested: Number,
  totalRealizedProfit: Number,
  totalWithdrawn: Number,
  totalReferralBonus: Number,
  referralCode: String,
  referredBy: ObjectId,
  referrals: [ObjectId],
  createdAt: Date
}
```

### Crypto:
```javascript
{
  _id: ObjectId,
  name: String,
  symbol: String,
  price: Number,
  image: String,
  plans: [
    { period: Number, yieldPercentage: Number }
  ],
  description: String
}
```

### Investment:
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  cryptoId: ObjectId,
  amount: Number,
  period: Number,
  yieldPercentage: Number,
  investmentDate: Date,
  dueDate: Date,
  status: String, // active | completed | withdrawn
  profitEarned: Number,
  realizedProfit: Number,
  isWithdrawn: Boolean
}
```

---

## 🎯 Key Features

### 1. Premium Theme:
- Roxo/Púrpura luxuoso
- Gradientes em hero sections
- Hover effects elegantes
- Responsive design (xs, sm, md, lg)

### 2. Sistema de Referências:
- Cada usuário tem código único
- Link: `/register?ref=codigo`
- Bônus automático ao investimento
- % configurável por admin

### 3. Investimentos:
- Múltiplos planos (período + rendimento %)
- Cálculo de lucro diário
- Job agendado a cada 24h
- Extrato de transações

### 4. Admin Panel:
- Gerenciar criptomoedas
- Upload de imagens
- Configurar % de referência
- Ver lucros de referências

### 5. Dashboard:
- KPIs (saldo, investido, lucro, pendente)
- Gráficos Recharts (Area, Bar, Pie)
- Tabela de investimentos
- Filtros e busca

---

## 📁 Arquivo Criado

✅ `PROJECT_ANALYSIS.md` - Análise completa do projeto (11.5 KB)
✅ `TECHNICAL_DEEP_DIVE.md` - Detalhes técnicos de implementação (9.8 KB)
✅ `QUICK_REFERENCE.md` - Este arquivo

---

## 🔧 Comandos Úteis

### Frontend:
```bash
npm start              # Rodar em dev
npm run build          # Build para produção
npm test               # Rodar testes
npm run eject          # Ejetar CRA (irreversível)
```

### Backend:
```bash
npm start              # Rodar servidor
npm run dev            # Rodar com nodemon
npm test               # Rodar testes
```

### Git:
```bash
git status             # Ver mudanças
git add .              # Adicionar tudo
git commit -m "msg"    # Fazer commit
git push               # Enviar para repo
git log                # Ver histórico
```

### MongoDB:
```bash
mongod                 # Iniciar servidor
mongo                  # Conectar ao servidor
use acapulco           # Selecionar DB
db.users.find()        # Ver usuários
db.cryptos.find()      # Ver criptos
```

---

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| CORS error | Verificar backend cors config |
| Token inválido | Fazer novo login, limpar localStorage |
| Imagem não carrega | Verificar pasta /uploads existe |
| Port em uso | `lsof -i :5000` e kill o processo |
| MongoDB erro | Iniciar `mongod` em outro terminal |
| Dependências faltando | `npm install` em ambos diretórios |

---

## 📝 Environment Variables

### Backend `.env`:
```env
MONGO_URI=mongodb://localhost:27017/acapulco
JWT_SECRET=sua_chave_secreta_super_segura
PORT=5000
NODE_ENV=development
```

### Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🎓 Conceitos-Chave

### Autenticação JWT:
1. Login → Gera token
2. Token armazenado no localStorage
3. Token enviado em Authorization header
4. Backend valida e popula req.userId

### Sistema de Referências:
1. Cada user tem referralCode único
2. Novo user registra com ?ref=codigo
3. Vinculação automática ao referrer
4. Bônus quando referido investe

### Investimentos:
1. User escolhe cripto e plano
2. Debita valor da carteira
3. Cria Investment document
4. Job agendado calcula lucro diário
5. Ao vencer, marca como completed

### Bônus Referência:
1. Referido investe X reais
2. Referrer ganha X * % de bônus
3. Bônus creditado automaticamente
4. Armazenado em totalReferralBonus

---

## 🚀 Próximas Features

- [ ] Integração Stripe/PayPal
- [ ] 2FA (Two-Factor Authentication)
- [ ] Email verificação
- [ ] Notificações push
- [ ] Socket.io real-time
- [ ] Export CSV/PDF
- [ ] Ranking de usuarios
- [ ] Liquidação automática
- [ ] Mais criptomoedas
- [ ] Mobile app (React Native)

---

## 📞 Support

**Backend Issues:**
- Verificar logs em terminal
- Verificar .env variables
- Testar com Postman/Insomnia

**Frontend Issues:**
- Verificar console do browser
- Testar com React DevTools
- Limpar cache do navegador

**Database Issues:**
- Verificar MongoDB está rodando
- Verificar MONGO_URI no .env
- Usar MongoDB Compass para visualizar

---

## 📚 Documentação

1. **PROJECT_ANALYSIS.md** - Visão geral do projeto
2. **TECHNICAL_DEEP_DIVE.md** - Detalhes técnicos
3. **QUICK_REFERENCE.md** - Este arquivo
4. Código comentado em cada arquivo

---

## ✨ Implementações Premium

✅ Tema roxo luxuoso  
✅ Gradientes em hero sections  
✅ Swiper carousel 4 colunas  
✅ Recharts gráficos  
✅ Hover effects elegantes  
✅ CryptoTicker animado  
✅ Sistema de referências  
✅ Dashboard com KPIs  
✅ Admin panel completo  
✅ Upload de imagens  

---

## 📊 Stats do Projeto

| Métrica | Valor |
|---------|-------|
| Frontend Pages | 11 |
| Backend Controllers | 8 |
| Models MongoDB | 6 |
| Routes Arquivos | 9 |
| Components Reutilizáveis | 6 |
| Serviços Frontend | 9 |
| Total Files | 150+ |
| Lines of Code | 5000+ |

---

## 🎉 Conclusão

O projeto Acapulco é uma plataforma completa de investimento em criptomoedas com:

✅ **Frontend:** React 18 + Material-UI Premium  
✅ **Backend:** Node.js + Express + MongoDB  
✅ **Autenticação:** JWT com proteção de rotas  
✅ **Referências:** Sistema completo com bônus  
✅ **Investimentos:** Com cálculo de lucro automático  
✅ **Admin:** Painel completo de gerenciamento  
✅ **Design:** Tema premium roxo luxuoso  

**Pronto para desenvolvimento e deploy!** 🚀

---

*Documentação criada em 15 de Janeiro de 2026*
*By: GitHub Copilot*
