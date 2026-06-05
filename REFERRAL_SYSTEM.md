# 🎯 Sistema de Referência - Guia Completo

## 📋 Visão Geral

O sistema de referência permite que usuários ganhem bônus quando seus amigos/conhecidos se cadastram usando seu código único e fazem seu primeiro saque.

---

## 💰 Como Funciona

### 1. **Cadastro com Código de Referência**
- Novo usuário acessa a página de registro
- Pode entrar com código de referência de forma manual OU via URL
- URL: `http://localhost:3000/register?ref=CODIGO123`

### 2. **Primeiro Depósito = Bônus para Referrer**
- Quando o usuário indicado faz seu **PRIMEIRO depósito**
- O referenciador recebe um **BÔNUS** calculado como:
  - **Bônus = Valor do Depósito × (Percentual do Admin / 100)**
- Exemplo: Depósito de R$ 1.000 com 10% = R$ 100 de bônus

### 3. **Admin Configura Percentual**
- Vai em `Painel Admin → Configurar Referência`
- Define o percentual (0-100%)
- Este valor é aplicado a TODOS os depósitos de novos usuários

---

## 🚀 Fluxo de Implementação

### Backend (Node.js)

#### 1. **User Model** ✅
```javascript
referralCode: String (único, gerado automaticamente)
referredBy: ObjectId (quem indicou este usuário)
referrals: [ObjectId] (array de usuários indicados)
```

#### 2. **Endpoints de Referência**

**POST `/auth/register-with-referral`**
- Cadastra novo usuário com código de referência
- Valida se código é válido
- Adiciona usuário à array `referrals` do referenciador

**GET `/user/referral-stats`**
- Retorna estatísticas de referência do usuário
- Inclui: código, total indicações, bônus ganhos, histórico

**GET `/admin/referral-settings`**
- Retorna configuração atual (% de bônus)

**PUT `/admin/referral-settings`**
- Atualiza configuração de percentual (admin only)

**GET `/admin/referral-profits`**
- Lista todos os referenciadores com seus ganhos
- Mostra: nome, email, código, total ganho, quantidade

#### 3. **Wallet Controller - Deposit**
```javascript
// Quando usuario faz deposito:
1. Verifica se é PRIMEIRO depósito (procura por deposit anterior)
2. Se sim E tem referredBy:
   - Calcula bônus = (valor × percentual) / 100
   - Adiciona valor à carteira do referenciador
   - Cria transação do tipo 'referral_bonus'
3. Salva transação de depósito normal
```

### Frontend (React)

#### 1. **Páginas Criadas**

**`/referrals` - ReferralNetworkPage**
- Mostra código único de referência (com copy button)
- 3 KPIs: Total Indicações, Bônus Ganhos, Primeiros Depósitos Bonificados
- Tabela de indicados (nome, email, saldo, data cadastro)
- Histórico de bônus recebidos
- Botão para compartilhar via WhatsApp

**`/admin/referral-settings` - AdminReferralSettingsPage**
- Campo para configurar percentual (0-100%)
- Preview em tempo real (R$ 1000 saque = R$ X bônus)
- 3 KPIs: Usuários com Bônus, Total Distribuído, Média
- Tabela Top 10 referenciadores

**`/admin/referral-profits` - AdminReferralProfitsPage**
- Lista completa de referenciadores
- Busca por nome/email
- Mostra: nome, email, código, total ganho, quantidade, ticket médio
- Ordenado por maior ganho

#### 2. **Atualização do Register**
- Novo campo opcional: "Código de Referência"
- Suporta URL param: `?ref=CODIGO`
- Campo é preenchido automaticamente se vem da URL

#### 3. **Navbar Atualizada**
- Novo item: "Referências" com ícone Share
- Leva a `/referrals`
- Admin tem acesso a ambas as páginas

#### 4. **Services**
```javascript
referralService.js:
- getReferralStats(token) - dados do usuário
- getAdminReferralSettings(token) - config atual
- updateAdminReferralSettings(percentage, token) - atualizar config
- getAdminReferralProfits(token) - lista referenciadores
```

---

## 📊 Exemplos de Uso

### Usuário Regular - Ganhar Bônus

1. **Copiar e Compartilhar Código**
   - Acessa `/referrals`
   - Vê seu código: `a1b2c3d4e5f6`
   - Clica "Compartilhar" → WhatsApp
   - Envia: "Use meu código: a1b2c3d4e5f6"

2. **Amigo se Cadastra**
   - Recebe link com código
   - Clica em `/register?ref=a1b2c3d4e5f6`
   - Campo pré-preenchido
   - Se não abrir via link, pode digitar manualmente

3. **Amigo Faz Primeiro Depósito**
   - Usuário indicado faz depósito de R$ 1.000
   - Admin tem 10% configurado
   - Referrer recebe: R$ 100 na carteira
   - Transação aparece como "referral_bonus"

4. **Ver Ganhos**
   - Referrer volta a `/referrals`
   - Vê KPI atualizado: "R$ 100" ganho
   - Vê histórico com descrição do depósito

### Admin - Configurar Bônus

1. **Acessar Configurações**
   - Painel Admin → Configurar Referência
   - Vê percentual atual (padrão 10%)

2. **Atualizar Percentual**
   - Muda para 5% (mais econômico)
   - Clica "Salvar"
   - Próximos saques usarão 5%

3. **Ver Top Referenciadores**
   - Painel Admin → Lucros de Referência
   - Tabela com TOP 10 que mais ganham
   - Busca por nome/email
   - Vê ticket médio de cada referenciador

---

## 🔑 Configurações Importantes

### Variáveis de Ambiente (Backend)
```
JWT_SECRET=seu_secret_aqui
MONGODB_URI=mongodb://...
```

### Endpoints Base
```
Backend: http://localhost:5000/api
Frontend: http://localhost:3000
```

### Database - Setting Document
```javascript
{
  key: "referral_percentage",
  value: "10"  // em %
}
```

---

## 🛡️ Validações Implementadas

✅ Código de referência inválido → Erro 400
✅ Usuário sem referrer → Saque normal (sem bônus)
✅ Segundo saque em diante → Sem bônus
✅ Percentual fora do range 0-100 → Erro
✅ Admin only nas rotas admin → Middleware auth

---

## 📱 Transações Rastreadas

```javascript
type: 'referral_bonus'
description: "Bônus de referência - João Fez saque de R$ 1.000,00"
amount: 100
userId: <referrer_id>
```

---

## 🧪 Teste o Sistema

### Cenário 1: Cadastro Simples
1. Registre 2 usuários sem código de referência
2. Vá a `/referrals` em ambas as contas
3. Copie código de um deles

### Cenário 2: Indicação Ativa
1. User A: copiar código
2. User B: registrar com código de A
3. User B: deposit R$ 500
4. User B: saque R$ 100
5. User A: verificar em `/referrals` → deve ter R$ 50 de bônus (se 10% do depósito)

### Cenário 3: Admin Configura
1. Login como admin
2. `/admin/referral-settings` → mudar para 5%
3. User B: novo saque de R$ 200
4. Bônus agora é R$ 10 (5% de 200)

---

## 📈 Métricas Disponíveis

### Para Usuário Regular
- Total de Indicações (count)
- Bônus Ganhos Total (sum)
- Saques Bonificados (count)
- Detalhes de cada indicado
- Histórico com datas

### Para Admin
- Total de Referenciadores com ganho
- Total em Bônus Distribuído (sum)
- Bônus Médio por Referenciador
- Top 10 (ordenado por ganho)
- Ticket médio por referenciador

---

## 🔗 Links Úteis

**User Pages:**
- Dashboard: `/dashboard`
- Referências: `/referrals`
- Perfil: `/profile`

**Admin Pages:**
- Painel: `/admin`
- Referência Settings: `/admin/referral-settings`
- Referência Profits: `/admin/referral-profits`

---

## ✨ Próximos Passos Sugeridos

1. **Email de Notificação** - Notificar quando receber bônus
2. **Ranking Visual** - Mostrar top referenciadores no Dashboard
3. **Limite de Bônus** - Opcional: bônus máximo por mês
4. **Comissão em Cadeia** - Bônus para referrer do referrer (nivel 2)
5. **Exportar Dados** - CSV com histórico de referências
