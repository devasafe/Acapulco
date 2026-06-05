# 📊 Admin Dashboard - Comprehensive Metrics & Charts Specification

**Data:** 15 de Janeiro de 2026  
**Objetivo:** Especificação completa de gráficos e métricas para dashboard administrativo  
**Status:** Pronto para implementação

---

## 🎯 Visão Geral do Admin Dashboard

Um dashboard administrativo completo que oferece visibilidade total sobre:
- 💰 Fluxo financeiro da plataforma
- 👥 Crescimento de usuários
- 🔗 Rede de referências
- 📈 Performance de investimentos
- 🎯 KPIs críticos
- 🔍 Alertas e insights

---

## 📋 Seções Principais

### **SEÇÃO 1: KPI CARDS (Top Overview)**

#### Card 1: Total de Usuários
```
┌─────────────────────────────┐
│ 👥 Total de Usuários        │
│                             │
│ 2.450                       │
│                             │
│ ↑ +12% vs mês anterior      │
└─────────────────────────────┘
```
- **Métrica:** Contagem total de usuários
- **Variação:** % crescimento mês anterior
- **Breakdown:** Novos vs Ativos
- **Cor:** Verde (#10B981)

#### Card 2: Total Investido
```
┌─────────────────────────────┐
│ 💵 Total Investido          │
│                             │
│ R$ 1.250.340,50             │
│                             │
│ ↑ +8.5% vs mês anterior     │
└─────────────────────────────┘
```
- **Métrica:** Soma total de investimentos
- **Variação:** % crescimento
- **Breakdown:** Por cripto
- **Cor:** Roxo (#7C3AED)

#### Card 3: Total de Bônus Referência
```
┌─────────────────────────────┐
│ 🎁 Bônus Referência         │
│                             │
│ R$ 125.034,50               │
│                             │
│ ↑ +15% vs mês anterior      │
└─────────────────────────────┘
```
- **Métrica:** Soma total de bônus pagos
- **Variação:** % crescimento
- **Percentual:** % de investimento total
- **Cor:** Amarelo (#FBBF24)

#### Card 4: Wallet Total (Saldo Circulante)
```
┌─────────────────────────────┐
│ 💳 Saldo em Carteiras       │
│                             │
│ R$ 456.789,00               │
│                             │
│ ↑ +5.2% vs mês anterior     │
└─────────────────────────────┘
```
- **Métrica:** Soma de todas as carteiras
- **Variação:** % crescimento
- **Insight:** Dinheiro disponível para sacar
- **Cor:** Azul (#3B82F6)

#### Card 5: Lucro Realizado Total
```
┌─────────────────────────────┐
│ 📈 Lucro Realizado          │
│                             │
│ R$ 87.654,30                │
│                             │
│ ↑ +22% vs mês anterior      │
└─────────────────────────────┘
```
- **Métrica:** Total de lucros concretizados
- **Variação:** % crescimento
- **% do Total Investido:** 7%
- **Cor:** Verde claro (#34D399)

---

### **SEÇÃO 2: REVENUE & FINANCIAL METRICS**

#### Gráfico 1: Revenue Over Time (Últimos 30 dias)
```
Tipo: LINE CHART
Eixo X: Dias (1-30)
Eixo Y: R$ (valores acumulados)

        └─────────────────────────────────┘
         │                    ╱╲
    R$   │              ╱╲    ╱  ╲
    1M   │         ╱╲  ╱  ╲  ╱    ╲
         │    ╱╲  ╱  ╱     ╱       ╲╱
         │───╱──╲╱────────────────────
         └─────────────────────────────
           1  5  10  15  20  25  30
```
- **Dados:**
  - Total investido por dia
  - Total bônus pagos por dia
  - Total resgates por dia
- **Linha 1 (Roxo):** Revenue Bruta (investimentos)
- **Linha 2 (Amarelo):** Bônus Pagos
- **Linha 3 (Vermelho):** Resgates
- **Interatividade:** Hover mostra valores exatos
- **Exportar:** CSV, PNG

#### Gráfico 2: Revenue Breakdown (Pie/Donut Chart)
```
Tipo: DONUT CHART

             ╭─────────────╮
          ╱──│   Investimentos  │──╲
        ╱    │   65% (R$ 812k)  │    ╲
      ╱      ╰─────────────╯      ╲
     │  ╭─────────────╮           │
     │  │ Depósitos   │           │
     │  │ 20%         │           │
     │  ╰─────────────╯           │
      ╲      ╭─────────────╮      ╱
        ╲    │ Outros      │    ╱
          ╲──│ 15%         │──╱
             ╰─────────────╯
```
- **Dados:**
  - Investimentos (65%)
  - Depósitos diretos (20%)
  - Bônus referência entrada (15%)
- **Cores:** Verde, Roxo, Amarelo
- **Hover:** % e valores exatos
- **Click:** Drill down por tipo

#### Gráfico 3: Top Performing Cryptos (Bar Chart - Horizontal)
```
Tipo: HORIZONTAL BAR CHART

Bitcoin     ╞════════════════════════════╡ R$ 450k (36%)
Ethereum    ╞══════════════════════════╡  R$ 380k (30%)
BNB         ╞═════════════════╡           R$ 210k (17%)
Cardano     ╞═══════════════╡             R$ 125k (10%)
XRP         ╞══════╡                      R$ 85k (7%)
```
- **Dados:**
  - Total investido por cripto
  - % do total
  - Número de investidores por cripto
- **Cores:** Gradiente roxo
- **Hover:** Detalhes (investimentos, lucro, número de investidores)
- **Ordenação:** Por valor descendente

---

### **SEÇÃO 3: USER GROWTH & ANALYTICS**

#### Gráfico 4: User Growth Over Time (Area Chart)
```
Tipo: AREA CHART (Stacked)

        └─────────────────────────────────┘
         │                        ╱───────
    2.5K │                    ╱───
         │              ╱─────
    2K   │          ╱───  (Active Users)
         │      ╱───  (New Users)
    1.5K │  ╱───
         │ ╱
         │───────────────────────────────
           1  5  10  15  20  25  30
```
- **Dados:**
  - Usuários novos por dia
  - Usuários ativos por dia
  - Usuários totais acumulados
- **Cores Stacked:**
  - Roxo claro: Novos usuários
  - Roxo escuro: Usuários ativos
- **Métrica adicional:** Taxa de retenção
- **Exportar:** CSV

#### Gráfico 5: User Registration Funnel
```
Tipo: FUNNEL CHART

Total Visitantes
═══════════════════════════════════════
             (10.000 visitors)
                       │
                       ▼
         Iniciaram registro (5.450)
        ═══════════════════════════
                       │
                       ▼
         Completaram registro (2.450)
        ═══════════════════════════
                       │
                       ▼
         Primeiro investimento (847)
        ═════════════════════════
                       │
                       ▼
         Segundos investimento (234)
        ════════════════════════
```
- **Métrica:** Conversão em cada etapa
- **% Drop-off:** Entre etapas
- **Tempo médio:** Para cada conversão
- **Tooltip:** Números absolutos e %

#### Gráfico 6: User Segmentation (Donut/Pie)
```
Tipo: DONUT CHART

          ╭─────────────╮
       ╱──│ Ativos     │──╲
     ╱    │ 68%        │    ╲
   ╱      │ (1.666)    │      ╲
  │  ╭─────────────╮          │
  │  │ Inativos   │          │
  │  │ 18%        │          │
  │  │ (441)      │          │
  │  ╰─────────────╯          │
   ╲      ╭─────────────╮    ╱
     ╲    │ Novos      │  ╱
       ╲──│ 14%        │──╱
          │ (343)      │
          ╰─────────────╯
```
- **Segmentos:**
  - Usuários ativos (investimento última semana)
  - Usuários inativos (sem atividade > 30 dias)
  - Usuários novos (registrados < 7 dias)
- **Cores:** Verde, Cinza, Roxo claro
- **Hover:** Ações por segmento

---

### **SEÇÃO 4: REFERRAL NETWORK ANALYTICS**

#### Gráfico 7: Referral Network Tree (Force Graph)
```
Tipo: NETWORK/FORCE GRAPH

                    ┌─────────┐
                    │ Admin   │ (root)
                    └────┬────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       ┌──┴───┐      ┌──┴───┐      ┌──┴───┐
       │Top 1 │      │Top 2 │      │Top 3 │
       │Juan  │      │Maria │      │Pedro │
       │18    │      │12    │      │15    │
       └──┬───┘      └──┬───┘      └──┬───┘
          │             │             │
       ┌──┴─┐        ┌──┴─┐        ┌──┴─┐
       │ 3  │        │ 5  │        │ 2  │
       │ ref│        │ref │        │ref │
       └────┘        └────┘        └────┘
```
- **Nós:** Usuários (tamanho = total investido)
- **Cores:** Verde (ganha dinheiro) → Roxo (neutro)
- **Links:** Conexões de referência
- **Hover:** Nome, ganho total, número de referidos
- **Filtros:**
  - Por top ganhadores
  - Por profundidade
  - Por região (futuro)

#### Gráfico 8: Top 10 Referrers (Leaderboard Bar Chart)
```
Tipo: HORIZONTAL BAR CHART

Rank │ Nome           │ Referidos │ Ganho
─────┼────────────────┼───────────┼──────────
 1   │ 👑 João Silva  │   18      │ R$ 8.540
 2   │ Maria Santos   │   12      │ R$ 6.230
 3   │ Pedro Costa    │   15      │ R$ 7.890
 4   │ Ana Silva      │    9      │ R$ 4.560
 5   │ Lucas Oliveira │   11      │ R$ 5.680
 6   │ Carla Mendes   │    7      │ R$ 3.450
 7   │ Felipe Gomes   │    6      │ R$ 2.890
 8   │ Beatriz Lima   │    5      │ R$ 2.340
 9   │ Rafael Santos  │    4      │ R$ 1.890
10   │ Juliana Costa  │    3      │ R$ 1.450
```
- **Ordenação:** Por ganho total
- **Cores:** Gradiente roxo
- **Ícone:** 👑 para top 1
- **Tooltips:** Valor por referido, taxa conversão
- **Drill-down:** Ver referidos deste usuário

#### Gráfico 9: Referral Commission Flow (Sankey Diagram)
```
Tipo: SANKEY CHART

Investimentos
(R$ 1.250k)
    │
    ├──────────────────────────────┐
    │                              │
   ▼                               ▼
Carteira Usuários          Bônus Referência
(R$ 1.125k)                (R$ 125k)
    │                          │
    │                          ▼
    │                    Top Referrers
    │                    (R$ 87.5k)
    │
    ▼
Lucro Realizado
(R$ 87.6k)
```
- **Fluxo de dinheiro:** De investimentos para distribuição
- **Espessura das linhas:** Proporcional ao valor
- **Percentuais:** Em cada divisão
- **Hover:** Valores exatos em R$

---

### **SEÇÃO 5: INVESTMENT PERFORMANCE**

#### Gráfico 10: Investment Distribution by Period (Bar Chart)
```
Tipo: BAR CHART (Grouped)

        │
        │  ┌─────┐
    200 │  │     │  ┌─────┐
        │  │     │  │     │
    150 │  │     │  │     │  ┌─────┐
        │  │  ┌──┤  │  ┌──┤  │     │
    100 │  │  │  │  │  │  │  │  ┌──┤
        │  │  │  │  │  │  │  │  │  │
     50 │  │  │  │  │  │  │  │  │  │
        │  │  │  │  │  │  │  │  │  │
      0 ├──┴──┴──┴──┴──┴──┴──┴──┴──┴──
         7d  15d 30d 60d 90d 180d

    ■ Bitcoin  ■ Ethereum  ■ BNB  ■ Outros
```
- **Dados:**
  - Número de investimentos por período
  - Valor médio por período
  - Cripto mais investida por período
- **Cores:** Diferentes para cada cripto
- **Hover:** Detalhes (qtd, valor médio, % do total)

#### Gráfico 11: Investment Returns Rate (Gauge/Progress Chart)
```
Tipo: GAUGE CHART (Circular)

              ╱─────────╲
           ╱               ╲
          │   Retorno      │
          │   Médio        │
          │                │
          │   8.5%         │
          │                │
           ╲               ╱
            ╲─────────────╱
             ╭─────────╮
          0% │ ▓▓▓▓▓░░░│ 15%
             ╰─────────╯
        Target: 10%  ✓ Acima
```
- **Métrica:** Taxa média de retorno
- **Comparação:** vs Target (10%)
- **Cores:** Verde se acima, Amarelo se abaixo
- **Faixa:** 0-15%

#### Gráfico 12: Profit Distribution (Histogram)
```
Tipo: HISTOGRAM / Distribution Chart

    Freq │
         │           ┌───┐
      50 │       ┌───┤   ├───┐
         │   ┌───┤   │   │   ├───┐
      40 │   │   │   │   │   │   │
         │   │   │   │   │   │   │
      30 │───┤   │   │   │   │   ├───
         │   │   │   │   │   │   │   │
      20 │───┤   │   │   │   │   │   ├───
         └───┴───┴───┴───┴───┴───┴───┴───
            1%  3%  5%  7%  9%  11%
            
           Taxa de Retorno (%)
```
- **Distribuição:** De taxa de retorno
- **Moda:** Valor mais comum
- **Média vs Mediana:** Linhas verticais
- **Tooltip:** Número de investimentos em cada faixa

---

### **SEÇÃO 6: TRANSACTION & ACTIVITY METRICS**

#### Gráfico 13: Transaction Types Over Time (Stacked Area)
```
Tipo: STACKED AREA CHART

        │                        ╱────────
    500 │                    ╱───  Resgates
        │              ╱─────
    400 │          ╱───  Investimentos
        │      ╱───  Depósitos
    300 │  ╱───
        │ ╱
        │──────────────────────────
          1  5  10  15  20  25  30
```
- **Dados:**
  - Transações de depósito por dia
  - Investimentos por dia
  - Resgates por dia
- **Cores Stacked:**
  - Azul: Depósitos
  - Roxo: Investimentos
  - Vermelho: Resgates
- **Hover:** Número de transações e valor

#### Gráfico 14: Daily Active Users (Line Chart with Goal)
```
Tipo: LINE CHART

DAU │
    │                    ╱╲
200 │                ╱╲  ╱  ╲
    │            ╱╲  ╱  ╲      ╲
180 │       ╱╲  ╱  ╱     ╲      ╲╱───
    │   ╱╲  ╱  ╱            (Goal: 150)
160 │  ╱──────────────────────
    │ ╱
140 ├─────────────────────────
    │
    └──────────────────────────
      1  5  10  15  20  25  30
```
- **Métrica:** Daily Active Users
- **Meta:** Linha horizontal (150 DAU)
- **Status:** Acima/Abaixo da meta
- **% de Desvio:** Mostrar variação

---

### **SEÇÃO 7: SYSTEM HEALTH & ALERTS**

#### Gráfico 15: System Status Indicators (Cards)
```
┌──────────────────────────────────────┐
│ ✅ Database: Saudável               │
│ Latência: 45ms | Conexões: 234/500  │
├──────────────────────────────────────┤
│ ✅ API Response: Ótimo              │
│ Tempo médio: 120ms | 99.95% uptime  │
├──────────────────────────────────────┤
│ ⚠️  Email Service: Aviso            │
│ Falhas: 12 | Taxa de erro: 0.5%     │
├──────────────────────────────────────┤
│ ✅ File Storage: Normal             │
│ Uso: 2.4 GB / 5 GB | 48%            │
└──────────────────────────────────────┘
```
- **Status:** ✅ OK | ⚠️  Aviso | ❌ Crítico
- **Cores:** Verde, Amarelo, Vermelho
- **Detalhes:** Métricas específicas
- **Auto-refresh:** A cada 30 segundos

#### Gráfico 16: Alerts & Anomalies Timeline
```
Tipo: TIMELINE / ACTIVITY FEED

[14:35] ⚠️  Taxa de resgates 2x acima do normal
        Valor: R$ 45.320 vs média: R$ 22k
        
[12:10] 🚨 5 tentativas de login falhadas - User ID: 1234
        IP: 192.168.x.x
        
[11:45] ✅ Job de atualização de lucros completado
        Investimentos atualizados: 347
        
[09:20] ⚠️  Novo usuário registrou com 8 referências
        Suspeita de bot/spam
        
[08:00] ✅ Backup diário concluído
        Tamanho: 245 MB
```
- **Timestamp:** Quando ocorreu
- **Ícone:** Tipo de alerta
- **Descrição:** Detalhes do evento
- **Ação:** Link para investigar
- **Filtros:** Por tipo, severidade, data

---

### **SEÇÃO 8: COMPARATIVE & TREND ANALYSIS**

#### Gráfico 17: Period Comparison (Multi-Period Bar)
```
Tipo: BAR CHART (Grouped by Period)

        │
    1.2M │  ┌─────┐
        │  │ Jan │  ┌─────┐
    1.0M │  │     │  │ Fev │  ┌─────┐
        │  │     │  │     │  │ Mar │
    0.8M │  │     │  │     │  │     │
        │  │     │  │     │  │     │
    0.6M │  │     │  │     │  │     │
        └──┴─────┴──┴─────┴──┴─────┴──
        
    ■ Investimentos  ■ Bônus  ■ Resgates
```
- **Períodos:** Mês anterior, mês atual, mês seguinte (previsão)
- **Comparação:** Lado a lado
- **% Variação:** Mostrada em labels
- **Trend:** Seta ↑ ou ↓

#### Gráfico 18: Forecast/Projection (Line with Confidence Interval)
```
Tipo: LINE CHART (com banda de confiança)

        │                      ╱╱╱╱╱╱
    1.5M │                  ╱╱╱╱╱╱
        │              ╱╱╱╱╱
        │          ╱╱╱╱╱  (Forecast)
    1.0M │      ╱╱╱╱
        │  ╱╱╱╱    (Histórico)
    0.5M │ ╱     ┊
        │       ┊ ╭─────────────╮
        │       ┊ │ Confiança:  │
        │       ┊ │ 95%         │
        └───────┴─╰─────────────╯
          Hoje  ↑ (Transição)
```
- **Dados históricos:** Linha sólida
- **Previsão:** Linha pontilhada
- **Banda de confiança:** Zona sombreada
- **Parâmetros:** Modelo (MA, ARIMA, etc)

---

### **SEÇÃO 9: DETAILED TABLES & EXPORTS**

#### Tabela 1: User Directory (Sortable, Filterable, Paginable)
```
┌─────┬──────────────┬─────────────┬─────────────┬──────────┬────────┐
│ ID  │ Nome         │ Email       │ Total Inv.  │ Referida│ Status │
├─────┼──────────────┼─────────────┼─────────────┼──────────┼────────┤
│ 1   │ João Silva   │ joao@...    │ R$ 45.670   │ Não     │ Ativo  │
│ 2   │ Maria Santos │ maria@...   │ R$ 23.450   │ Sim     │ Ativo  │
│ 3   │ Pedro Costa  │ pedro@...   │ R$ 12.890   │ Sim     │ Inativo│
│ 4   │ Ana Silva    │ ana@...     │ R$ 8.900    │ Sim     │ Ativo  │
│ ... │ ...          │ ...         │ ...         │ ...     │ ...    │
└─────┴──────────────┴─────────────┴─────────────┴──────────┴────────┘
```
- **Colunas:**
  - ID | Nome | Email | Total Investido | Referida por (Nome) | Status
  - Bônus Ganho | Data Registro | Último Login
- **Sorting:** Click em qualquer coluna
- **Filtros:** Por status, data, valor mínimo
- **Paginação:** 10/25/50/100 por página
- **Ações:** Ver detalhes, editar, resetar password
- **Exportar:** CSV, Excel

#### Tabela 2: Investment Transactions (Detalhado)
```
┌─────┬──────────────┬──────────┬─────────┬──────────┬─────────┬────────┐
│ ID  │ Usuário      │ Cripto   │ Valor   │ Período  │ Retorno │ Status │
├─────┼──────────────┼──────────┼─────────┼──────────┼─────────┼────────┤
│ 1   │ João Silva   │ Bitcoin  │ 5.000   │ 30d      │ 425     │ Ativo  │
│ 2   │ Maria Santos │ Ethereum │ 2.500   │ 15d      │ 225     │ Complet│
│ 3   │ Pedro Costa  │ BNB      │ 1.500   │ 7d       │ 80      │ Complet│
└─────┴──────────────┴──────────┴─────────┴──────────┴─────────┴────────┘
```
- **Colunas:**
  - ID | Usuário | Cripto | Valor Investido | Período | Taxa %
  - Lucro Estimado | Lucro Realizado | Data Início | Data Vencimento | Status
- **Status:** Ativo | Completo | Sacado | Cancelado
- **Filtros:** Por usuário, cripto, data, status
- **Ordenação:** Por qualquer coluna
- **Exportar:** CSV, Excel, PDF

#### Tabela 3: Referral Commission Breakdown
```
┌─────┬──────────────┬───────────┬──────────┬──────────┬────────────┐
│Rank │ Referenciador│ Referidos │ Inv. Total│ Comissão │ Ganho(%)   │
├─────┼──────────────┼───────────┼──────────┼──────────┼────────────┤
│ 1   │ João Silva   │ 18        │ 145.000  │ 14.500   │ 10%        │
│ 2   │ Maria Santos │ 12        │ 98.500   │ 9.850    │ 10%        │
│ 3   │ Pedro Costa  │ 15        │ 120.000  │ 12.000   │ 10%        │
└─────┴──────────────┴───────────┴──────────┴──────────┴────────────┘
```
- **Drill-down:** Clicar na linha mostra referidos
- **Comissão:** Automática calculada
- **% Ganho:** % do total investido pelos referidos
- **Ações:** Ver rede completa, suspender pagamentos

---

### **SEÇÃO 10: ADMIN CONTROLS & ACTIONS**

#### Panel: Quick Actions
```
┌─────────────────────────────────────────────────┐
│ ⚙️  AÇÕES RÁPIDAS                               │
├─────────────────────────────────────────────────┤
│ [ Criar Nova Cripto ]                           │
│ [ Configurar % Referência ] (atual: 10%)        │
│ [ Suspender/Reativar Usuário ]                  │
│ [ Ajustar Rendimentos Manualmente ]             │
│ [ Exportar Relatório Mensal ]                   │
│ [ Enviar Notificação em Massa ]                 │
│ [ Processar Resgates Pendentes ]                │
│ [ Gerar Backups ]                              │
│ [ Limpar Cache ]                               │
│ [ Ver Logs de Sistema ]                        │
└─────────────────────────────────────────────────┘
```
- **Acesso:** Admin only
- **Confirmação:** Modals de segurança
- **Logs:** Cada ação registrada
- **Auditoria:** Quem fez o quê e quando

#### Panel: Configuration
```
┌─────────────────────────────────────────────────┐
│ ⚙️  CONFIGURAÇÕES GLOBAIS                       │
├─────────────────────────────────────────────────┤
│ Referral Commission %:      [ 10 ]%            │
│ Min Investment Value:       [ 100 ] R$         │
│ Max Investment Value:       [ 100000 ] R$      │
│ Investment Period Options:  [ 7, 15, 30, 60 ]  │
│ Default Platform Fee %:     [ 5 ]%             │
│ Email Notifications:        [ ON/OFF ]         │
│ Maintenance Mode:           [ OFF ]            │
│ 2FA Required for Admin:     [ ON ]             │
│ [ SAVE CHANGES ]                               │
└─────────────────────────────────────────────────┘
```
- **Validação:** Valores mín/máx
- **Save:** Com confirmação
- **Undo:** Reverter última mudança
- **Histórico:** Rastrear mudanças

---

## 📊 Resumo dos Gráficos

| # | Gráfico | Tipo | Dados Principais | Atualização |
|---|---------|------|------------------|------------|
| 1 | Total Usuários | Card KPI | Contagem, variação | Real-time |
| 2 | Total Investido | Card KPI | Soma, variação | Real-time |
| 3 | Bônus Referência | Card KPI | Soma, variação | Real-time |
| 4 | Wallet Total | Card KPI | Soma, variação | Real-time |
| 5 | Lucro Realizado | Card KPI | Soma, variação | Real-time |
| 6 | Revenue Over Time | Line | 30 dias | 1h |
| 7 | Revenue Breakdown | Donut | 3 categorias | 1h |
| 8 | Top Cryptos | Bar | 5 criptos | 1h |
| 9 | User Growth | Area | 30 dias | 1h |
| 10 | Registration Funnel | Funnel | 5 etapas | 1h |
| 11 | User Segmentation | Donut | 3 segmentos | 1h |
| 12 | Referral Network | Force | Árvore inteira | 2h |
| 13 | Top Referrers | Bar | Top 10 | 1h |
| 14 | Commission Flow | Sankey | 3 streams | 1h |
| 15 | Investment Distribution | Bar | Por período | 1h |
| 16 | Returns Rate | Gauge | Taxa média | Real-time |
| 17 | Profit Distribution | Histogram | Distribuição % | 1h |
| 18 | Transactions Over Time | Stacked Area | 3 tipos | 1h |
| 19 | Daily Active Users | Line | DAU + meta | Real-time |
| 20 | System Health | Cards | 4 métricas | 30s |
| 21 | Alerts Timeline | Timeline | Eventos | Real-time |
| 22 | Period Comparison | Bar | 3 períodos | 1h |
| 23 | Forecast | Line | Projeção | 1h |

---

## 🔄 Frequência de Atualização Recomendada

```
Real-time (< 5s):
- KPI Cards (usuários, investido, bônus)
- System Health Status
- Live Alerts

1 hora:
- Gráficos de tendência
- Tabelas de dados
- Top performers

2 horas:
- Rede de referências (força bruta pesada)

Daily:
- Forecasts/Projeções
- Relatórios consolidados
```

---

## 💾 Dados Necessários do Backend

Para implementar este dashboard, o backend precisa fornecer:

### New Endpoints Needed:

```
GET /api/admin/dashboard/summary
  Retorna: KPIs (usuários, investido, bônus, wallet, lucro)

GET /api/admin/dashboard/revenue-timeline
  Params: period=30days
  Retorna: Revenue por dia (investimentos, bônus, resgates)

GET /api/admin/dashboard/crypto-performance
  Retorna: Top 5 cryptos com valores investidos

GET /api/admin/dashboard/user-growth
  Params: period=30days
  Retorna: Novos usuários e ativos por dia

GET /api/admin/dashboard/referral-leaders
  Retorna: Top 10 referenciadores com ganhos

GET /api/admin/dashboard/referral-network
  Retorna: Estrutura completa (para Force Graph)

GET /api/admin/dashboard/transactions-timeline
  Params: period=30days
  Retorna: Transações por dia (depósito, inv, resgate)

GET /api/admin/dashboard/daily-active-users
  Params: period=30days
  Retorna: DAU por dia

GET /api/admin/dashboard/system-health
  Retorna: Status de DB, API, Email, Storage

GET /api/admin/dashboard/recent-alerts
  Retorna: Últimos eventos/alertas

GET /api/admin/users?page=1&limit=25&sort=total_invested
  Retorna: Tabela paginada de usuários

GET /api/admin/investments?page=1&limit=25
  Retorna: Tabela paginada de investimentos

GET /api/admin/referral-commissions
  Retorna: Tabela de comissões detalhada
```

---

## 🎨 Design System para Dashboard

```javascript
// Cores
const COLORS = {
  primary: '#7C3AED',        // Roxo
  success: '#10B981',        // Verde
  warning: '#F59E0B',        // Amarelo
  danger: '#EF4444',         // Vermelho
  info: '#3B82F6',           // Azul
  dark: '#0a0e27',           // Fundo
  text: '#F1F5F9',           // Texto
};

// Tamanho dos gráficos (típicos)
const CHART_HEIGHT = {
  large: 400,     // KPIs + gráficos principais
  medium: 300,    // Gráficos secundários
  small: 150,     // Widgets compactos
};

// Layout
const LAYOUT = {
  padding: '1.5rem',
  gap: '1.5rem',
  borderRadius: '12px',
  border: '1px solid rgba(124, 58, 237, 0.2)',
};
```

---

## 📱 Responsividade

```
Desktop (lg): 4 colunas
Tablet (md): 2 colunas
Mobile (sm): 1 coluna

KPIs: Sempre 2-3 por linha mesmo no mobile
Gráficos grandes: 1 por linha, altura reduzida no mobile
Tabelas: Scroll horizontal no mobile
```

---

## 🚀 Implementação Priority

### Phase 1 (MVP):
- [x] KPI Cards (5)
- [x] Revenue Over Time (Line)
- [x] Top Cryptos (Bar)
- [x] User Growth (Area)
- [x] User Directory Table
- [x] System Health

### Phase 2:
- [ ] Referral Network Graph
- [ ] Top Referrers
- [ ] Investment Distribution
- [ ] Transactions Timeline
- [ ] Daily Active Users
- [ ] Detailed Tables

### Phase 3:
- [ ] Advanced forecasting
- [ ] Anomaly detection
- [ ] Custom report builder
- [ ] Scheduled exports
- [ ] Webhooks para alertas

---

## ✅ Checklist de Implementação

- [ ] Criar nova page: AdminDashboardV2.js
- [ ] Setup Recharts para todos os gráficos
- [ ] Criar endpoints backend (veja seção acima)
- [ ] Implementar KPI Cards com animação
- [ ] Revenue/Financial section
- [ ] User Growth section
- [ ] Referral Network section
- [ ] Investment Performance section
- [ ] System Health section
- [ ] Alerts & Anomalies section
- [ ] Detailed Tables section
- [ ] Admin Controls panel
- [ ] Configuration panel
- [ ] Export CSV/PDF
- [ ] Real-time updates com polling/websockets
- [ ] Responsividade mobile
- [ ] Dark mode (já tem)
- [ ] Documentação da API admin

---

*Prompt criado em 15 de Janeiro de 2026*  
*Pronto para ser entregue ao desenvolvedor/time*  
*Use como especificação para implementação do Admin Dashboard*
