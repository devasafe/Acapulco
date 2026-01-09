import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Divider, CircularProgress, List, ListItem, ListItemText, Button, Container } from '@mui/material';
import axios from 'axios';
import { getToken } from '../utils/auth';

export default function UserDashboardPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${base}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setData(res.data);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, token]);

  if (loading) return <Box sx={{ p: 4 }}><CircularProgress /></Box>;
  if (!data) return <Box sx={{ p: 4 }}><Typography>Usuário não encontrado.</Typography></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>{data.user.name}</Typography>
      <Typography variant="subtitle1" sx={{ color: '#666', mb: 2 }}>{data.user.email}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Carteira: R$ {Number(data.user.wallet || 0).toFixed(2)}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2">Indicado por</Typography>
      {data.user.indicadoPor ? (
        <Box>
          <Typography>{data.user.indicadoPor.name}</Typography>
          <Typography variant="caption">{data.user.indicadoPor.email}</Typography>
        </Box>
      ) : (
        <Typography variant="body2">—</Typography>
      )}
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2">Investimentos ({data.investments.length})</Typography>
      <List dense>
        {data.investments.map(inv => (
          <ListItem key={inv.id}>
            <ListItemText
              primary={`${inv.crypto ? inv.crypto.name : 'Cripto'} — R$ ${Number(inv.amount || 0).toFixed(2)}`}
              secondary={`Plano: ${inv.investmentPlan}d • Rend.: ${inv.yieldPercentage}% • Vencimento: ${inv.maturityDate ? new Date(inv.maturityDate).toLocaleString() : '—'}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2">Transações mais recentes</Typography>
      <List dense>
        {data.transactions.slice(0, 10).map(tx => (
          <ListItem key={tx._id}>
            <ListItemText primary={`${tx.type} — R$ ${Number(tx.amount||0).toFixed(2)}`} secondary={new Date(tx.createdAt).toLocaleString()} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2">Usuários indicados ({data.referred.length})</Typography>
      <List dense>
        {data.referred.slice(0, 10).map(r => (
          <ListItem key={r._id}>
            <ListItemText primary={r.name} secondary={`${r.email} • ${new Date(r.createdAt).toLocaleDateString()}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
