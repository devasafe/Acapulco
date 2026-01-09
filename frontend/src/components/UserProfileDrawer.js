import React, { useEffect, useState } from 'react';
import { Drawer, Box, Typography, Divider, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import { getToken } from '../utils/auth';

function formatRemaining(ms) {
  if (ms === null || ms === undefined) return 'N/A';
  if (ms <= 0) return 'Vencido';
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function UserProfileDrawer({ open, onClose, userId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (!open || !userId) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${base}/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        setData(res.data);
      } catch (err) {
        console.error('Erro ao carregar perfil do usuário', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [open, userId, token]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 520 } }}>
      <Box sx={{ p: 2 }}>
        {loading && <CircularProgress />}
        {!loading && data && (
          <>
            <Typography variant="h6">{data.user.name}</Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>{data.user.email}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, mb: 2 }}
              onClick={() => window.open(`/dashboard/${data.user._id || data.user.id}`,'_blank')}
              fullWidth
            >
              Ver Dashboard
            </Button>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Carteira</Typography>
            <Typography variant="h6">R$ {Number(data.user.wallet || 0).toFixed(2)}</Typography>
            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2">Indicado por</Typography>
            {data.user.indicadoPor ? (
              <Box>
                <Typography>{data.user.indicadoPor.name}</Typography>
                <Typography variant="caption">{data.user.indicadoPor.email}</Typography>
              </Box>
            ) : (
              <Typography variant="body2">—</Typography>
            )}
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Bônus de indicação aplicado</Typography>
            <Typography>{data.user.receivedReferralBonus ? 'Sim' : 'Não'}</Typography>
            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2">Total ganho por indicação</Typography>
            <Typography>R$ {Number(data.totalReferralEarned || 0).toFixed(2)}</Typography>
            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2">Investimentos ({data.investments.length})</Typography>
            <List dense>
              {data.investments.map(inv => (
                <ListItem key={inv.id}>
                  <ListItemText
                    primary={`${inv.crypto ? inv.crypto.name : 'Cripto'} — R$ ${Number(inv.amount || 0).toFixed(2)}`}
                    secondary={`Plano: ${inv.investmentPlan}d • Rend.: ${inv.yieldPercentage}% • Vencimento: ${inv.maturityDate ? new Date(inv.maturityDate).toLocaleString() : '—'} • Restante: ${formatRemaining(inv.remainingMs)}`}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2">Transações mais recentes</Typography>
            <List dense>
              {data.transactions.slice(0, 10).map(tx => {
                const typeMap = {
                  deposit: 'Depósito',
                  withdrawal: 'Saque',
                  referral: 'Indicação',
                  yield: 'Rendimento',
                  buy: 'Compra',
                  sell: 'Venda'
                };
                const tlabel = typeMap[tx.type] || tx.type;
                let secondary = new Date(tx.createdAt).toLocaleString();
                if (tx.type === 'referral' && tx.sourceUser) {
                  secondary = `De: ${tx.sourceUser.name} (${tx.sourceUser.email}) • ${secondary}`;
                }
                return (
                  <ListItem key={tx._id}>
                    <ListItemText primary={`${tlabel} — R$ ${Number(tx.amount||0).toFixed(2)}`} secondary={secondary} />
                  </ListItem>
                );
              })}
            </List>
            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2">Usuários indicados ({data.referred.length})</Typography>
            <List dense>
              {data.referred.slice(0, 10).map(r => (
                <ListItem key={r._id}>
                  <ListItemText primary={r.name} secondary={`${r.email} • ${new Date(r.createdAt).toLocaleDateString()}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}
        {!loading && !data && (
          <Typography>Selecione um usuário para ver detalhes</Typography>
        )}
      </Box>
    </Drawer>
  );
}
