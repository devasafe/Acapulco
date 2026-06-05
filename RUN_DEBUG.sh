#!/bin/bash
# Script para testar e debugar o problema de "Total Lucro R$ 0k"

echo "=================================="
echo "Debug: Total Lucro R$ 0k"
echo "=================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd backend

echo -e "${BLUE}1️⃣  Checando estado do banco de dados...${NC}"
echo "Execute: node scripts/debugDatabase.js"
echo ""

echo -e "${YELLOW}Esperado:${NC}"
echo "  ✅ Total de usuários > 0"
echo "  ✅ Transações de Profit > 0"
echo "  ✅ Investimentos Retirados > 0"
echo ""

echo -e "${BLUE}2️⃣  Se não houver dados de teste, crie alguns...${NC}"
echo "Execute (nessa ordem):"
echo "  1. node scripts/seedCryptos.js"
echo "  2. node scripts/seedInvestmentsWithProfit.js"
echo ""

echo -e "${BLUE}3️⃣  Reinicie o servidor backend${NC}"
echo "Execute: npm start"
echo ""

echo -e "${BLUE}4️⃣  Abra o DevTools do navegador (F12)${NC}"
echo "  - Vá para a aba 'Console'"
echo "  - Procure por mensagens com 🔍 (Debug)"
echo "  - Procure por mensagens com 📡 (API Response)"
echo "  - Procure por mensagens com 🔧 (Calculation)"
echo ""

echo -e "${GREEN}Mensagens esperadas no Console:${NC}"
echo "  📡 [AdminDashboard] Resposta da API /admin/users: [...]"
echo "  🔍 [AdminDashboard] Dados carregados: {totalProfit: XXX}"
echo ""

echo -e "${YELLOW}Se totalProfit ainda for 0:${NC}"
echo "  1. Verifique: allUsersProfit contém dados?"
echo "  2. Verifique: profit field está presente em cada usuário?"
echo "  3. Verifique: Network tab mostra /admin/users com profit > 0?"
echo ""

echo -e "${BLUE}5️⃣  Checklist de Solução:${NC}"
echo ""
echo -e "${GREEN}Backend:${NC}"
echo "  ☐ investmentController.js - Corrigido para usar crypto.plans[]"
echo "  ☐ adminController.js - Melhorado error handling"
echo "  ☐ Criado debugDatabase.js - Script de análise"
echo "  ☐ Criado seedInvestmentsWithProfit.js - Script de teste"
echo ""
echo -e "${GREEN}Frontend:${NC}"
echo "  ☐ AdminDashboardV2.js - Adicionado console.log para debug"
echo "  ☐ Pronto para verificação no DevTools"
echo ""

echo -e "${GREEN}✅ Todas as correções foram aplicadas!${NC}"
echo ""
echo "Próximas ações:"
echo "  1. Executar debugDatabase.js"
echo "  2. Se não houver dados, executar seedInvestmentsWithProfit.js"
echo "  3. Reiniciar backend e frontend"
echo "  4. Verificar console no DevTools para mensagens de debug"
