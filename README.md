<h1 align="center">Acapulco — Simulador de Trading (Paper Trading)</h1>

<p align="center">
  Simulador educacional para praticar compra e venda de ativos com <b>gráficos e preços reais de mercado</b> e <b>dinheiro 100% fictício</b>.
  <br/>
  <i>An educational paper-trading simulator: practice trading with real market data and 100% virtual money.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/ApexCharts-FF4560" />
</p>

<p align="center">🇧🇷 Português &nbsp;|&nbsp; <a href="#-english">🇺🇸 English</a></p>

---

## 🇧🇷 Português

### Sobre
**Acapulco é um simulador de trading educacional.** Você pratica compra e venda de criptoativos
com **dados reais de mercado em tempo real** (gráficos candlestick estilo bolsa), mas usando uma
**carteira fictícia** — sem depósito, sem risco, sem dinheiro real.

> ⚠️ **Não é uma plataforma de investimento.** Todo saldo é fictício, não há lucro garantido,
> nem "sinais privilegiados", e ninguém controla o resultado: o P&L vem **exclusivamente do mercado real**.

### Funcionalidades
- 📈 **Gráficos candlestick** com dados reais de mercado (Binance) e **preços ao vivo** via WebSocket
- 💱 **Paper trading**: compra/venda a preço real, posições com preço médio e **P&L real** (realizado e não-realizado)
- 📊 **Dashboard** com patrimônio, caixa, posições valorizadas ao vivo e histórico de operações
- 🏆 **Ranking** de traders por desempenho da carteira fictícia
- 💡 **Ideias & Análises**: conteúdo educacional **transparente** publicado pelo admin (opinião, não recomendação)
- 🛠️ **Painel admin**: watchlist de ativos **por símbolo** (validados no provedor de mercado)

### Stack
**React** · **MUI** · **ApexCharts** · **Socket.io-client** · **Node.js / Express** · **MongoDB / Mongoose** · **Socket.io** · API pública da **Binance** (sem chave)

### Como rodar
```bash
# Backend (API + WebSocket em http://localhost:5000) — requer Node ≥ 18
cd backend && npm install && npm run dev      # configure MONGO_URI no .env

# Frontend (em http://localhost:3000)
cd frontend && npm install && npm start
```

### Arquitetura (resumo)
- **Dados de mercado:** `backend/services/marketData/` (cripto via Binance; ações planejadas via provedor com chave)
- **Modelos:** `Asset` (watchlist), `Position` (holding), `Trade` (execuções), `Idea`, `User`
- **Tempo real:** `utils/socket.js` + `utils/priceBroadcaster.js` emitem o evento `price`
- **Sem rendimento fabricado:** o P&L é sempre calculado a partir do preço real de mercado

---

## 🇺🇸 English

### About
**Acapulco is an educational trading simulator.** Practice buying and selling crypto assets with
**real, live market data** (candlestick charts) using a **virtual wallet** — no deposits, no risk, no real money.

> ⚠️ **Not an investment platform.** All balances are fictitious, there is no guaranteed profit,
> no "insider signals", and nobody controls the outcome: P&L comes **solely from the real market**.

### Features
- 📈 Candlestick charts with real market data (Binance) and **live prices** over WebSocket
- 💱 Paper trading: buy/sell at real prices, average-price positions and **real P&L** (realized & unrealized)
- 📊 Dashboard with equity, cash, live-valued positions and trade history
- 🏆 Traders leaderboard by virtual-portfolio performance
- 💡 Ideas & Analysis: **transparent** educational content (opinion, not advice)
- 🛠️ Admin panel: asset watchlist **by symbol** (validated against the market provider)

### Tech stack
**React** · **MUI** · **ApexCharts** · **Node.js / Express** · **MongoDB** · **Socket.io** · public **Binance** API (no key)

---

<p align="center">
  Feito por <b>Asafe Oliveira</b> · <a href="https://devasafe.vercel.app">Portfólio</a> · <a href="https://www.linkedin.com/in/devasafemota/">LinkedIn</a> · <a href="https://github.com/devasafe">GitHub</a>
</p>
