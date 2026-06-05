# Debug script para o problema "Total Lucro R$ 0k"
# Script para Windows PowerShell

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Debug: Total Lucro R$ 0k" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 MUDANÇAS APLICADAS" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Backend:" -ForegroundColor Yellow
Write-Host "   1. investmentController.js - Corrigido para usar crypto.plans[]"
Write-Host "   2. adminController.js - Melhorado error handling e conversão de tipos"
Write-Host "   3. NOVO: scripts/debugDatabase.js - Analisa estado do banco"
Write-Host "   4. NOVO: scripts/seedInvestmentsWithProfit.js - Cria dados de teste"
Write-Host ""
Write-Host "✅ Frontend:" -ForegroundColor Yellow
Write-Host "   1. AdminDashboardV2.js - Adicionado console.log para debug"
Write-Host ""

Write-Host "🔍 CHECKLIST DE TESTE" -ForegroundColor Cyan
Write-Host ""

Write-Host "PASSO 1: Verificar estado do banco" -ForegroundColor Green
Write-Host "Command: cd backend && node scripts/debugDatabase.js" -ForegroundColor White
Write-Host ""
Write-Host "Procure por:" -ForegroundColor Yellow
Write-Host "  ✓ Total de usuários > 0"
Write-Host "  ✓ Transações de Profit > 0"
Write-Host "  ✓ Investimentos Retirados > 0"
Write-Host ""

Write-Host "PASSO 2: Se não houver dados, crie dados de teste" -ForegroundColor Green
Write-Host "Commands:" -ForegroundColor White
Write-Host "  cd backend"
Write-Host "  node scripts/seedCryptos.js"
Write-Host "  node scripts/seedInvestmentsWithProfit.js"
Write-Host ""

Write-Host "PASSO 3: Reiniciar o servidor backend" -ForegroundColor Green
Write-Host "Command: npm start" -ForegroundColor White
Write-Host ""

Write-Host "PASSO 4: Abrir admin dashboard e verificar console" -ForegroundColor Green
Write-Host "Steps:" -ForegroundColor White
Write-Host "  1. Abra http://localhost:3000/admin/dashboard"
Write-Host "  2. Pressione F12 para abrir DevTools"
Write-Host "  3. Vá para a aba 'Console'"
Write-Host "  4. Procure por mensagens com 🔍 e 📡"
Write-Host ""

Write-Host "📊 MENSAGENS ESPERADAS NO CONSOLE:" -ForegroundColor Cyan
Write-Host ""
Write-Host "📡 [AdminDashboard] Resposta da API /admin/users: [...]" -ForegroundColor White
Write-Host "🔍 [AdminDashboard] Dados carregados: {" -ForegroundColor White
Write-Host "     totalProfit: XXX,  // <- Deve ser > 0" -ForegroundColor Green
Write-Host "     allUsersProfit: [...]" -ForegroundColor White
Write-Host "   }" -ForegroundColor White
Write-Host ""

Write-Host "❓ TROUBLESHOOTING" -ForegroundColor Yellow
Write-Host ""
Write-Host "Se totalProfit ainda for 0:" -ForegroundColor Red
Write-Host "  1. Verifique Network tab -> /admin/users"
Write-Host "  2. Response deve conter 'profit' field com valores > 0"
Write-Host "  3. Se profit estiver 0 na API, problema é no backend"
Write-Host ""

Write-Host "Se houver erro 401 Unauthorized:" -ForegroundColor Red
Write-Host "  1. Logout e login novamente"
Write-Host "  2. Limpe cache: localStorage.clear() no console"
Write-Host "  3. Recarregue a página"
Write-Host ""

Write-Host "📁 ARQUIVOS MODIFICADOS" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:" -ForegroundColor Yellow
Write-Host "  • backend/controllers/investmentController.js (FIX: crypto.plans[])"
Write-Host "  • backend/controllers/adminController.js (FIX: error handling)"
Write-Host "  • backend/scripts/debugDatabase.js (NOVO)"
Write-Host "  • backend/scripts/seedInvestmentsWithProfit.js (NOVO)"
Write-Host ""
Write-Host "Frontend:" -ForegroundColor Yellow
Write-Host "  • frontend/src/pages/AdminDashboardV2.js (DEBUG: console.log)"
Write-Host ""
Write-Host "Documentação:" -ForegroundColor Yellow
Write-Host "  • PROFIT_DEBUG.md - Guia completo de troubleshooting"
Write-Host "  • RUN_DEBUG.sh - Script bash de debug (se usar WSL/Git Bash)"
Write-Host "  • fix_dashboard.ps1 - Este arquivo (você está lendo)"
Write-Host ""

Write-Host "✅ STATUS: Pronto para teste!" -ForegroundColor Green
Write-Host ""
                    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.08) 0%, rgba(255, 0, 255, 0.05) 100%), linear-gradient(135deg, #0a0f25 0%, #1a0f35 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 0 40px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, background: 'linear-gradient(90deg, #00ffff 0%, #00ff88 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      💳 Transações
                    </Typography>
                    <Box sx={{ flex: 1, minHeight: 220 }}>
                      <Chart
                        type="area"
                        series={[
                          { name: 'Depósitos', data: chartData.deposits },
                          { name: 'Saques', data: chartData.withdrawals },
                        ]}
                        options={{
                          chart: { type: 'area', stacked: false, fontFamily: 'Roboto', background: 'transparent' },
                          xaxis: { categories: chartData.dates, labels: { style: { colors: '#a8d8ff', fontSize: '11px' } } },
                          colors: ['#00ff88', '#ff6b6b'],
                          stroke: { curve: 'smooth', width: 2 },
                          fill: { type: 'gradient', colors: ['rgba(0, 255, 136, 0.25)', 'rgba(255, 107, 107, 0.25)'] },
                          tooltip: { theme: 'dark', style: { backgroundColor: '#0a0f25', textColor: '#00ffff', borderColor: '#00ffff' }, marker: { fillColors: ['#00ff88', '#ff6b6b'] } },
                          grid: { borderColor: 'rgba(0, 255, 255, 0.1)', strokeDashArray: 3 },
                          legend: { position: 'bottom', labels: { colors: '#a8d8ff', fontSize: 11 } },
                        }}
                        height={220}
                      />
                    </Box>
                  </Paper>
                </Grid>

                {/* Gráfico de Evolução do Saldo */}
                <Grid item xs={12} sm={6} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Paper sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: '0 0 30px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(0, 255, 136, 0.05) 100%), linear-gradient(135deg, #2a2a0f 0%, #0f2a2a 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 0 40px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, background: 'linear-gradient(90deg, #ffff00 0%, #00ffff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      📈 Evolução do Saldo
                    </Typography>
                    <Box sx={{ flex: 1, minHeight: 220 }}>
                      <Chart
                        type="line"
                        series={[{ name: 'Saldo', data: chartData.saldoEvolucao }]}
                        options={{
                          chart: { type: 'line', fontFamily: 'Roboto', background: 'transparent' },
                          xaxis: { categories: chartData.dates, labels: { style: { colors: '#a8d8ff', fontSize: '11px' } } },
                          colors: ['#ffff00'],
                          dataLabels: { enabled: false },
                          stroke: { curve: 'smooth', width: 2.5 },
                          fill: { type: 'gradient', colors: ['rgba(255, 255, 0, 0.2)'] },
                          tooltip: { theme: 'dark', style: { backgroundColor: '#0a0f25', textColor: '#00ffff', borderColor: '#ffff00' }, marker: { fillColors: ['#ffff00'] } },
                          grid: { borderColor: 'rgba(255, 215, 0, 0.1)', strokeDashArray: 3 },
                          legend: { position: 'bottom', labels: { colors: '#a8d8ff', fontSize: 11 } },
                        }}
                        height={220}
                      />
                    </Box>
                  </Paper>
                </Grid>

                {/* Gráfico de Distribuição */}
                <Grid item xs={12} sm={6} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Paper sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: '0 0 30px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                    background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%), linear-gradient(135deg, #1a0f35 0%, #2a1f25 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 0, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 0 40px rgba(255, 0, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, background: 'linear-gradient(90deg, #ff00ff 0%, #ffff00 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      🍕 Distribuição
                    </Typography>
                    <Box sx={{ flex: 1, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {donutData && donutData.series.length > 0 ? (
                        <Chart
                          type="donut"
                          series={donutData.series}
                          options={{
                            labels: donutData.labels,
                            colors: ['#00ffff', '#00ff88', '#ffff00', '#ff6b6b', '#ff00ff'],
                            legend: { position: 'bottom', fontFamily: 'Roboto', labels: { colors: '#a8d8ff' }, fontSize: 11 },
                            dataLabels: { enabled: true, style: { fontSize: '12px', fontWeight: 700, colors: ['#fff'] }, background: { enabled: true, foreColor: '#0a0f25', borderRadius: 3, padding: 3 } },
                            tooltip: { theme: 'dark', style: { backgroundColor: '#0a0f25', textColor: '#00ffff', borderColor: '#00ffff' } },
                            plotOptions: { pie: { donut: { size: '60%' } } },
                          }}
                          height={220}
                        />
                      ) : (
                        <Typography sx={{ color: '#7a8a99' }}>Nenhum investimento</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
"@

# Find and replace - use regex pattern
$pattern = '        {/\* Seção Gráficos \*/}.*?        {/\* Seção de Tabelas \*/}'
$newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $newCharts + "`n`n        {/* Seção de Tabelas */}", [System.Text.RegularExpressions.RegexOptions]::Singleline)

if ($newContent -eq $content) {
  Write-Host "No replacement made - checking file..."
  $lines = $content -split "`n"
  for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -like "*Seção Gráficos*") {
      Write-Host "Found 'Seção Gráficos' at line" ($i + 1)
    }
  }
} else {
  Set-Content -Path $file -Value $newContent
  Write-Host "File updated successfully!"
}
