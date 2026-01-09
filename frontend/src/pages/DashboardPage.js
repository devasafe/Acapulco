import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
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
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Collapse,
  LinearProgress,
} from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PageLayout from '../components/PageLayout';
import { 
  getMyInvestments,
  getDashboardStats, 
  createInvestment, 
  withdrawInvestment,
  getAllCryptos 
} from '../services/apiService';
import { deposit, withdraw } from '../services/walletService';
import { getToken } from '../utils/auth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  darker: '#252D3D',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
};

// Função para calcular tempo restante do investimento
const calculateRemainingTime = (investment) => {
  if (!investment.createdAt || !investment.investmentPlan) return null;
  
  const createdDate = new Date(investment.createdAt);
  const planDays = Number(investment.investmentPlan) || 0;
  const endDate = new Date(createdDate.getTime() + planDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const remaining = Math.max(0, endDate.getTime() - now.getTime());
  
  if (remaining === 0) {
    return { text: 'Finalizado', days: 0, hours: 0, minutes: 0, percentage: 100 };
  }
  
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const percentage = Math.round(((planDays * 24 * 60 * 60 * 1000 - remaining) / (planDays * 24 * 60 * 60 * 1000)) * 100);
  
  return { text: `${days}d ${hours}h ${minutes}m`, days, hours, minutes, percentage };
};

// Função para traduzir e colorir tipos de transação
const getTransactionStyle = (type) => {
  const styles = {
    deposit: { label: 'Depósito', color: theme.success, icon: ArrowUpwardIcon, bgColor: `rgba(16, 185, 129, 0.1)` },
    withdrawal: { label: 'Saque', color: theme.error, icon: ArrowDownwardIcon, bgColor: `rgba(239, 68, 68, 0.1)` },
    investment: { label: 'Investimento', color: theme.primary, icon: TrendingUpIcon, bgColor: `rgba(59, 91, 219, 0.1)` },
    referral_bonus: { label: 'Bônus de Referência', color: theme.warning, icon: StarIcon, bgColor: `rgba(245, 158, 11, 0.1)` },
    redemption: { label: 'Resgate', color: theme.secondary, icon: TrendingUpIcon, bgColor: `rgba(107, 70, 193, 0.1)` },
    yield: { label: 'Lucro', color: theme.success, icon: TrendingUpIcon, bgColor: `rgba(16, 185, 129, 0.1)` },
  };
  return styles[type] || { label: type, color: theme.textSecondary, icon: SendIcon, bgColor: `rgba(148, 163, 184, 0.1)` };
};

export default function DashboardPage() {
  const token = getToken();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    wallet: 0,
    totalInvested: 0,
    totalExpectedProfit: 0,
    activeInvestments: 0,
    completedInvestments: 0,
    withdrawnInvestments: 0,
    recentTransactions: [],
  });
  const [investments, setInvestments] = useState([]);
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [investmentDialog, setInvestmentDialog] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState('');
  const [walletSuccess, setWalletSuccess] = useState('');
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [expandedInvestment, setExpandedInvestment] = useState(null);

  useEffect(() => {
    if (token) {
      Promise.all([
        getDashboardStats(token),
        getMyInvestments(token),
        getAllCryptos(token),
      ])
        .then(([statsRes, invRes, cryptoRes]) => {
          setStats(statsRes);
          setInvestments(Array.isArray(invRes) ? invRes : invRes.data || []);
          setCryptos(Array.isArray(cryptoRes) ? cryptoRes : cryptoRes.data || []);
          
          // Calcular total sacado
          const transactions = statsRes.recentTransactions || [];
          const totalSacado = transactions
            .filter(tx => tx.type === 'withdrawal')
            .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
          setTotalWithdrawn(totalSacado);
          
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [token]);

  const handleInvest = async () => {
    if (!selectedCrypto || !investmentAmount) return;

    try {
      await createInvestment({ cryptoId: selectedCrypto, amount: Number(investmentAmount) }, token);
      setInvestmentDialog(false);
      setSelectedCrypto('');
      setInvestmentAmount('');
      // Refresh
      const newStats = await getDashboardStats(token);
      const newInvestments = await getMyInvestments(token);
      setStats(newStats);
      setInvestments(newInvestments);
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao investir');
    }
  };

  const handleWithdraw = async (investmentId) => {
    if (!window.confirm('Deseja fazer o resgate deste investimento?')) return;

    try {
      await withdrawInvestment({ investmentId }, token);
      const newStats = await getDashboardStats(token);
      const newInvestments = await getMyInvestments(token);
      setStats(newStats);
      setInvestments(newInvestments);
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao resgatar');
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      setWalletError('Digite um valor válido');
      return;
    }

    setWalletLoading(true);
    setWalletError('');
    setWalletSuccess('');

    try {
      const response = await deposit(Number(depositAmount), token);
      setStats({ ...stats, wallet: response.data.wallet });
      setDepositAmount('');
      setWalletSuccess(`Depósito de R$ ${Number(depositAmount).toFixed(2)} realizado!`);
      setTimeout(() => setWalletSuccess(''), 3000);
    } catch (err) {
      setWalletError(err.response?.data?.error || 'Erro ao depositar');
    } finally {
      setWalletLoading(false);
    }
  };

  const handleWalletWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setWalletError('Digite um valor válido');
      return;
    }

    if (Number(withdrawAmount) > stats.wallet) {
      setWalletError('Saldo insuficiente');
      return;
    }

    setWalletLoading(true);
    setWalletError('');
    setWalletSuccess('');

    try {
      const response = await withdraw(Number(withdrawAmount), token);
      setStats({ ...stats, wallet: response.data.wallet });
      setWithdrawAmount('');
      setWalletSuccess(`Saque de R$ ${Number(withdrawAmount).toFixed(2)} realizado!`);
      setTimeout(() => setWalletSuccess(''), 3000);
    } catch (err) {
      setWalletError(err.response?.data?.error || 'Erro ao sacar');
    } finally {
      setWalletLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <Typography>Carregando...</Typography>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                background: `linear-gradient(135deg, rgba(59, 91, 219, 0.1) 0%, rgba(107, 70, 193, 0.05) 100%)`,
                border: `1px solid rgba(59, 91, 219, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.textSecondary, fontSize: '0.7rem' }}>
                    Carteira
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 700, mt: 0.5 }}>
                    R$ {(Number(stats.wallet) || 0).toFixed(2)}
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon sx={{ color: theme.primary, fontSize: 28 }} />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                background: `linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)`,
                border: `1px solid rgba(16, 185, 129, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.textSecondary, fontSize: '0.7rem' }}>
                    Investido
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.success, fontWeight: 700, mt: 0.5 }}>
                    R$ {(Number(stats.totalInvested) || 0).toFixed(2)}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: theme.success, fontSize: 28 }} />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                background: `linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)`,
                border: `1px solid rgba(245, 158, 11, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.textSecondary, fontSize: '0.7rem' }}>
                    Lucro Realizado
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.warning, fontWeight: 700, mt: 0.5 }}>
                    R$ {(Number(stats.totalRealizedProfit) || 0).toFixed(2)}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ color: theme.warning, fontSize: 28 }} />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                background: `linear-gradient(135deg, rgba(107, 70, 193, 0.1) 0%, rgba(107, 70, 193, 0.05) 100%)`,
                border: `1px solid rgba(107, 70, 193, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.textSecondary, fontSize: '0.7rem' }}>
                    Indicados
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.secondary, fontWeight: 700, mt: 0.5 }}>
                    {stats.activeReferrals || 0}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ color: theme.secondary, fontSize: 28 }} />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                background: `linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)`,
                border: `1px solid rgba(239, 68, 68, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.textSecondary, fontSize: '0.7rem' }}>
                    Total Sacado
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#EF4444', fontWeight: 700, mt: 0.5 }}>
                    R$ {totalWithdrawn.toFixed(2)}
                  </Typography>
                </Box>
                <SendIcon sx={{ color: '#EF4444', fontSize: 28 }} />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 2,
                background: `linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)`,
                border: `1px solid rgba(34, 197, 94, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.textSecondary, fontSize: '0.7rem' }}>
                    Ganho por Indicação
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#22C55E', fontWeight: 700, mt: 0.5 }}>
                    R$ {(Number(stats.totalReferralBonus) || 0).toFixed(2)}
                  </Typography>
                </Box>
                <StarIcon sx={{ color: '#22C55E', fontSize: 28 }} />
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card
          sx={{
            background: `rgba(26, 31, 46, 0.5)`,
            border: `1px solid rgba(59, 91, 219, 0.1)`,
            borderRadius: '12px',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: `1px solid rgba(59, 91, 219, 0.1)`,
              '& .MuiTab-root': { color: theme.textSecondary },
              '& .Mui-selected': { color: theme.primary },
            }}
          >
            <Tab label="Carteira" />
            <Tab label="Investimentos Ativos" />
            <Tab label="Histórico" />
            <Tab label="Transações" />
            <Tab label="📊 Gráficos" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Tab 0: Carteira */}
            {tabValue === 0 && (
              <Box>
                {walletError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setWalletError('')}>{walletError}</Alert>}
                {walletSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setWalletSuccess('')}>{walletSuccess}</Alert>}

                <Grid container spacing={3}>
                  {/* Deposit Card */}
                  <Grid item xs={12} md={6}>
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
                          disabled={walletLoading}
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
                          }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleDeposit}
                          disabled={walletLoading}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.success} 0%, #059669 100%)`,
                            fontWeight: 700,
                          }}
                        >
                          {walletLoading ? <CircularProgress size={20} /> : 'Depositar'}
                        </Button>
                      </Stack>
                    </Card>
                  </Grid>

                  {/* Withdraw Card */}
                  <Grid item xs={12} md={6}>
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
                          disabled={walletLoading}
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
                          }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleWalletWithdraw}
                          disabled={walletLoading}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                            fontWeight: 700,
                          }}
                        >
                          {walletLoading ? <CircularProgress size={20} /> : 'Sacar'}
                        </Button>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab 1: Investimentos Ativos */}
            {tabValue === 1 && (
              <Box>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: theme.text, fontWeight: 700 }}>
                    Meus Investimentos Ativos
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/cryptos')}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                    }}
                  >
                    Novo Investimento
                  </Button>
                </Box>

                {investments.filter((i) => i.status === 'active').length === 0 ? (
                  <Card sx={{ p: 4, bgcolor: theme.darkLight, border: `1px solid ${theme.darker}`, textAlign: 'center' }}>
                    <Typography color="textSecondary">
                      Nenhum investimento ativo. Comece a investir agora!
                    </Typography>
                  </Card>
                ) : (
                  <Stack spacing={2}>
                    {investments
                      .filter((i) => i.status === 'active')
                      .map((inv) => {
                        const remainingTime = calculateRemainingTime(inv);
                        const isExpanded = expandedInvestment === inv._id;
                        const totalReturn = Number(inv.amount) + Number(inv.expectedProfit);
                        
                        return (
                          <Card
                            key={inv._id}
                            onClick={() => setExpandedInvestment(isExpanded ? null : inv._id)}
                            sx={{
                              bgcolor: theme.darkLight,
                              border: `1px solid ${isExpanded ? theme.primary : theme.darker}`,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                border: `1px solid ${theme.primary}`,
                                boxShadow: `0 4px 20px rgba(59, 91, 219, 0.2)`,
                              }
                            }}
                          >
                            {/* Header */}
                            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                {isExpanded ? <ExpandLessIcon sx={{ color: theme.primary, fontSize: 24 }} /> : <ExpandMoreIcon sx={{ color: theme.primary, fontSize: 24 }} />}
                                <Box>
                                  <Typography sx={{ color: theme.text, fontWeight: 700, fontSize: '1.1rem' }}>
                                    {inv.cryptoName || 'Desconhecido'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: theme.textTertiary }}>
                                    Período: {inv.investmentPlan} dias
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="caption" sx={{ color: theme.textTertiary, display: 'block' }}>
                                    Investido
                                  </Typography>
                                  <Typography sx={{ color: theme.primary, fontWeight: 700, fontSize: '1rem' }}>
                                    R$ {(Number(inv.amount) || 0).toFixed(2)}
                                  </Typography>
                                </Box>

                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="caption" sx={{ color: theme.textTertiary, display: 'block' }}>
                                    Rendimento
                                  </Typography>
                                  <Typography sx={{ color: theme.success, fontWeight: 700, fontSize: '1rem' }}>
                                    {inv.yieldPercentage}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>

                            {/* Divider */}
                            {isExpanded && <Box sx={{ height: '1px', background: `rgba(59, 91, 219, 0.1)` }} />}

                            {/* Expanded Content */}
                            <Collapse in={isExpanded} timeout="auto">
                              <Box sx={{ p: 3, background: `rgba(59, 91, 219, 0.05)` }}>
                                <Stack spacing={3}>
                                  {/* Section 1: Tempo e Lucro */}
                                  <Box>
                                    <Box sx={{ mb: 2 }}>
                                      <Typography variant="caption" sx={{ color: theme.textTertiary, textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1 }}>
                                        📋 Resumo do Investimento
                                      </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={6}>
                                        <Box sx={{ 
                                          p: 2, 
                                          background: `rgba(245, 158, 11, 0.08)`,
                                          border: `1px solid rgba(245, 158, 11, 0.2)`,
                                          borderRadius: '8px'
                                        }}>
                                          <Typography variant="caption" sx={{ color: theme.textTertiary, textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>
                                            ⏱️ Tempo Restante
                                          </Typography>
                                          <Typography sx={{ color: theme.warning, fontWeight: 700, fontSize: '1.3rem', mt: 1 }}>
                                            {remainingTime?.text}
                                          </Typography>
                                        </Box>
                                      </Grid>

                                      <Grid item xs={12} sm={6}>
                                        <Box sx={{ 
                                          p: 2, 
                                          background: `rgba(16, 185, 129, 0.08)`,
                                          border: `1px solid rgba(16, 185, 129, 0.2)`,
                                          borderRadius: '8px'
                                        }}>
                                          <Typography variant="caption" sx={{ color: theme.textTertiary, textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>
                                            💰 Lucro Esperado
                                          </Typography>
                                          <Typography sx={{ color: theme.success, fontWeight: 700, fontSize: '1.3rem', mt: 1 }}>
                                            +R$ {(Number(inv.expectedProfit) || 0).toFixed(2)}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Box>

                                  {/* Divider */}
                                  <Box sx={{ height: '1px', background: `rgba(59, 91, 219, 0.1)` }} />

                                  {/* Section 2: Progresso */}
                                  <Box>
                                    <Box sx={{ mb: 2 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="caption" sx={{ color: theme.textTertiary, textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1 }}>
                                          📊 Progresso
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: theme.primary, fontWeight: 700, fontSize: '0.85rem' }}>
                                          {remainingTime?.percentage || 0}%
                                        </Typography>
                                      </Box>
                                    </Box>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={remainingTime?.percentage || 0}
                                      sx={{
                                        height: 10,
                                        borderRadius: '6px',
                                        background: `rgba(59, 91, 219, 0.1)`,
                                        '& .MuiLinearProgress-bar': {
                                          background: `linear-gradient(90deg, ${theme.primary}, ${theme.success})`,
                                          borderRadius: '6px',
                                        }
                                      }}
                                    />
                                  </Box>

                                  {/* Divider */}
                                  <Box sx={{ height: '1px', background: `rgba(59, 91, 219, 0.1)` }} />

                                  {/* Section 3: Datas */}
                                  <Box>
                                    <Box sx={{ mb: 2 }}>
                                      <Typography variant="caption" sx={{ color: theme.textTertiary, textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1 }}>
                                        📅 Cronograma
                                      </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={6}>
                                        <Box sx={{ 
                                          p: 2, 
                                          background: theme.darker,
                                          border: `1px solid ${theme.primary}20`,
                                          borderRadius: '8px'
                                        }}>
                                          <Typography variant="caption" sx={{ color: theme.textTertiary, fontSize: '0.7rem', fontWeight: 600 }}>
                                            Data de Início
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: theme.text, mt: 1, fontWeight: 600, fontSize: '1rem' }}>
                                            {new Date(inv.createdAt).toLocaleDateString('pt-BR', { 
                                              year: 'numeric', 
                                              month: 'long', 
                                              day: 'numeric'
                                            })}
                                          </Typography>
                                        </Box>
                                      </Grid>

                                      <Grid item xs={12} sm={6}>
                                        <Box sx={{ 
                                          p: 2, 
                                          background: `rgba(16, 185, 129, 0.08)`,
                                          border: `1px solid rgba(16, 185, 129, 0.2)`,
                                          borderRadius: '8px'
                                        }}>
                                          <Typography variant="caption" sx={{ color: theme.textTertiary, fontSize: '0.7rem', fontWeight: 600 }}>
                                            Total ao Vencimento
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: theme.success, mt: 1, fontWeight: 700, fontSize: '1.1rem' }}>
                                            R$ {totalReturn.toFixed(2)}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Box>

                                  {/* Divider */}
                                  <Box sx={{ height: '1px', background: `rgba(59, 91, 219, 0.1)` }} />

                                  {/* Section 4: Resumo */}
                                  <Box>
                                    <Box sx={{ mb: 2 }}>
                                      <Typography variant="caption" sx={{ color: theme.textTertiary, textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1 }}>
                                        💳 Detalhes Financeiros
                                      </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={4}>
                                        <Box sx={{ 
                                          p: 2, 
                                          background: `rgba(59, 91, 219, 0.08)`,
                                          border: `1px solid rgba(59, 91, 219, 0.2)`,
                                          borderRadius: '8px',
                                          textAlign: 'center'
                                        }}>
                                          <Typography variant="caption" sx={{ color: theme.textTertiary, fontSize: '0.65rem', fontWeight: 600 }}>
                                            Investimento
                                          </Typography>
                                          <Typography sx={{ color: theme.primary, fontWeight: 700, mt: 1, fontSize: '1rem' }}>
                                            R$ {(Number(inv.amount) || 0).toFixed(2)}
                                          </Typography>
                                        </Box>
                                      </Grid>

                                      <Grid item xs={12} sm={4}>
                                        <Box sx={{ 
                                          p: 2, 
                                          background: `rgba(16, 185, 129, 0.08)`,
                                          border: `1px solid rgba(16, 185, 129, 0.2)`,
                                          borderRadius: '8px',
                                          textAlign: 'center'
                                        }}>
                                          <Typography variant="caption" sx={{ color: theme.textTertiary, fontSize: '0.65rem', fontWeight: 600 }}>
                                            Rendimento
                                          </Typography>
                                          <Typography sx={{ color: theme.success, fontWeight: 700, mt: 1, fontSize: '1rem' }}>
                                            {inv.yieldPercentage}%
                                          </Typography>
                                        </Box>
                                      </Grid>

                                      <Grid item xs={12} sm={4}>
                                        <Box sx={{ 
                                          p: 2, 
                                          background: `rgba(107, 70, 193, 0.08)`,
                                          border: `1px solid rgba(107, 70, 193, 0.2)`,
                                          borderRadius: '8px',
                                          textAlign: 'center'
                                        }}>
                                          <Typography variant="caption" sx={{ color: theme.textTertiary, fontSize: '0.65rem', fontWeight: 600 }}>
                                            Período
                                          </Typography>
                                          <Typography sx={{ color: theme.secondary, fontWeight: 700, mt: 1, fontSize: '1rem' }}>
                                            {inv.investmentPlan}d
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Box>

                                  {/* Divider */}
                                  <Box sx={{ height: '1px', background: `rgba(59, 91, 219, 0.1)` }} />

                                  {/* Section 5: Botão Resgatar */}
                                  <Button
                                    fullWidth
                                    color="error"
                                    variant="outlined"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleWithdraw(inv._id);
                                    }}
                                    sx={{
                                      p: 1.5,
                                      borderColor: theme.error,
                                      color: theme.error,
                                      fontWeight: 700,
                                      fontSize: '1rem',
                                      transition: 'all 0.3s',
                                      '&:hover': {
                                        backgroundColor: `rgba(239, 68, 68, 0.1)`,
                                        borderColor: theme.error,
                                        color: theme.error,
                                      }
                                    }}
                                  >
                                    💸 Resgatar Agora
                                  </Button>
                                </Stack>
                              </Box>
                            </Collapse>
                          </Card>
                        );
                      })}
                  </Stack>
                )}
              </Box>
            )}

            {/* Tab 2: Histórico */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ color: theme.text, fontWeight: 700, mb: 3 }}>
                  Histórico de Investimentos
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                        <TableCell sx={{ color: theme.textSecondary }}>Cripto</TableCell>
                        <TableCell align="right" sx={{ color: theme.textSecondary }}>
                          Valor
                        </TableCell>
                        <TableCell sx={{ color: theme.textSecondary }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {investments.map((inv) => (
                        <TableRow key={inv._id} sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                          <TableCell sx={{ color: theme.text }}>{inv.cryptoName}</TableCell>
                          <TableCell align="right" sx={{ color: theme.primary }}>
                            R$ {(Number(inv.amount) || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '4px',
                                background:
                                  inv.status === 'active'
                                    ? `rgba(16, 185, 129, 0.2)`
                                    : `rgba(239, 68, 68, 0.2)`,
                                color:
                                  inv.status === 'active' ? theme.success : theme.error,
                              }}
                            >
                              {inv.status === 'active' ? 'Ativo' : 'Finalizado'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 3: Transações */}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" sx={{ color: theme.text, fontWeight: 700, mb: 3 }}>
                  Transações Recentes
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                        <TableCell sx={{ color: theme.textSecondary }}>Tipo</TableCell>
                        <TableCell sx={{ color: theme.textSecondary }}>Descrição</TableCell>
                        <TableCell align="right" sx={{ color: theme.textSecondary }}>
                          Valor
                        </TableCell>
                        <TableCell sx={{ color: theme.textSecondary }}>Data</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recentTransactions.map((tx) => {
                        const txStyle = getTransactionStyle(tx.type);
                        const IconComponent = txStyle.icon;
                        return (
                          <TableRow key={tx._id} sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)`, '&:hover': { background: `rgba(59, 91, 219, 0.05)` } }}>
                            <TableCell sx={{ color: theme.text }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 36,
                                    height: 36,
                                    borderRadius: '8px',
                                    background: txStyle.bgColor,
                                  }}
                                >
                                  <IconComponent sx={{ color: txStyle.color, fontSize: 18 }} />
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: txStyle.color }}>
                                  {txStyle.label}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: theme.textSecondary }}>{tx.description}</TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: tx.type === 'withdrawal' ? theme.error : txStyle.color,
                                fontWeight: 700,
                              }}
                            >
                              {tx.type === 'withdrawal' ? '- ' : '+ '}R$ {(Number(tx.amount) || 0).toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ color: theme.textSecondary }}>
                              {new Date(tx.createdAt).toLocaleDateString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 4: Gráficos */}
            {tabValue === 4 && (
              <Box>
                <Typography variant="h6" sx={{ color: theme.text, fontWeight: 700, mb: 3 }}>
                  📊 Análise de Dados
                </Typography>
                <Grid container spacing={3}>
                  {/* Gráfico 1: Evolução da Carteira */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, backgroundColor: theme.darkLight, height: '240px' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.textTertiary }}>
                        📈 Evolução da Carteira
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart 
                          data={[
                            { month: 'Inicial', value: 0 },
                            { month: 'Atual', value: Number(stats.wallet) || 0 },
                          ]} 
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorCarteira" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px' }} />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10B981"
                            fillOpacity={1}
                            fill="url(#colorCarteira)"
                            strokeWidth={2}
                            dot={{ fill: '#10B981', r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  {/* Gráfico 2: Ganhos ao Longo do Tempo */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, backgroundColor: theme.darkLight, height: '240px' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.textTertiary }}>
                        � Ganhos Totais
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart 
                          data={[
                            { month: 'Inicial', ganho: 0 },
                            { month: 'Atual', ganho: Number(stats.totalExpectedProfit) || 0 },
                          ]} 
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorGanhos" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px' }} />
                          <Area
                            type="monotone"
                            dataKey="ganho"
                            stroke="#F59E0B"
                            fillOpacity={1}
                            fill="url(#colorGanhos)"
                            strokeWidth={2}
                            dot={{ fill: '#F59E0B', r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  {/* Gráfico 3: Composição de Investimentos (Donut) */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, backgroundColor: theme.darkLight, height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.textTertiary, width: '100%', textAlign: 'center' }}>
                        � Moedas Investidas
                      </Typography>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={(() => {
                              const cryptoMap = {};
                              investments.forEach(inv => {
                                const cryptoName = inv.cryptoId?.symbol || inv.cryptoName || 'Outro';
                                cryptoMap[cryptoName] = (cryptoMap[cryptoName] || 0) + (Number(inv.amount) || 0);
                              });
                              return Object.entries(cryptoMap).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
                            })()}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={8}
                            dataKey="value"
                            cornerRadius={12}
                            stroke="none"
                          >
                            <Cell fill="#3B5BDB" />
                            <Cell fill="#10B981" />
                            <Cell fill="#F59E0B" />
                            <Cell fill="#EF4444" />
                            <Cell fill="#7C3AED" />
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  {/* Gráfico 4: Resumo de Transações */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, backgroundColor: theme.darkLight, height: '240px' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.textTertiary }}>
                        📊 Resumo de Transações
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart 
                          data={[
                            { 
                              tipo: 'Total', 
                              entrada: (stats.recentTransactions || [])
                                .filter(t => ['deposit', 'referral_bonus'].includes(t.type))
                                .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
                              saida: (stats.recentTransactions || [])
                                .filter(t => ['withdrawal', 'investment'].includes(t.type))
                                .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
                            }
                          ]} 
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="tipo" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px' }} />
                          <Legend />
                          <Bar dataKey="entrada" fill="#10B981" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="saida" fill="#EF4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  {/* Gráfico 5: Investidores por Status */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, backgroundColor: theme.darkLight, height: '240px' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.textTertiary }}>
                        👥 Investimentos por Status
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart 
                          data={[
                            { status: 'Ativos', count: stats.activeInvestments || 0 },
                            { status: 'Completos', count: stats.completedInvestments || 0 },
                            { status: 'Resgatados', count: stats.withdrawnInvestments || 0 },
                          ]}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="status" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px' }} />
                          <Bar dataKey="count" fill="#3B5BDB" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  {/* Gráfico 6: Investimento Total */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, backgroundColor: theme.darkLight, height: '240px' }}>
                      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.textTertiary }}>
                        💵 Investimento Total
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart 
                          data={[
                            { label: 'Inicial', total: 0 },
                            { label: 'Investido', total: Number(stats.totalInvested) || 0 },
                          ]}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorInvestimento" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="label" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px' }} />
                          <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#7C3AED"
                            fillOpacity={1}
                            fill="url(#colorInvestimento)"
                            strokeWidth={2}
                            dot={{ fill: '#7C3AED', r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Card>
      </Container>

      {/* Investment Dialog */}
      <Dialog open={investmentDialog} onClose={() => setInvestmentDialog(false)}>
        <DialogTitle sx={{ background: theme.darkLight, color: theme.text }}>
          Novo Investimento
        </DialogTitle>
        <DialogContent sx={{ background: theme.darkLight }}>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Selecione uma Criptmoeda"
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
            >
              {cryptos.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name} ({c.symbol}) - R$ {(Number(c.price) || 0).toFixed(2)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Valor (R$)"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              inputProps={{ step: 0.01, min: 0 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ background: theme.darkLight }}>
          <Button onClick={() => setInvestmentDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleInvest}>
            Investir
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}



