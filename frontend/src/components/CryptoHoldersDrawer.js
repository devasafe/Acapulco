import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { getToken } from '../utils/auth';

const CryptoHoldersDrawer = ({ open, onClose, crypto }) => {
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const navigate = useNavigate();

  // Função para converter minutos em formato legível
  const formatPlanDuration = (minutes) => {
    const mins = Number(minutes);
    if (isNaN(mins)) return `${minutes}`;
    
    if (mins >= 1440) {
      const days = Math.round(mins / 1440);
      return `${days} dia${days > 1 ? 's' : ''}`;
    } else if (mins >= 60) {
      const hours = Math.round(mins / 60);
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    }
    return `${mins} min`;
  };

  useEffect(() => {
    if (open && crypto) {
      fetchHolders();
    }
  }, [open, crypto]);

  const fetchHolders = async () => {
    setLoading(true);
    try {
      const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const cryptoId = crypto._id || crypto.id;
      const res = await axios.get(
        `${base}/api/admin/cryptos/${cryptoId}/holders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHolders(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar detentores:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
          bgcolor: '#0f1724',
          color: '#e6eef8',
          minHeight: '100vh',
          p: 2,
          overflowY: 'auto',
        }}
      >
        {/* Header + Details */}
        <Box sx={{ mb: 2 }}>
          {crypto?.image && (
            <Box
              component="img"
              src={`http://localhost:5000${crypto.image}`}
              alt={crypto.name}
              sx={{
                width: '100%',
                height: 180,
                objectFit: 'cover',
                borderRadius: '8px',
                mb: 1.5,
              }}
            />
          )}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            💰 {crypto?.name || 'Cripto'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {crypto?.symbol}
          </Typography>
          {crypto?.description && (
            <Typography variant="body2" sx={{ color: '#a0aec0', mt: 1, mb: 1 }}>
              {crypto.description}
            </Typography>
          )}
          {crypto?.price !== undefined && (
            <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 700, mb: 1 }}>
              Preço mínimo de investimento: R$ {Number(crypto.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          )}
          {/* Planos de investimento */}
          {crypto?.plans && crypto.plans.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: '#e6eef8', fontWeight: 600, mb: 0.5 }}>
                Planos de Investimento
              </Typography>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(102,126,234,0.04)', borderRadius: 2, marginBottom: 8 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', color: '#a0aec0', fontWeight: 700, fontSize: 14, padding: '8px 4px' }}>Tempo (dias)</th>
                    <th style={{ textAlign: 'left', color: '#48bb78', fontWeight: 700, fontSize: 14, padding: '8px 4px' }}>Porcentagem (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {crypto.plans.map((plan, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(102,126,234,0.08)' }}>
                      <td style={{ color: '#e6eef8', fontWeight: 500, padding: '8px 4px' }}>{formatPlanDuration(plan.days)}</td>
                      <td style={{ color: '#48bb78', fontWeight: 700, padding: '8px 4px' }}>+{plan.yield}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
          <Divider sx={{ my: 1.5, borderColor: 'rgba(230, 238, 248, 0.1)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              style={{
                background: 'linear-gradient(90deg,#667eea 0%,#00c9b7 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 15,
                marginTop: 4,
                marginBottom: 2,
                boxShadow: '0 2px 8px 0 rgba(0,201,183,0.10)'
              }}
              onClick={() => navigate('/crypto-admin')}
            >
              Editar Cripto
            </button>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Paper
              sx={{
                bgcolor: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                p: 1.5,
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>
                Ativos
              </Typography>
              <Typography variant="h6" sx={{ color: '#667eea' }}>
                {holders.reduce((s, h) => s + h.activeCount, 0)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{
                bgcolor: 'rgba(72, 187, 120, 0.1)',
                border: '1px solid rgba(72, 187, 120, 0.2)',
                p: 1.5,
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>
                Vencidos
              </Typography>
              <Typography variant="h6" sx={{ color: '#48bb78' }}>
                {holders.reduce((s, h) => s + h.maturedCount, 0)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, borderColor: 'rgba(230, 238, 248, 0.1)' }} />

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: '#667eea' }} />
          </Box>
        )}

        {/* Holders List */}
        {!loading && holders.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Detentores ({holders.length})
            </Typography>
            <List sx={{ p: 0 }}>
              {holders.map((holder, idx) => (
                <ListItem
                  key={holder.userId || idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    px: 1,
                    py: 1.5,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    mb: 1,
                    border: '1px solid rgba(230, 238, 248, 0.05)',
                    transition: 'all 160ms ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.04)',
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                    },
                  }}
                >
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {holder.name}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {holder.email}
                    </Typography>
                  </Box>

                  <Grid container spacing={1} sx={{ width: '100%', fontSize: '11px' }}>
                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          bgcolor: 'rgba(102, 126, 234, 0.05)',
                          p: 0.75,
                          borderRadius: '4px',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.7 }}>
                          Investido
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#667eea' }}
                        >
                          R$ {Number(holder.totalInvested).toFixed(0)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          bgcolor: 'rgba(72, 187, 120, 0.05)',
                          p: 0.75,
                          borderRadius: '4px',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.7 }}>
                          Carteira
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#48bb78' }}
                        >
                          R$ {Number(holder.wallet).toFixed(0)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {holder.investments.length > 0 && (
                    <Box sx={{ width: '100%', mt: 1, pt: 1, borderTop: '1px solid rgba(230, 238, 248, 0.05)' }}>
                      <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mb: 0.5 }}>
                        Investimentos:
                      </Typography>
                      <Box sx={{ pl: 1 }}>
                        {holder.investments.map((inv, invIdx) => (
                          <Typography key={invIdx} variant="caption" sx={{ display: 'block', opacity: 0.7, mb: 0.3 }}>
                            • {formatPlanDuration(inv.plan)} - R$ {Number(inv.amount).toFixed(0)} ({inv.yieldPercentage}%)
                            {inv.isMatured ? ' ✓ Vencido' : ' ⏳ Ativo'}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {!loading && holders.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, opacity: 0.7 }}>
            <Typography variant="body2">Nenhum detentor encontrado</Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CryptoHoldersDrawer;
