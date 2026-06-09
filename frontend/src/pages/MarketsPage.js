import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Chip, Button,
  CircularProgress, TextField, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getAssets } from '../services/assetService';
import { connectSocket } from '../services/socketService';
import { getToken } from '../utils/auth';

const fmtPrice = (n) =>
  n == null ? '—' : `$${Number(n).toLocaleString('en-US', { maximumFractionDigits: 8 })}`;

export default function MarketsPage() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    getAssets()
      .then((res) => { if (mounted) setAssets(res.data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });

    // Preços ao vivo via socket
    const socket = connectSocket(getToken());
    const onPrice = ({ symbol, price, changePercent }) => {
      setAssets((prev) =>
        prev.map((a) => (a.symbol === symbol ? { ...a, price, changePercent } : a))
      );
    };
    if (socket) socket.on('price', onPrice);

    return () => {
      mounted = false;
      if (socket) socket.off('price', onPrice);
    };
  }, []);

  const visible = assets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      (a.name || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <PageLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9' }}>
            Mercados
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Preços reais de mercado, atualizando ao vivo. Pratique com dinheiro fictício.
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Filtrar por símbolo ou nome..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: '#F1F5F9' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94A3B8' }} />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : visible.length === 0 ? (
          <Typography sx={{ color: '#94A3B8', textAlign: 'center', py: 6 }}>
            Nenhum ativo na watchlist. {`(O admin pode adicionar ativos por símbolo no painel.)`}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {visible.map((a) => {
              const up = (a.changePercent ?? 0) >= 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={a.symbol}>
                  <Card
                    sx={{
                      background: 'rgba(26, 31, 46, 0.8)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      borderRadius: 3,
                      transition: 'transform .2s, border-color .2s',
                      '&:hover': { transform: 'translateY(-4px)', borderColor: '#7C3AED' },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                            {a.symbol}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {a.name}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          icon={up ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          label={a.changePercent == null ? '—' : `${a.changePercent.toFixed(2)}%`}
                          sx={{
                            bgcolor: up ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)',
                            color: up ? '#10B981' : '#EF4444',
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                      <Typography variant="h5" sx={{ mt: 2, fontWeight: 800, color: '#F1F5F9' }}>
                        {fmtPrice(a.price)}
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 2,
                          background: 'linear-gradient(135deg, #7C3AED, #6B46C1)',
                          fontWeight: 700,
                        }}
                        onClick={() => navigate(`/asset/${a.symbol}`)}
                      >
                        Negociar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </PageLayout>
  );
}
