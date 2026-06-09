import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, Table, TableBody,
  TableCell, TableHead, TableRow, Chip, CircularProgress, Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getStats, getPositions, getTrades } from '../services/tradeService';
import { connectSocket } from '../services/socketService';
import { getToken } from '../utils/auth';

const fmtUsd = (n) =>
  n == null ? '—' : `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtQty = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 8 });

function Kpi({ label, value, color = '#F1F5F9' }) {
  return (
    <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Typography variant="caption" sx={{ color: '#94A3B8' }}>{label}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [s, p, t] = await Promise.all([getStats(), getPositions(), getTrades()]);
      setStats(s.data);
      setPositions(p.data);
      setTrades(t.data);
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const socket = connectSocket(getToken());
    const id = setInterval(load, 15000); // revaloriza periodicamente
    return () => { clearInterval(id); if (socket) socket.off('price'); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pnlColor = (v) => ((v ?? 0) >= 0 ? '#10B981' : '#EF4444');

  return (
    <PageLayout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9' }}>Dashboard</Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Sua carteira fictícia, valorizada com preços reais de mercado.
            </Typography>
          </Box>
          <Button variant="contained" sx={{ background: 'linear-gradient(135deg,#7C3AED,#6B46C1)', fontWeight: 700 }} onClick={() => navigate('/markets')}>
            Ir aos mercados
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}><Kpi label="Patrimônio total" value={fmtUsd(stats?.totalEquity)} /></Grid>
              <Grid item xs={12} sm={6} md={3}><Kpi label="Caixa disponível" value={fmtUsd(stats?.cash)} /></Grid>
              <Grid item xs={12} sm={6} md={3}><Kpi label="P&L não realizado" value={fmtUsd(stats?.unrealizedPnl)} color={pnlColor(stats?.unrealizedPnl)} /></Grid>
              <Grid item xs={12} sm={6} md={3}><Kpi label="P&L realizado" value={fmtUsd(stats?.realizedPnl)} color={pnlColor(stats?.realizedPnl)} /></Grid>
            </Grid>

            {/* Posições */}
            <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 1 }}>Posições abertas</Typography>
                {positions.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Nenhuma posição aberta. Vá aos mercados e comece a praticar!</Typography>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {['Ativo', 'Qtd', 'Preço médio', 'Preço atual', 'Valor', 'P&L'].map((h) => (
                            <TableCell key={h} sx={{ color: '#94A3B8' }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {positions.map((p) => (
                          <TableRow key={p.symbol} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/asset/${p.symbol}`)}>
                            <TableCell sx={{ color: '#F1F5F9', fontWeight: 700 }}>{p.symbol}</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }}>{fmtQty(p.quantity)}</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }}>{fmtUsd(p.avgEntryPrice)}</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }}>{fmtUsd(p.currentPrice)}</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }}>{fmtUsd(p.marketValue)}</TableCell>
                            <TableCell>
                              <Chip size="small" label={`${fmtUsd(p.unrealizedPnl)} (${p.unrealizedPnlPercent == null ? '—' : p.unrealizedPnlPercent.toFixed(2) + '%'})`}
                                sx={{ bgcolor: (p.unrealizedPnl ?? 0) >= 0 ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: pnlColor(p.unrealizedPnl), fontWeight: 700 }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 1 }}>Histórico de operações</Typography>
                {trades.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Nenhuma operação ainda.</Typography>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {['Data', 'Tipo', 'Ativo', 'Qtd', 'Preço', 'Total', 'P&L'].map((h) => (
                            <TableCell key={h} sx={{ color: '#94A3B8' }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trades.map((t) => (
                          <TableRow key={t._id}>
                            <TableCell sx={{ color: '#CBD5E1' }}>{new Date(t.createdAt).toLocaleString('pt-BR')}</TableCell>
                            <TableCell>
                              <Chip size="small" label={t.side === 'buy' ? 'Compra' : 'Venda'}
                                sx={{ bgcolor: t.side === 'buy' ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: t.side === 'buy' ? '#10B981' : '#EF4444', fontWeight: 700 }} />
                            </TableCell>
                            <TableCell sx={{ color: '#F1F5F9', fontWeight: 600 }}>{t.symbol}</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }}>{fmtQty(t.quantity)}</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }}>{fmtUsd(t.price)}</TableCell>
                            <TableCell sx={{ color: '#CBD5E1' }}>{fmtUsd(t.total)}</TableCell>
                            <TableCell sx={{ color: t.side === 'sell' ? pnlColor(t.realizedPnl) : '#64748B' }}>
                              {t.side === 'sell' ? fmtUsd(t.realizedPnl) : '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </PageLayout>
  );
}
