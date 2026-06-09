import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, Button, TextField,
  ToggleButtonGroup, ToggleButton, CircularProgress, Alert, Divider, Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import PageLayout from '../components/PageLayout';
import { getAsset } from '../services/assetService';
import { getCandles } from '../services/marketService';
import { buy as buyTrade, sell as sellTrade, getPositions, getStats } from '../services/tradeService';
import { connectSocket } from '../services/socketService';
import { getToken } from '../utils/auth';

const fmt = (n, d = 2) =>
  n == null ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: d });
const fmtUsd = (n) => (n == null ? '—' : `$${fmt(n, 2)}`);

export default function AssetPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [candles, setCandles] = useState([]);
  const [interval, setIntervalVal] = useState('1h');
  const [price, setPrice] = useState(null);
  const [position, setPosition] = useState(null);
  const [cash, setCash] = useState(null);
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const refreshPortfolio = useCallback(async () => {
    try {
      const [pos, stats] = await Promise.all([getPositions(), getStats()]);
      setPosition(pos.data.find((p) => p.symbol === symbol) || null);
      setCash(stats.data.cash);
    } catch (_) {}
  }, [symbol]);

  // Carrega detalhe + candles
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAsset(symbol)
      .then((res) => {
        if (!mounted) return;
        setAsset(res.data);
        if (res.data.quote) setPrice(res.data.quote.price);
      })
      .catch(() => setMsg({ type: 'error', text: 'Ativo não encontrado na watchlist.' }))
      .finally(() => mounted && setLoading(false));
    refreshPortfolio();
    return () => { mounted = false; };
  }, [symbol, refreshPortfolio]);

  // Candles por intervalo
  useEffect(() => {
    let mounted = true;
    getCandles(symbol, { interval, limit: 200 })
      .then((res) => { if (mounted) setCandles(res.data); })
      .catch(() => {});
    return () => { mounted = false; };
  }, [symbol, interval]);

  // Preço ao vivo
  useEffect(() => {
    const socket = connectSocket(getToken());
    const onPrice = (p) => { if (p.symbol === symbol) setPrice(p.price); };
    if (socket) socket.on('price', onPrice);
    return () => { if (socket) socket.off('price', onPrice); };
  }, [symbol]);

  const series = [{
    data: candles.map((c) => ({ x: new Date(c.time), y: [c.open, c.high, c.low, c.close] })),
  }];

  const chartOptions = {
    chart: { type: 'candlestick', height: 420, background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    xaxis: { type: 'datetime', labels: { style: { colors: '#94A3B8' } } },
    yaxis: { tooltip: { enabled: true }, labels: { style: { colors: '#94A3B8' } } },
    grid: { borderColor: 'rgba(148,163,184,0.1)' },
    plotOptions: { candlestick: { colors: { upward: '#10B981', downward: '#EF4444' } } },
  };

  const handleTrade = async (side) => {
    setMsg(null);
    const quantity = Number(qty);
    if (!quantity || quantity <= 0) {
      setMsg({ type: 'error', text: 'Informe uma quantidade válida.' });
      return;
    }
    setBusy(true);
    try {
      const fn = side === 'buy' ? buyTrade : sellTrade;
      const res = await fn({ symbol, quantity });
      const pnl = res.data.realizedPnl;
      setMsg({
        type: 'success',
        text:
          side === 'buy'
            ? `Compra executada: ${quantity} ${symbol} @ ${fmtUsd(res.data.trade.price)}`
            : `Venda executada: ${quantity} ${symbol} @ ${fmtUsd(res.data.trade.price)} (P&L ${fmtUsd(pnl)})`,
      });
      setQty('');
      await refreshPortfolio();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao executar a ordem.' });
    } finally {
      setBusy(false);
    }
  };

  const estCost = qty && price ? Number(qty) * price : 0;

  return (
    <PageLayout>
      <Container maxWidth="lg">
        <Button onClick={() => navigate('/markets')} sx={{ color: '#94A3B8', mb: 1 }}>
          ← Voltar aos mercados
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3}>
            {/* Gráfico */}
            <Grid item xs={12} md={8}>
              <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#F1F5F9' }}>
                        {symbol}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>{asset?.name}</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#7C3AED' }}>
                      {fmtUsd(price)}
                    </Typography>
                  </Box>
                  <ToggleButtonGroup
                    size="small"
                    value={interval}
                    exclusive
                    onChange={(e, v) => v && setIntervalVal(v)}
                    sx={{ mb: 1, '& .MuiToggleButton-root': { color: '#94A3B8', borderColor: 'rgba(148,163,184,0.2)' } }}
                  >
                    {['15m', '1h', '4h', '1d'].map((iv) => (
                      <ToggleButton key={iv} value={iv}>{iv}</ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  {series[0].data.length > 0 ? (
                    <ReactApexChart options={chartOptions} series={series} type="candlestick" height={420} />
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Painel de trade */}
            <Grid item xs={12} md={4}>
              <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 1 }}>
                    Negociar (fictício)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Caixa disponível: <b style={{ color: '#10B981' }}>{fmtUsd(cash)}</b>
                  </Typography>

                  {msg && <Alert severity={msg.type} sx={{ my: 1.5 }}>{msg.text}</Alert>}

                  <TextField
                    fullWidth size="small" type="number" label="Quantidade"
                    value={qty} onChange={(e) => setQty(e.target.value)}
                    sx={{ my: 1.5, '& .MuiOutlinedInput-root': { color: '#F1F5F9' }, '& label': { color: '#94A3B8' } }}
                  />
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Estimativa: <b style={{ color: '#F1F5F9' }}>{fmtUsd(estCost)}</b>
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      fullWidth variant="contained" disabled={busy}
                      sx={{ background: '#10B981', fontWeight: 700, '&:hover': { background: '#059669' } }}
                      onClick={() => handleTrade('buy')}
                    >
                      Comprar
                    </Button>
                    <Button
                      fullWidth variant="contained" disabled={busy}
                      sx={{ background: '#EF4444', fontWeight: 700, '&:hover': { background: '#DC2626' } }}
                      onClick={() => handleTrade('sell')}
                    >
                      Vender
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: 'rgba(148,163,184,0.15)' }} />

                  <Typography variant="subtitle2" sx={{ color: '#F1F5F9', mb: 1 }}>Sua posição</Typography>
                  {position && position.quantity > 0 ? (
                    <Box sx={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Quantidade</span><b>{fmt(position.quantity, 8)}</b>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Preço médio</span><b>{fmtUsd(position.avgEntryPrice)}</b>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <span>P&L não realizado</span>
                        <Chip
                          size="small"
                          label={fmtUsd(position.unrealizedPnl)}
                          sx={{
                            bgcolor: (position.unrealizedPnl ?? 0) >= 0 ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)',
                            color: (position.unrealizedPnl ?? 0) >= 0 ? '#10B981' : '#EF4444',
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Você ainda não tem posição neste ativo.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </PageLayout>
  );
}
