import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import PageLayout from '../components/PageLayout';
import { getAdminReferralSettings, updateAdminReferralSettings, getAdminReferralProfits } from '../services/referralService';

const AdminReferralSettingsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referralPercentage, setReferralPercentage] = useState(10);
  const [profits, setProfits] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSettings();
    fetchProfits();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await getAdminReferralSettings(token);
      setReferralPercentage(response.data.referralPercentage);
    } catch (err) {
      setError('Erro ao carregar configurações');
    }
  };

  const fetchProfits = async () => {
    try {
      const response = await getAdminReferralProfits(token);
      setProfits(response.data);
    } catch (err) {
      console.error('Erro ao carregar lucros:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (referralPercentage < 0 || referralPercentage > 100) {
        setError('Percentual deve estar entre 0 e 100');
        return;
      }

      await updateAdminReferralSettings(referralPercentage, token);
      setSuccess('Configurações atualizadas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  const totalBonusDistributed = profits.reduce((sum, p) => sum + p.totalBonusEarned, 0);

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon /> Configurações de Referência
        </Typography>

        {/* Configuração de Percentual */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Percentual de Bônus por Referência
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', maxWidth: 400 }}>
              <TextField
                label="Percentual (%)"
                type="number"
                value={referralPercentage}
                onChange={(e) => setReferralPercentage(Math.max(0, Math.min(100, Number(e.target.value))))}
                variant="outlined"
                inputProps={{ min: 0, max: 100, step: 1 }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: theme.textSecondary }}>
              Quando um usuário indicado fazer seu primeiro saque, o referenciador receberá este percentual do valor em bônus.
            </Typography>

            {/* Exemplo */}
            <Box sx={{ mt: 3, p: 2, background: `rgba(59, 91, 219, 0.1)`, borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                📌 Exemplo:
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: theme.textSecondary }}>
                • Percentual configurado: {referralPercentage}%
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: theme.textSecondary }}>
                • Usuário indicado faz saque de: R$ 1.000,00
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: theme.success, fontWeight: 600, mt: 1 }}>
                • Referenciador recebe: R$ {(1000 * referralPercentage / 100).toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Estatísticas de Referências */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="caption">
                  Total de Usuários com Bônus
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.primary }}>
                  {profits.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="caption">
                  Total em Bônus Distribuído
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.success }}>
                  R$ {totalBonusDistributed.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant="caption">
                  Bônus Médio por Usuário
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.warning }}>
                  R$ {(profits.length > 0 ? totalBonusDistributed / profits.length : 0).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabela de Lucros */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Top 10 Referenciadores
            </Typography>

            {profits.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                Nenhum bônus de referência distribuído ainda
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `rgba(59, 91, 219, 0.05)` }}>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Nome</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Código Referência</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.primary }}>
                      Bônus Total
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.primary }}>
                      Referências Ativas
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profits.slice(0, 10).map((profit) => (
                    <TableRow key={profit.userId} sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                      <TableCell sx={{ color: theme.text }}>{profit.name}</TableCell>
                      <TableCell sx={{ color: theme.textSecondary }}>{profit.email}</TableCell>
                      <TableCell sx={{ color: theme.textSecondary, fontFamily: 'monospace', fontSize: 12 }}>
                        {profit.referralCode}
                      </TableCell>
                      <TableCell align="right" sx={{ color: theme.success, fontWeight: 700 }}>
                        R$ {profit.totalBonusEarned.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: theme.primary, fontWeight: 700 }}>
                        {profit.bonusCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Container>
    </PageLayout>
  );
};

export default AdminReferralSettingsPage;
