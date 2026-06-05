# 🏗️ Acapulco Project - Complete Analysis & Architecture

**Data da Análise:** 15 de Janeiro de 2026  
**Status do Projeto:** Em Desenvolvimento - Premium Theme Applied  
**Principais Tecnologias:** React 18 + Material-UI v5 + Node.js + Express + MongoDB

---

## 📋 Table of Contents

1. [Overview do Projeto](#overview-do-projeto)
2. [Arquitetura Geral](#arquitetura-geral)
3. [Frontend - React](#frontend---react)
4. [Backend - Node.js/Express](#backend---nodejs-express)
5. [Sistema de Temas & Design](#sistema-de-temas--design)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Funcionalidades Principais](#funcionalidades-principais)
8. [Componentes & Pages](#componentes--pages)
9. [Banco de Dados](#banco-de-dados)
10. [Rotas & Endpoints](#rotas--endpoints)
11. [Sistema de Autenticação](#sistema-de-autenticação)
12. [Sistema de Referências](#sistema-de-referências)
13. [Sistema de Investimentos](#sistema-de-investimentos)

---

## Overview do Projeto

**Acapulco** é uma plataforma de investimento em criptomoedas e imóveis com sistema de referências integrado.

### Objetivos Principais:
- ✅ Permitir que usuários invistam em criptomoedas com rendimento garantido
- ✅ Sistema de referências com ganho de bônus
- ✅ Dashboard completo com KPIs e gráficos
- ✅ Painel administrativo para gerenciar criptos e configurações
- ✅ Interface premium com tema roxo/púrpura luxuoso

### Stack Tecnológico:
- **Frontend:** React 18, Material-UI v5, Recharts, Swiper, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Autenticação:** JWT (JSON Web Tokens)
- **Arquivos:** Multer (upload de imagens de criptmoedas)
- **Estilos:** Sx prop (styled-components da MUI)

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    ACAPULCO PLATFORM                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────┐      ┌──────────────────────┐ │
│  │   FRONTEND (React)      │      │  BACKEND (Node.js)   │ │
│  ├─────────────────────────┤      ├──────────────────────┤ │
│  │ • Pages (11 pages)      │      │ • Controllers (8)    │ │
│  │ • Components (6)        │◄────►│ • Models (6)         │ │
│  │ • Services (9)          │      │ • Routes (9)         │ │
│  │ • Utils (auth, theme)   │      │ • Middleware (3)     │ │
│  │ • Material-UI Theme     │      │ • Utils (helpers)    │ │
│  │ • Premium Design        │      │ • Job Schedule       │ │
│  └─────────────────────────┘      └──────────────────────┘ │
│           │                                    │             │
│           └────────────────────────────────────┘             │
│                   HTTP/REST APIs                            │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         MONGODB DATABASE                             │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • Users (auth, referrals, wallets)                  │   │
│  │ • Cryptos (produtos, investimentos)                 │   │
│  │ • Investments (transações de investimento)          │   │
│  │ • Transactions (histórico de movimentações)         │   │
│  │ • Settings (configurações admin)                    │   │
│  │ • Imovels (produtos imobiliários)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend - React

### Estrutura de Diretórios:
```
frontend/src/
├── pages/                    # 11 páginas principais
│   ├── HomePage.js          # Landing page com hero section
│   ├── LoginPage.js         # Autenticação
│   ├── RegisterPage.js      # Cadastro com referral code
│   ├── DashboardPage.js     # Dashboard com KPIs, gráficos
│   ├── ProfilePage.js       # Perfil, referências, link de referência
│   ├── CryptoListPage.js    # Lista de criptos premium com Swiper
│   ├── CryptoDetailPage.js  # Detalhes e investimento em cripto
│   ├── AdminPage.js         # Hub administrativo
│   ├── CryptoAdminPage.js   # Gerenciar criptos com upload
│   ├── AdminReferralSettingsPage.js
│   ├── AdminReferralProfitsPage.js
│   ├── ReferralNetworkPage.js
│   ├── ContactPage.js       # Página de contato com formulário
│   └── AboutPage.js         # Sobre a empresa
│
├── components/              # 6 componentes reutilizáveis
│   ├── PageLayout.js        # Navbar + Footer wrapper
│   ├── Footer.js            # Footer centralizado premium
│   ├── ProtectedRoute.js    # HOC para rotas protegidas
│   ├── CryptoTicker.js      # Ticker animado de criptos
│   ├── BalanceChart.js      # Gráfico de saldo
│   └── CryptoChart.js       # Gráfico de criptos
│
├── services/                # APIs e lógica de serviços
│   ├── apiService.js        # Chamadas axios
│   ├── authService.js       # Autenticação
│   ├── walletService.js     # Depósitos e saques
│   ├── cryptoService.js     # Operações com criptos
│   ├── investmentService.js # Investimentos
│   ├── referralService.js   # Sistema de referências
│   ├── transactionService.js
│   ├── adminService.js
│   └── socketService.js
│
├── utils/                   # Funções utilitárias
│   ├── auth.js             # getToken(), logout()
│   └── ...
│
├── App.js                   # Router principal
├── index.js                 # Entry point
├── theme.js                 # Material-UI Theme
└── api.js                   # Axios instance
```

### Sistema de Temas Premium:
```javascript
const theme = {
  primary: '#7C3AED',        // Roxo vibrante
  secondary: '#6B46C1',      // Roxo escuro
  success: '#10B981',        // Verde
  error: '#EF4444',          // Vermelho
  warning: '#F59E0B',        // Amarelo
  dark: '#0a0e27',           // Azul muito escuro (fundo)
  darkLight: 'rgba(26, 26, 77, 0.6)',    // Semi-transparente
  darker: 'rgba(45, 27, 78, 0.6)',       // Mais escuro
  text: '#F1F5F9',           // Texto branco
  textSecondary: '#CBD5E1',  // Texto cinza claro
  textTertiary: '#94A3B8',   // Texto cinza mais escuro
};
```

### Gradiente Padrão (Hero Sections):
```css
linear-gradient(135deg, #0a0e27 0%, #1a1a4d 15%, #2d1b4e 30%, 
                #3d2e5f 45%, #2a1f4d 60%, #1a1a3e 75%, #0f172a 100%)
```

---

## Pages Detalhadas

### 1. HomePage (`HomePage.js`)
- **Rota:** `/`
- **Acesso:** Público
- **Componentes:**
  - Hero section com gradient luxuoso
  - CryptoTicker (animação de tickers de criptos)
  - Stats cards (2K+ usuários, $1M+ volume, 24/7 suporte)
  - Features section (Segurança, Rapidez, Global)
  - Benefits section (2 colunas com emojis)
  - Call-to-action com botões dinâmicos
  - Video placeholder
- **Botões:**
  - "Começar Agora" → `/login` ou `/cryptos` (se autenticado)
  - "Saiba Mais" → `/about`
  - "Criar Conta Agora" → `/register` ou `/dashboard`

### 2. LoginPage (`LoginPage.js`)
- **Rota:** `/login`
- **Acesso:** Público
- **Funcionalidade:**
  - Email + Password
  - Salvamento de token JWT no localStorage
  - Redirect para Dashboard se autenticado
  - Card premium com ícones

### 3. RegisterPage (`RegisterPage.js`)
- **Rota:** `/register`
- **Acesso:** Público
- **Funcionalidade:**
  - Suporta parâmetro `?ref=referralCode`
  - Nome, Email, Senha, Confirmação
  - Vinculação automática ao referenciador
  - Validações
  - Criar usuário no MongoDB

### 4. DashboardPage (`DashboardPage.js`)
- **Rota:** `/dashboard` (protegida)
- **Acesso:** Usuários autenticados
- **KPIs:**
  - Saldo da carteira
  - Total investido
  - Lucro realizado
  - Lucro pendente
  - Total de investimentos
- **Componentes:**
  - Gráficos com Recharts (Area, Bar, Pie)
  - Tabela de investimentos ativos
  - Abas para diferentes seções
  - Ações (Depositar, Sacar, Investir)

### 5. CryptoListPage (`CryptoListPage.js`)
- **Rota:** `/cryptos` (protegida)
- **Acesso:** Usuários autenticados
- **Funcionalidade:**
  - Hero section premium
  - Swiper carousel com 4 cards por linha
  - Cada card exibe:
    - Imagem da cripto (ou ícone padrão)
    - Nome e símbolo
    - Preço mínimo
    - Planos de investimento (período + rendimento %)
    - Botão "Investir Agora"
  - Tabela alternativa com 2 colunas no mobile
  - Navegação com setas customizadas

### 6. CryptoDetailPage (`CryptoDetailPage.js`)
- **Rota:** `/cryptos/:id` (protegida)
- **Acesso:** Usuários autenticados
- **Funcionalidade:**
  - Detalhes completos da cripto
  - Seleção de plano de investimento
  - Campo para valor do investimento
  - Histórico de investimentos desta cripto

### 7. ProfilePage (`ProfilePage.js`)
- **Rota:** `/profile` (protegida)
- **Acesso:** Usuários autenticados
- **Componentes:**
  - Hero section
  - Card de informações pessoais (editável)
  - Card de link de referência (copyable)
  - Lista de referidos com bônus ganho
- **Funcionalidade:**
  - Edit mode para nome e telefone
  - Copy referral link com feedback
  - Visualização de referrals com seus bônus

### 8. ContactPage (`ContactPage.js`)
- **Rota:** `/contact`
- **Acesso:** Público
- **Componentes:**
  - Hero section
  - 4 info cards (Email, Phone, Location, Hours)
  - Formulário de contato (2 colunas)
  - "Why Contact Us" benefits
  - FAQ section (4 Q&A)

### 9. AboutPage (`AboutPage.js`)
- **Rota:** `/about`
- **Acesso:** Público
- **Componentes:**
  - Hero section
  - Mission card com emoji 🚀
  - Vision card com emoji 🎯
  - Values cards (4)
  - Stats (100K+ users, $500M+ volume, etc.)

### 10. AdminPage (`AdminPage.js`)
- **Rota:** `/admin` (protegida + admin only)
- **Hub administrativo com 3 seções:**
  1. Gerenciar Criptomoedas → `/admin/cryptos`
  2. Configurar Referência → `/admin/referral-settings`
  3. Lucros de Referência → `/admin/referral-profits`

### 11. CryptoAdminPage (`CryptoAdminPage.js`)
- **Rota:** `/admin/cryptos` (protegida + admin only)
- **Funcionalidade:**
  - CRUD de criptomoedas
  - Upload de imagem com Multer
  - Criação de planos (período + rendimento)
  - Edição e deleção

---

## Backend - Node.js/Express

### Estrutura:
```
backend/
├── index.js                 # Entry point + server setup
├── .env                     # Variáveis de ambiente
├── package.json            # Dependências
│
├── models/                 # Schemas MongoDB (6 modelos)
│   ├── User.js            # Usuários + referral system
│   ├── Crypto.js          # Criptomoedas + planos
│   ├── Investment.js      # Investimentos do usuário
│   ├── Transaction.js     # Histórico de transações
│   ├── Setting.js         # Configurações admin
│   └── Imovel.js          # Produtos imobiliários
│
├── controllers/           # Lógica de negócio (8 arquivos)
│   ├── authController.js      # Login, Register
│   ├── userController.js      # Perfil, referrals
│   ├── cryptoController.js    # CRUD de criptos
│   ├── investmentController.js # Criar investimento
│   ├── walletController.js    # Depósito, saque
│   ├── transactionController.js
│   ├── referralController.js  # Sistema de referências
│   └── adminController.js     # Operações admin
│
├── routes/                # Endpoints (9 arquivos)
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── cryptoRoutes.js
│   ├── investmentRoutes.js
│   ├── walletRoutes.js
│   ├── transactionRoutes.js
│   ├── referralRoutes.js
│   ├── adminRoutes.js
│   └── imovelRoutes.js
│
├── middleware/            # Middlewares (3 arquivos)
│   ├── auth.js           # JWT verification
│   ├── isAdmin.js        # Admin check
│   └── upload.js         # Multer configuration
│
├── utils/                # Helper functions
│   ├── auth.js          # JWT generation
│   ├── isAdmin.js       # Admin utilities
│   ├── metrics.js       # Cálculos de lucro
│   ├── socket.js        # Socket setup
│   └── updateInvestmentProfits.js  # Job agendado
│
└── scripts/              # Seed scripts
    ├── seedTransactions.js
    └── migrateReceivedReferralBonus.js
```

### Modelos do Banco de Dados:

#### User Schema:
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean,
  isActive: Boolean,
  wallet: Number (saldo em carteira),
  
  // Histórico
  totalInvested: Number,
  totalRealizedProfit: Number,
  totalWithdrawn: Number,
  totalReferralBonus: Number,
  
  // Referral System
  referralCode: String (unique),
  referredBy: ObjectId (ref User),
  referrals: [ObjectId] (ref User),
  
  createdAt: Date,
  updatedAt: Date
}
```

#### Crypto Schema:
```javascript
{
  name: String,
  symbol: String,
  price: Number (preço mínimo de investimento),
  image: String (caminho da imagem),
  plans: [
    {
      period: Number (dias),
      yieldPercentage: Number (%)
    }
  ],
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Investment Schema:
```javascript
{
  userId: ObjectId (ref User),
  cryptoId: ObjectId (ref Crypto),
  amount: Number (valor investido),
  period: Number (dias),
  yieldPercentage: Number (%),
  investmentDate: Date,
  dueDate: Date,
  status: String (active, completed, withdrawn),
  profitEarned: Number,
  realizedProfit: Number,
  isWithdrawn: Boolean,
  withdrawDate: Date
}
```

#### Transaction Schema:
```javascript
{
  userId: ObjectId (ref User),
  type: String (deposit, withdrawal, investment_return),
  amount: Number,
  description: String,
  status: String (pending, completed, failed),
  createdAt: Date
}
```

---

## Sistema de Autenticação

### Fluxo de Login:
1. Usuário entra email + senha na `/login`
2. Frontend faz POST `/api/auth/login`
3. Backend valida credenciais
4. Backend gera JWT token
5. Token armazenado em `localStorage` do frontend
6. Token incluído em todas as requisições no header `Authorization: Bearer <token>`

### Middleware de Autenticação:
```javascript
// middleware/auth.js
const token = req.headers.authorization?.split(' ')[1];
if (!token) return res.status(401).json({ error: 'Unauthorized' });
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userId = decoded.userId;
```

### Rotas Protegidas:
- Dashboard
- Cryptos
- Profile
- Investments
- Wallet operations

---

## Sistema de Referências

### Como Funciona:

1. **Cada usuário tem um código único:**
   ```javascript
   referralCode: crypto.randomBytes(8).toString('hex')
   // Exemplo: "a3f2b9c1d4e7f8g0"
   ```

2. **Link de Referência:**
   ```
   https://acapulco.com/register?ref=a3f2b9c1d4e7f8g0
   ```

3. **Ao registrar com referência:**
   - Novo usuário vinculado ao referenciador via `referredBy`
   - Referenciador adicionado ao array `referrals`

4. **Ganho de Bônus:**
   - Quando referido investe, referenciador ganha bônus
   - Bônus = investimento × percentual (configurável)
   - Percentual configurável em `/admin/referral-settings`

5. **Rastreamento:**
   - `ProfilePage` mostra lista de referidos
   - Cada referido mostra bônus ganho
   - `AdminReferralProfitsPage` mostra lucros totais

---

## Sistema de Investimentos

### Fluxo de Investimento:

1. **Usuário escolhe cripto em `/cryptos`**
2. **Seleciona plano (período + rendimento %)**
3. **Entra valor de investimento**
4. **Clica "Investir Agora"**
5. **Frontend faz POST `/api/investments/create`**
6. **Backend:**
   - Valida saldo (tem que ter dinheiro)
   - Debita valor da carteira
   - Cria documento Investment
   - Calcula data de vencimento
   - Define status como "active"

### Cálculo de Lucro:

**Job agendado a cada 24h** atualiza lucros:
```javascript
// utils/updateInvestmentProfits.js
const profitPerDay = amount * (yieldPercentage / 100) / period;
profitEarned += profitPerDay;

if (Date.now() >= dueDate) {
  status = 'completed';
  realizedProfit = profitEarned;
  totalRealizedProfit += realizedProfit;
}
```

### Status de Investimento:
- `active` - Investimento em andamento
- `completed` - Período terminou
- `withdrawn` - Usuário sacou o dinheiro

---

## Componentes Principais

### PageLayout.js
- Wraps todas as páginas protegidas
- Contém Navbar (AppBar) com links e logout
- Contém Footer
- Props: `noPadding` (para HomePage sem padding)

### Footer.js
- Centralizado e premium
- 3 seções (Produtos, Empresa, Suporte)
- Brand com gradient roxo
- Links navegáveis
- Copyright + DevaSafe credit

### ProtectedRoute.js
- HOC que valida se usuário está autenticado
- Se não estiver, redireciona para `/login`
- Se for admin, permite acesso

### CryptoTicker.js
- Ticker animado com scroll infinito
- 10 criptmoedas mock com preços
- Apenas em HomePage

---

## Endpoints da API

### Authentication (`/api/auth`)
- `POST /login` - Login
- `POST /register` - Registro com referral code opcional

### Users (`/api/users`)
- `GET /profile` - Dados do usuário
- `PUT /profile` - Atualizar perfil
- `GET /referrals` - Listar referidos

### Cryptos (`/api/cryptos`)
- `GET /` - Listar todas criptos
- `GET /:id` - Detalhes da cripto
- `POST /` (admin) - Criar cripto
- `PUT /:id` (admin) - Editar cripto
- `DELETE /:id` (admin) - Deletar cripto

### Investments (`/api/investments`)
- `GET /` - Listar investimentos do usuário
- `GET /stats` - KPIs do dashboard
- `POST /create` - Criar novo investimento
- `POST /withdraw` - Sacar investimento completo

### Wallet (`/api/wallet`)
- `POST /deposit` - Depositar fundos
- `POST /withdraw` - Sacar fundos

### Transactions (`/api/transactions`)
- `GET /` - Histórico de transações

### Admin (`/api/admin`)
- `GET /referral-settings` - Configurações
- `PUT /referral-settings` - Atualizar %
- `GET /referral-profits` - Lucros de referências

---

## Fluxo de Dados Completo

### 1. Usuário Nova Compra Cripto:
```
Frontend (CryptoListPage)
  ↓
POST /api/investments/create
  ↓
Backend (investmentController)
  - Valida saldo
  - Debita carteira
  - Cria Investment document
  - Retorna sucesso
  ↓
Frontend atualiza estado
  ↓
Usuário vê investimento no Dashboard
```

### 2. Job Agendado Atualiza Lucros:
```
A cada 24 horas
  ↓
updateInvestmentProfits() executa
  ↓
Para cada Investment ativo:
  - Calcula lucro do dia
  - Soma ao profitEarned
  - Se vencimento <= agora, marca como completed
  - Atualiza totalRealizedProfit do User
  ↓
Database atualizado
```

### 3. Usuário Clica no Link de Referência:
```
Novo usuário clica: /register?ref=a3f2b9c1d4e7f8g0
  ↓
RegisterPage recebe referralCode
  ↓
POST /api/auth/register com referralCode
  ↓
Backend:
  - Cria novo User
  - Busca referrer por referralCode
  - Vincula novo User ao referrer
  - Adiciona novo User ao array referrals do referrer
  ↓
Registro completo, ambos vinculados
```

---

## Funcionalidades Premium Implementadas

### Visual/Design:
✅ Tema roxo/púrpura luxuoso  
✅ Gradientes em hero sections  
✅ Cards com sombras e borders roxos  
✅ Hover effects elegantes com transforms  
✅ Ícones Material-UI customizados  
✅ Animações suaves (0.3s transitions)  
✅ Layout responsivo (xs, sm, md, lg)  

### Componentes:
✅ CryptoTicker com scroll infinito  
✅ Swiper carousel 4 colunas  
✅ Gráficos Recharts (Area, Bar, Pie)  
✅ Tabelas com dados dinâmicos  
✅ Modais e formulários premium  

### Funcionalidades:
✅ Autenticação com JWT  
✅ Sistema de referências com bônus  
✅ Investimentos com rendimento automático  
✅ Dashboard com KPIs e gráficos  
✅ Upload de imagens para criptos  
✅ Job agendado para atualizar lucros  
✅ Painel administrativo completo  

---

## Status de Implementação

### Concluído ✅:
- [x] Estrutura frontend com React Router
- [x] Tema Material-UI premium roxo
- [x] Todas as 11 páginas principais
- [x] Navbar e Footer
- [x] Sistema de autenticação (login/register)
- [x] Sistema de referências completo
- [x] Dashboard com gráficos e KPIs
- [x] CRUD de criptomoedas (admin)
- [x] Upload de imagens
- [x] Sistema de investimentos
- [x] Painel administrativo
- [x] Gradientes e animações premium
- [x] CryptoTicker
- [x] Swiper carousel
- [x] Tabelas de dados

### Em Progresso ⏳:
- [ ] Integração com pagamento real (Stripe)
- [ ] Verificação 2FA
- [ ] Melhorias performance
- [ ] Testes unitários

### TODO 📝:
- [ ] Deploy em produção
- [ ] Email verification
- [ ] Notificações push
- [ ] Suporte em tempo real (Socket.io)
- [ ] Histórico de transações avançado
- [ ] Exportar dados (CSV/PDF)

---

## Próximos Passos

1. **Deletar arquivos antigos na raiz** (scripts Python antigos)
2. **Integrar com gateway de pagamento** (Stripe/PayPal)
3. **Adicionar testes** (Jest/Mocha)
4. **Deploy staging** no Heroku/Vercel
5. **Configurar CI/CD** (GitHub Actions)
6. **Performance optimization** (lazy loading, code splitting)

---

## Notas Importantes

### Segurança:
- Senhas com hash bcrypt no backend
- JWT tokens com expiração
- Middleware de autenticação em rotas protegidas
- Validação de entrada em todos os endpoints

### Performance:
- Lazy loading de componentes
- Memoization onde necessário
- Paginação em tabelas
- Cache de imagens

### Escalabilidade:
- Estrutura modular (controllers, models, routes)
- Separação clara de responsabilidades
- Fácil de adicionar novos endpoints

---

## Contato & Créditos

**Desenvolvido por:** bigz  
**Tema Premium:** Aplicado em Jan/2026  
**Tecnologias:** React + Node.js + MongoDB  
**Licença:** Proprietary - Acapulco

---

*Última atualização: 15 de Janeiro de 2026*
