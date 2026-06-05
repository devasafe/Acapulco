# 🔧 Acapulco Project - Technical Deep Dive

**Data:** 15 de Janeiro de 2026  
**Versão:** 1.0 - Premium Theme Applied

---

## 📚 Índice

1. [Stack Técnico Detalhado](#stack-técnico-detalhado)
2. [Configuração Inicial](#configuração-inicial)
3. [Arquivo .env Necessário](#arquivo-env-necessário)
4. [Como Rodar o Projeto](#como-rodar-o-projeto)
5. [Estrutura de Pastas Detalhada](#estrutura-de-pastas-detalhada)
6. [Fluxo de Autenticação](#fluxo-de-autenticação)
7. [Exemplo de API Call](#exemplo-de-api-call)
8. [Material-UI Theme Setup](#material-ui-theme-setup)
9. [Tratamento de Erros](#tratamento-de-erros)
10. [Troubleshooting](#troubleshooting)

---

## Stack Técnico Detalhado

### Frontend:
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "@mui/material": "^5.x",
  "@mui/icons-material": "^5.x",
  "recharts": "^2.x",
  "swiper": "^9.x",
  "axios": "^1.x",
  "dotenv": "^16.x"
}
```

### Backend:
```json
{
  "express": "^4.18.x",
  "mongoose": "^7.x",
  "mongodb": "^5.x",
  "bcryptjs": "^2.4.x",
  "jsonwebtoken": "^9.x",
  "multer": "^1.4.x",
  "cors": "^2.8.x",
  "dotenv": "^16.x",
  "node-cron": "^3.x"
}
```

---

## Configuração Inicial

### 1. Clone e Setup:
```bash
# Clone
git clone https://github.com/devasafe/Acapulco.git
cd Acapulco

# Backend setup
cd backend
npm install
cp .env.example .env  # Copiar e preencher

# Frontend setup
cd ../frontend
npm install
```

### 2. Criar arquivo `.env` no backend:
```env
MONGO_URI=mongodb://localhost:27017/acapulco
JWT_SECRET=sua_chave_secreta_super_segura_aqui
PORT=5000
NODE_ENV=development
```

### 3. Criar arquivo `.env` no frontend:
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## Como Rodar o Projeto

### Terminal 1 - Backend:
```bash
cd backend
npm start
# Outputs: Server running on port 5000
# Outputs: MongoDB connected
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
# Abre em http://localhost:3000
```

---

## Estrutura de Pastas Detalhada

### Frontend `/src`:

```
pages/
├── HomePage.js
│   ├── Hero Section com gradient
│   ├── CryptoTicker component
│   ├── Stats cards (3 colunas)
│   ├── Features section (4 cards)
│   ├── Benefits section (2 colunas com emojis)
│   ├── Video placeholder
│   └── Call-to-action buttons
│
├── LoginPage.js
│   ├── Card container premium
│   ├── Email + Password inputs
│   ├── Remember me checkbox (opcional)
│   ├── Login button com loading
│   ├── Link para Register
│   └── Ícones nos inputs
│
├── RegisterPage.js
│   ├── Campo para referral code (?ref=...)
│   ├── Nome, Email, Senha, Confirmação
│   ├── Checkbox de termos
│   ├── Register button com loading
│   └── Link para Login
│
├── DashboardPage.js
│   ├── KPI cards (4 - Saldo, Investido, Lucro, Pendente)
│   ├── Gráficos (Area, Bar, Pie)
│   ├── Abas para diferentes seções
│   ├── Tabela de investimentos ativos
│   ├── Ações (Depositar, Sacar, Investir)
│   ├── Filtros por data
│   └── Search de investimentos
│
├── CryptoListPage.js
│   ├── Hero section
│   ├── Swiper carousel (4 colunas)
│   │  ├── Card com imagem
│   │  ├── Nome, símbolo, preço
│   │  ├── Planos listados
│   │  └── Botão investir
│   ├── Navegação prev/next
│   ├── Tabela alternativa
│   └── Loading states
│
├── CryptoDetailPage.js
│   ├── Detalhes da cripto
│   ├── Seleção de plano
│   ├── Campo de valor
│   ├── Histórico de investimentos
│   └── Botão invest
│
├── ProfilePage.js
│   ├── Hero section
│   ├── Card Minhas Informações
│   │  ├── Nome (editável)
│   │  ├── Email (read-only)
│   │  └── Telefone (editável)
│   ├── Card Link de Referência
│   │  ├── Código único
│   │  └── Botão copy
│   ├── Card Meus Referidos
│   │  ├── Grid 2 colunas
│   │  └── Bônus por referido
│   └── Edit mode toggle
│
├── AdminPage.js
│   ├── Hub com 3 cards
│   ├── Gerenciar Criptos
│   ├── Configurar Referência %
│   └── Ver Lucros de Referência
│
├── CryptoAdminPage.js
│   ├── Tabela de criptos
│   ├── Form criar cripto
│   ├── Upload de imagem
│   ├── Planos (período + rendimento)
│   ├── Edit row
│   ├── Delete com confirmação
│   └── Loading states
│
├── ContactPage.js
│   ├── Hero section
│   ├── 4 Info cards (Email, Phone, Location, Hours)
│   ├── Form de contato (2 colunas)
│   ├── Why contact us (benefits)
│   └── FAQ section (4 Q&A)
│
├── AboutPage.js
│   ├── Hero section
│   ├── Mission card
│   ├── Vision card
│   ├── Values (4 cards)
│   ├── Stats section (100K+ users, etc)
│   └── Team section
│
└── AdminReferralPages.js
    ├── AdminReferralSettingsPage.js (% configuração)
    └── AdminReferralProfitsPage.js (lucros)

components/
├── PageLayout.js (WRAPPER PRINCIPAL)
│   ├── AppBar (Navbar)
│   │  ├── Logo/Brand
│   │  ├── Nav buttons (Home, Dashboard, Cryptos, Profile)
│   │  ├── Sobre, Contato
│   │  ├── Admin button (if isAdmin)
│   │  └── Logout button
│   └── Footer (importado)
│
├── Footer.js (FOOTER PREMIUM)
│   ├── Brand section (roxo gradient)
│   ├── 3 colunas centralizadas
│   │  ├── Produtos
│   │  ├── Empresa
│   │  └── Suporte
│   ├── Copyright
│   └── DevaSafe credit
│
├── ProtectedRoute.js (HOC)
│   └── Valida token e redireciona
│
├── CryptoTicker.js (ANIMADO)
│   ├── 10 criptos mock
│   ├── Scroll infinito
│   ├── Pause on hover
│   └── Preço, change %, etc
│
├── BalanceChart.js
│   └── Gráfico de saldo (Recharts)
│
└── CryptoChart.js
    └── Gráfico de investimentos

services/
├── apiService.js (AXIOS CALLS)
│   ├── getAllCryptos()
│   ├── getProfile()
│   ├── updateProfile()
│   ├── getReferrals()
│   ├── getMyInvestments()
│   ├── getDashboardStats()
│   ├── withdrawInvestment()
│   ├── createInvestment()
│   └── ...
│
├── authService.js
│   ├── login()
│   └── register()
│
├── walletService.js
│   ├── deposit()
│   └── withdraw()
│
├── cryptoService.js
│   ├── getAllCryptos()
│   ├── getCryptoById()
│   ├── createCrypto()
│   ├── updateCrypto()
│   └── deleteCrypto()
│
├── investmentService.js
│   ├── getMyInvestments()
│   ├── createInvestment()
│   └── withdrawInvestment()
│
├── referralService.js
│   ├── getReferrals()
│   ├── getReferralSettings()
│   └── updateReferralSettings()
│
├── transactionService.js
│   ├── getTransactionHistory()
│   └── ...
│
├── adminService.js
│   └── Operações admin
│
└── socketService.js
    └── Socket.io setup (futuro)

utils/
├── auth.js
│   ├── getToken()
│   ├── logout()
│   └── isAuthenticated()
│
└── constants.js
    └── URLs, etc

App.js
├── BrowserRouter setup
├── Route definitions
├── Public routes (/, /login, /register, /contact, /about)
├── Protected routes (todas as outras)
├── 404 fallback
└── Theme provider

index.js
└── ReactDOM.render

theme.js
└── Material-UI theme setup

api.js
└── Axios instance configurado
```

### Backend `/controllers`:

```
authController.js
├── POST /login
│   ├── Busca usuário por email
│   ├── Valida password com bcrypt
│   ├── Gera JWT token
│   └── Retorna token + userData
│
└── POST /register
    ├── Valida email único
    ├── Faz hash da senha
    ├── Cria novo User
    ├── Vincula ao referrer se ?ref fornecido
    └── Retorna token

userController.js
├── GET /profile
│   ├── Busca usuário por ID
│   └── Retorna dados completos
│
├── PUT /profile
│   ├── Atualiza nome, telefone, etc
│   └── Salva no DB
│
└── GET /referrals
    ├── Popula array referrals
    ├── Retorna lista com bônus
    └── JSON com cada referido

cryptoController.js
├── GET /
│   ├── Retorna todas criptos
│   └── Array com todos os documentos
│
├── GET /:id
│   ├── Retorna uma cripto
│   └── Populate de planos
│
├── POST / (admin)
│   ├── Valida campos
│   ├── Salva em DB
│   ├── Armazena imagem em /uploads
│   └── Retorna cripto criada
│
├── PUT /:id (admin)
│   ├── Busca cripto
│   ├── Atualiza campos
│   ├── Se nova imagem, move arquivo
│   └── Salva
│
└── DELETE /:id (admin)
    ├── Busca cripto
    ├── Deleta arquivo imagem
    └── Remove do DB

investmentController.js
├── POST /create
│   ├── Valida saldo (tem dinheiro?)
│   ├── Debita carteira
│   ├── Cria Investment document
│   ├── Define dueDate = investDate + period dias
│   ├── Atualiza totalInvested do user
│   └── Retorna investment criado
│
├── GET /
│   ├── Busca investimentos do usuário
│   ├── Filtra por status
│   └── Ordena por data
│
└── POST /withdraw
    ├── Busca investment
    ├── Valida se pode sacar
    ├── Calcula lucro final
    ├── Credita valor + lucro na carteira
    ├── Marca como withdrawn
    └── Cria transaction record

referralController.js
├── GET /referral-settings
│   ├── Busca Setting documento
│   └── Retorna % de bônus configurado
│
├── PUT /referral-settings (admin)
│   ├── Atualiza % de bônus
│   └── Salva em DB
│
└── POST /add-bonus
    ├── Chamado ao investimento ser completado
    ├── Calcula bônus = investment * %
    ├── Credita no referrer
    └── Atualiza totalReferralBonus

walletController.js
├── POST /deposit
│   ├── Valida montante
│   ├── Credita na wallet
│   ├── Cria transaction de depósito
│   └── Retorna novo saldo
│
└── POST /withdraw
    ├── Valida saldo
    ├── Debita da wallet
    ├── Cria transaction de saque
    └── Retorna novo saldo

transactionController.js
├── GET /
│   ├── Busca transações do usuário
│   ├── Pagina e ordena por data DESC
│   └── Retorna array
│
└── GET /:id
    ├── Detalhes de uma transaction
    └── Retorna documento completo

adminController.js
├── GET /referral-profits
│   ├── Busca todos os usuários
│   ├── Calcula totalReferralBonus
│   ├── Ordena por maior lucro
│   └── Retorna array com rankings
│
└── GET /dashboard-stats (admin)
    ├── Total de usuários
    ├── Total investido
    ├── Total de criptos
    └── Métricas gerais
```

### Backend `/models`:

```
User.js
├── name: String
├── email: String (unique)
├── password: String (hashed)
├── isAdmin: Boolean
├── wallet: Number
├── totalInvested: Number
├── totalRealizedProfit: Number
├── totalWithdrawn: Number
├── totalReferralBonus: Number
├── referralCode: String (unique, auto-generated)
├── referredBy: ObjectId ref User
├── referrals: [ObjectId] ref User
└── timestamps

Crypto.js
├── name: String
├── symbol: String
├── price: Number
├── image: String (path)
├── plans: [{
│   period: Number,
│   yieldPercentage: Number
│ }]
└── description: String

Investment.js
├── userId: ObjectId ref User
├── cryptoId: ObjectId ref Crypto
├── amount: Number
├── period: Number
├── yieldPercentage: Number
├── investmentDate: Date
├── dueDate: Date
├── status: String (active|completed|withdrawn)
├── profitEarned: Number
├── realizedProfit: Number
├── isWithdrawn: Boolean
└── withdrawDate: Date

Transaction.js
├── userId: ObjectId ref User
├── type: String (deposit|withdrawal|investment_return)
├── amount: Number
├── description: String
├── status: String (pending|completed|failed)
└── timestamps

Setting.js
├── referralBonusPercentage: Number (padrão 10)
└── otherSettings: {}

Imovel.js
├── name: String
├── description: String
├── price: Number
├── image: String
└── status: String
```

### Backend `/middleware`:

```
auth.js
├── Extrai token do header
├── Valida JWT signature
├── Popula req.userId
├── Retorna 401 se inválido
└── Chama next()

isAdmin.js
├── Checa se req.user.isAdmin
├── Retorna 403 se não é admin
└── Chama next()

upload.js (Multer)
├── Configura upload em /uploads
├── Filtra por mimetype (image/*)
├── Limita tamanho (5MB)
├── Renomeia arquivo com timestamp
└── Retorna file path
```

### Backend `/routes`:

```
authRoutes.js
├── POST /login
├── POST /register
└── (GET /verify - opcional para validar token)

userRoutes.js
├── GET /profile (protected)
├── PUT /profile (protected)
└── GET /referrals (protected)

cryptoRoutes.js
├── GET / (public)
├── GET /:id (public)
├── POST / (admin)
├── PUT /:id (admin)
├── DELETE /:id (admin)
└── POST /:id/upload (admin - multer)

investmentRoutes.js
├── GET / (protected)
├── POST /create (protected)
└── POST /withdraw (protected)

walletRoutes.js
├── POST /deposit (protected)
└── POST /withdraw (protected)

transactionRoutes.js
├── GET / (protected)
└── GET /:id (protected)

referralRoutes.js
├── GET /settings (public)
├── PUT /settings (admin)
├── POST /add-bonus (internal)
└── GET /profits (admin)

adminRoutes.js
├── GET /dashboard-stats (admin)
└── GET /referral-profits (admin)

imovelRoutes.js
├── GET / (public)
├── GET /:id (public)
├── POST / (admin)
├── PUT /:id (admin)
└── DELETE /:id (admin)
```

### Backend `/utils`:

```
auth.js
├── generateToken(userId)
│   ├── Cria JWT com userId
│   ├── Expira em 7 dias
│   └── Retorna token string
│
└── verifyToken(token)
    ├── Valida JWT
    ├── Retorna decoded payload
    └── Throws se inválido

metrics.js
├── calculateProfit(amount, percentage, days)
│   └── Retorna lucro calculado
│
└── calculateDailyProfit(amount, %, period)

updateInvestmentProfits.js (JOB AGENDADO)
├── Executa a cada 24h
├── Para cada Investment ativo:
│   ├── Calcula lucro do dia
│   ├── Soma ao profitEarned
│   ├── Se dueDate <= agora:
│   │   ├── Marca como completed
│   │   ├── Calcula realizedProfit
│   │   ├── Atualiza User.totalRealizedProfit
│   │   └── Cria notification
│   └── Salva
└── Logs success/error

isAdmin.js (utility)
└── Validators para admin checks

socket.js (futuro)
└── Socket.io configuration
```

---

## Fluxo de Autenticação

### 1. Register Flow:
```
User preenche form na RegisterPage
  ↓
POST /api/auth/register {
  name, email, password, referralCode (opcional)
}
  ↓
Backend:
  - Valida email único (throw se existe)
  - Faz hash da senha com bcrypt
  - Cria novo User document
  - Se referralCode fornecido:
      - Busca User com esse referralCode
      - Vincula novo User ao referrer
      - Adiciona novo User ao array referrals
  - Retorna:
      {
        token: JWT,
        user: { id, name, email, isAdmin }
      }
  ↓
Frontend:
  - Armazena token em localStorage
  - Redireciona para /cryptos ou /dashboard
```

### 2. Login Flow:
```
User preenche form na LoginPage
  ↓
POST /api/auth/login {
  email, password
}
  ↓
Backend:
  - Busca User por email (throw 404 se não existe)
  - Compara password com hash (throw 401 se incorreto)
  - Gera JWT token
  - Retorna:
      {
        token: JWT,
        user: { id, name, email, isAdmin }
      }
  ↓
Frontend:
  - Armazena token em localStorage
  - Atualiza user state
  - Redireciona para /dashboard
```

### 3. Protected Route Flow:
```
User clica em link "/dashboard"
  ↓
Frontend ProtectedRoute:
  - Lê token de localStorage
  - Se não existe token:
      - Redireciona para /login
  - Se existe token:
      - Renderiza página
      - Adiciona token ao header Authorization
  ↓
Backend middleware (auth.js):
  - Extrai token do header Authorization: Bearer <token>
  - Valida JWT signature
  - Se inválido:
      - Retorna 401 Unauthorized
  - Se válido:
      - Popula req.userId
      - Chama next()
  ↓
Controller executa lógica protegida
  ↓
Frontend recebe resposta
```

---

## Exemplo de API Call

### Frontend - Criar Investimento:
```javascript
// services/investmentService.js
import axios from '../api';

export const createInvestment = async (cryptoId, amount, period, token) => {
  try {
    const response = await axios.post(
      '/api/investments/create',
      { cryptoId, amount, period },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao criar investimento';
  }
};

// pages/CryptoDetailPage.js (usando o serviço)
import { createInvestment } from '../services/investmentService';

const handleInvest = async () => {
  setLoading(true);
  try {
    const token = getToken();
    await createInvestment(cryptoId, amount, period, token);
    alert('Investimento criado com sucesso!');
    navigate('/dashboard');
  } catch (error) {
    alert(error);
  }
  setLoading(false);
};
```

### Backend - Receber e Processar:
```javascript
// controllers/investmentController.js
exports.createInvestment = async (req, res) => {
  try {
    const { cryptoId, amount, period } = req.body;
    const userId = req.userId;

    // 1. Busca usuário e valida saldo
    const user = await User.findById(userId);
    if (user.wallet < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // 2. Busca cripto e plano
    const crypto = await Crypto.findById(cryptoId);
    const plan = crypto.plans.find(p => p.period === period);
    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    // 3. Debita carteira
    user.wallet -= amount;
    user.totalInvested += amount;
    await user.save();

    // 4. Cria investment
    const investment = new Investment({
      userId,
      cryptoId,
      amount,
      period,
      yieldPercentage: plan.yieldPercentage,
      investmentDate: new Date(),
      dueDate: new Date(Date.now() + period * 24 * 60 * 60 * 1000),
      status: 'active',
      profitEarned: 0,
      realizedProfit: 0,
      isWithdrawn: false
    });

    await investment.save();

    // 5. Valida referrer e adiciona bônus
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const bonusPercentage = 10; // De Setting
        const bonus = amount * (bonusPercentage / 100);
        referrer.wallet += bonus;
        referrer.totalReferralBonus += bonus;
        await referrer.save();

        // Cria transaction de bônus
        new Transaction({
          userId: referrer._id,
          type: 'referral_bonus',
          amount: bonus,
          description: `Bônus de referência - ${user.name} investiu R$${amount}`,
          status: 'completed'
        }).save();
      }
    }

    // 6. Retorna sucesso
    res.json({
      message: 'Investimento criado com sucesso',
      investment,
      newBalance: user.wallet
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// routes/investmentRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/investmentController');

router.post('/create', auth, controller.createInvestment);

module.exports = router;

// index.js (registro da rota)
app.use('/api/investments', require('./routes/investmentRoutes'));
```

---

## Material-UI Theme Setup

### App.js:
```javascript
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7C3AED', // Roxo
    },
    secondary: {
      main: '#6B46C1', // Roxo escuro
    },
    success: {
      main: '#10B981', // Verde
    },
    error: {
      main: '#EF4444', // Vermelho
    },
    background: {
      default: '#0a0e27', // Dark blue
      paper: 'rgba(26, 26, 77, 0.6)',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Resto da app */}
    </ThemeProvider>
  );
}
```

---

## Tratamento de Erros

### Frontend:
```javascript
// Padrão em todos os components
try {
  const result = await apiCall();
  // sucesso
} catch (error) {
  const message = error.response?.data?.error || error.message;
  setError(message);
  // mostrar snackbar/alert
}
```

### Backend:
```javascript
// Padrão em todos os controllers
try {
  // lógica
} catch (error) {
  console.error(error);
  res.status(500).json({
    error: error.message || 'Erro interno do servidor'
  });
}
```

---

## Troubleshooting

### Problema: "MongoDB connection error"
**Solução:**
```bash
# Verificar se MongoDB está rodando
mongod
# Ou usar MongoDB Atlas (cloud)
# Atualizar MONGO_URI no .env
```

### Problema: "Token is not valid"
**Solução:**
```javascript
// Verificar JWT_SECRET no .env
// Verificar se token está sendo enviado corretamente
// Limpar localStorage e fazer novo login
localStorage.removeItem('token');
```

### Problema: "CORS error"
**Solução:**
```javascript
// Backend index.js já tem CORS configurado
// Se ainda tiver problema:
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Problema: "Image not uploading"
**Solução:**
```javascript
// Verificar pasta /uploads existe
// Verificar permissões de pasta
// Verificar multer middleware configurado
// Verificar Content-Type do form-data
```

### Problema: "Port 5000 already in use"
**Solução:**
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Performance Tips

1. **Frontend:**
   - Usar React.memo() em componentes que não mudam
   - Lazy load routes com React.lazy()
   - Memoizar funções com useCallback()

2. **Backend:**
   - Indexar campos frequentemente buscados
   - Paginar resultados grandes
   - Cache com Redis (futuro)

3. **Database:**
   - Criar indexes em email, referralCode
   - Usar projections (select apenas campos necessários)
   - Populate seletivo (population de dados relacionados)

---

## Deploy Checklist

- [ ] Variáveis de ambiente em .env.production
- [ ] Build frontend: `npm run build`
- [ ] Minificar CSS/JS
- [ ] Verificar logs de erro
- [ ] Testar em staging
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Deploy backend (Heroku/Railway)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configurar domínio
- [ ] SSL certificate
- [ ] Backup do banco de dados

---

*Última atualização: 15 de Janeiro de 2026*
