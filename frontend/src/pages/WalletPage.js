import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PageLayout from '../components/PageLayout';
import { getWallet, deposit, withdraw } from '../services/walletService';
import { getMyInvestments, sellInvestment } from '../services/investmentService';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SendIcon from '@mui/icons-material/Send';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  darker: '#252D3D',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
};

export default function WalletPage() {
  const [wallet, setWallet] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const walletRes = await getWallet(token);
      setWallet(walletRes.data.wallet);
      
      const investRes = await getMyInvestments(token);
      setInvestments(investRes.data || []);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar dados');
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      setError('Digite um valor válido');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await deposit(Number(depositAmount), token);
      setWallet(response.data.wallet);
      setDepositAmount('');
      setSuccess(`Depósito de R$ ${Number(depositAmount).toFixed(2)} realizado com sucesso!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao depositar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setError('Digite um valor válido');
      return;
    }

    if (Number(withdrawAmount) > wallet) {
      setError('Saldo insuficiente');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await withdraw(Number(withdrawAmount), token);
      setWallet(response.data.wallet);
      setWithdrawAmount('');
      setSuccess(`Saque de R$ ${Number(withdrawAmount).toFixed(2)} realizado com sucesso!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao sacar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSellInvestment = async () => {
    if (!selectedInvestment) return;

    try {
      const token = localStorage.getItem('token');
      await sellInvestment(selectedInvestment._id, token);
      setSuccess('Investimento vendido com sucesso!');
      setSellDialogOpen(false);
      setSelectedInvestment(null);
      setTimeout(() => fetchData(), 500);
    } catch (err) {
      setError('Erro ao vender investimento');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Container>
      </PageLayout>
    );
  }

  const investedTotal = investments.reduce((acc, inv) => acc + inv.amount, 0);
  const profitTotal = investments.reduce((acc, inv) => acc + (inv.lucroTotal || 0), 0);

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CreditCardIcon sx={{ fontSize: 40, color: theme.primary }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.text }}>
              Minha Carteira
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: theme.textSecondary }}>
            Gerencie seu saldo, faça depósitos e saques
          </Typography>
        </Box>

        {/* Alerts */}
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Balance Cards Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
          {/* Disponível */}
          <Card
            sx={{
              p: 3,
              background: `linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))`,
              border: `2px solid ${theme.success}`,
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: theme.textTertiary, display: 'block' }}>
              DISPONÍVEL
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: theme.success,
                fontWeight: 900,
                mt: 1,
              }}
            >
              R$ {wallet.toFixed(2)}
            </Typography>
          </Card>

          {/* Investido */}
          <Card
            sx={{
              p: 3,
              background: `linear-gradient(135deg, rgba(59, 91, 219, 0.2), rgba(107, 70, 193, 0.2))`,
              border: `2px solid ${theme.primary}`,
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: theme.textTertiary, display: 'block' }}>
              INVESTIDO
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: theme.primary,
                fontWeight: 900,
                mt: 1,
              }}
            >
              R$ {investedTotal.toFixed(2)}
            </Typography>
          </Card>

          {/* Lucro */}
          <Card
            sx={{
              p: 3,
              background: `linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))`,
              border: `2px solid ${theme.warning}`,
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: theme.textTertiary, display: 'block' }}>
              LUCRO TOTAL
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: theme.warning,
                fontWeight: 900,
                mt: 1,
              }}
            >
              R$ {profitTotal.toFixed(2)}
            </Typography>
          </Card>
        </Box>

        {/* Operations Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          {/* Deposit Card */}
          <Card sx={{ p: 3, bgcolor: theme.darkLight, border: `1px solid ${theme.darker}` }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ color: theme.success }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text }}>
                  Depositar
                </Typography>
              </Box>
              <TextField
                type="number"
                placeholder="Valor"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={submitting}
                slotProps={{
                  input: {
                    step: '0.01',
                    min: '0',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: theme.text,
                    '& fieldset': { borderColor: theme.darker },
                    '&:hover fieldset': { borderColor: theme.primary },
                  },
                  '& .MuiOutlinedInput-input::placeholder': { color: theme.textTertiary, opacity: 0.7 },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleDeposit}
                disabled={submitting || !depositAmount}
                sx={{
                  background: `linear-gradient(135deg, ${theme.success} 0%, #059669 100%)`,
                  fontWeight: 700,
                }}
              >
                {submitting ? <CircularProgress size={20} /> : 'Depositar'}
              </Button>
            </Stack>
          </Card>

          {/* Withdraw Card */}
          <Card sx={{ p: 3, bgcolor: theme.darkLight, border: `1px solid ${theme.darker}` }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SendIcon sx={{ color: theme.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text }}>
                  Sacar
                </Typography>
              </Box>
              <TextField
                type="number"
                placeholder="Valor"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={submitting}
                slotProps={{
                  input: {
                    step: '0.01',
                    min: '0',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: theme.text,
                    '& fieldset': { borderColor: theme.darker },
                    '&:hover fieldset': { borderColor: theme.primary },
                  },
                  '& .MuiOutlinedInput-input::placeholder': { color: theme.textTertiary, opacity: 0.7 },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleWithdraw}
                disabled={submitting || !withdrawAmount}
                sx={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                  fontWeight: 700,
                }}
              >
                {submitting ? <CircularProgress size={20} /> : 'Sacar'}
              </Button>
            </Stack>
          </Card>
        </Box>

        {/* Investments */}
        <Card sx={{ bgcolor: theme.darkLight, border: `1px solid ${theme.darker}` }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.darker}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text }}>
              Meus Investimentos
            </Typography>
          </Box>
          {investments.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: theme.textTertiary }}>
                Você ainda não tem investimentos. Comece agora!
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: `1px solid ${theme.darker}` }}>
                    <TableCell sx={{ color: theme.textSecondary, fontWeight: 600 }}>Cripto</TableCell>
                    <TableCell align="right" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                      Investido
                    </TableCell>
                    <TableCell align="right" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                      Rendimento
                    </TableCell>
                    <TableCell align="right" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                      Lucro
                    </TableCell>
                    <TableCell align="center" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                      Ação
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {investments.map((inv) => (
                    <TableRow
                      key={inv._id}
                      sx={{
                        borderBottom: `1px solid ${theme.darker}`,
                        '&:hover': { background: `rgba(59, 91, 219, 0.05)` },
                      }}
                    >
                      <TableCell sx={{ color: theme.text, fontWeight: 600 }}>
                        {inv.cryptoName || 'Cripto'}
                      </TableCell>
                      <TableCell align="right" sx={{ color: theme.text }}>
                        R$ {(inv.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: theme.primary, fontWeight: 600 }}>
                        {inv.yieldPercentage || 0}%
                      </TableCell>
                      <TableCell align="right" sx={{ color: theme.success, fontWeight: 600 }}>
                        R$ {(inv.lucroTotal || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedInvestment(inv);
                            setSellDialogOpen(true);
                          }}
                          sx={{
                            color: theme.danger,
                            borderColor: theme.danger,
                            '&:hover': { background: `rgba(239, 68, 68, 0.1)` },
                          }}
                        >
                          Vender
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        {/* Sell Dialog */}
        <Dialog open={sellDialogOpen} onClose={() => setSellDialogOpen(false)}>
          <DialogTitle sx={{ color: theme.text, bgcolor: theme.darkLight }}>
            Vender Investimento
          </DialogTitle>
          <DialogContent sx={{ bgcolor: theme.darkLight, color: theme.text }}>
            {selectedInvestment && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Tem certeza que deseja vender este investimento?
                </Typography>
                <Box sx={{ p: 2, bgcolor: theme.darker, borderRadius: '8px' }}>
                  <Typography variant="caption" sx={{ color: theme.textTertiary }}>
                    {selectedInvestment.cryptoName}
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.success, fontWeight: 700 }}>
                    R$ {(selectedInvestment.amount + selectedInvestment.lucroTotal).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: theme.darkLight, gap: 1 }}>
            <Button onClick={() => setSellDialogOpen(false)} sx={{ color: theme.text }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSellInvestment}
              variant="contained"
              sx={{ background: theme.success }}
            >
              Confirmar Venda
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageLayout>
  );
}
