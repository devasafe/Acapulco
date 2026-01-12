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
  TextField,
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
  withdrawInvestment
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

// Função para gerar histórico de lucros (yield + referral_bonus)
const generateProfitHistory = (transactions, currentTotalProfit) => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  // Ordena transações por data (mais antigas primeiro)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Filtra apenas transações de lucro (redemption = resgate com lucro)
  const profitTransactions = sortedTransactions.filter(tx => 
    ['redemption', 'yield', 'referral_bonus'].includes(tx.type)
  );

  console.log('DEBUG Profit - Total transações:', sortedTransactions.length);
  console.log('DEBUG Profit - Tipos encontrados:', sortedTransactions.map(tx => tx.type));
  console.log('DEBUG Profit - Todas as transações:', sortedTransactions.map(tx => ({ type: tx.type, amount: tx.amount, description: tx.description })));
  console.log('DEBUG Profit - Transações de lucro (yield/referral_bonus):', profitTransactions.length);

  // Calcula o lucro acumulado a cada transação - UM PONTO POR TRANSAÇÃO
  let runningProfit = 0;
  const history = [{ periodo: 'Início', lucro: 0 }];
  
  profitTransactions.forEach((tx, idx) => {
    const amount = Number(tx.amount) || 0;
    runningProfit += amount;
    
    // Adiciona um ponto para cada transação de lucro
    history.push({
      periodo: `T${idx + 1}`,
      lucro: runningProfit,
    });
  });

  return history;
};

// Função para gerar histórico de carteira a partir de transações
const generateWalletHistory = (transactions, currentWallet) => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  console.log('DEBUG Wallet - Total de transações recebidas:', transactions.length);

  // Ordena transações por data (mais antigas primeiro)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Calcula o saldo em cada transação
  let runningBalance = 0;
  const history = [{ periodo: 'Início', saldo: 0 }];
  
  sortedTransactions.forEach((tx, idx) => {
    const amount = Number(tx.amount) || 0;
    // Somas as entradas, subtrai as saídas
    if (['deposit', 'referral_bonus', 'yield', 'redemption'].includes(tx.type)) {
      runningBalance += amount;
    } else if (['withdrawal', 'investment'].includes(tx.type)) {
      runningBalance -= amount;
    }
    
    console.log(`T${idx + 1}: tipo=${tx.type}, amount=${amount}, running=${runningBalance}`);
    
    // Adiciona um ponto para CADA transação
    history.push({
      periodo: `T${idx + 1}`,
      saldo: Math.max(0, runningBalance),
    });
  });

  return history;
};

// Função para gerar dados de gráfico com progressão e marcação de mudanças
const generateChartData = (finalValue, label = 'valor') => {
  if (!finalValue || finalValue <= 0) {
    return [{ period: 'Início', [label]: 0 }];
  }
  
  // Cria 5 pontos: início (0) e 4 períodos com incrementos
  const step = finalValue / 4;
  return [
    { period: 'Início', [label]: 0 },
    { period: 'P1', [label]: step },
    { period: 'P2', [label]: step * 2 },
    { period: 'P3', [label]: step * 3 },
    { period: 'Atual', [label]: finalValue },
  ];
};

// Componente reutilizável para cards de gráficos
const ChartCard = ({ title, children }) => (
  <Grid item xs={12} sm={6} md={4} lg={4}>
    <Card sx={{ p: 3, backgroundColor: theme.darkLight, border: `1px solid rgba(59, 91, 219, 0.15)`, borderRadius: '14px', height: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 24px rgba(59, 91, 219, 0.15)', borderColor: 'rgba(59, 91, 219, 0.3)' } }}>
      <Typography variant="h6" sx={{ mb: 2.5, fontSize: '0.95rem', color: theme.text, fontWeight: 700 }}>
        {title}
      </Typography>
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        {children}
      </Box>
    </Card>
  </Grid>
);

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
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(4);
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
      ])
        .then(([statsRes, invRes]) => {
          setStats(statsRes);
          setInvestments(Array.isArray(invRes) ? invRes : invRes.data || []);
          
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
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
              <Box sx={{ width: '100%' }}>
                <Typography variant="h6" sx={{ color: theme.text, fontWeight: 700, mb: 4 }}>
                  📊 Análise de Dados
                </Typography>
                <Grid container spacing={2.5} sx={{ width: '100%' }}>
                  {/* Gráfico 1: Evolução da Carteira */}
                  <ChartCard title="📈 Evolução da Carteira">
                    <ResponsiveContainer width={500} height={500}>
                      <AreaChart 
                        data={generateWalletHistory(stats.recentTransactions || [], Number(stats.wallet) || 0)}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="colorCarteira" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="periodo" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value) => `R$ ${value.toFixed(2)}`} />
                        <Area
                          type="monotone"
                          dataKey="saldo"
                          stroke="#10B981"
                          fillOpacity={1}
                          fill="url(#colorCarteira)"
                          strokeWidth={2}
                          dot={{ fill: '#10B981', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Gráfico 2: Ganhos Totais */}
                  <ChartCard title="💰 Lucros Realizados">
                    <ResponsiveContainer width={500} height={500}>
                      <AreaChart 
                        data={generateProfitHistory(stats.recentTransactions || [], Number(stats.totalRealizedProfit) || 0)}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="colorGanhos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="periodo" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value) => `R$ ${value.toFixed(2)}`} />
                        <Area
                          type="monotone"
                          dataKey="lucro"
                          stroke="#10B981"
                          fillOpacity={1}
                          fill="url(#colorGanhos)"
                          strokeWidth={2}
                          dot={{ fill: '#10B981', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Gráfico 3: Moedas Investidas */}
                  <ChartCard title="💎 Moedas Investidas">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <ResponsiveContainer width={220} height={500}>
                        <PieChart>
                          <Pie
                            data={(() => {
                              const cryptoMap = {};
                              investments.filter(i => i.status === 'active').forEach(inv => {
                                const cryptoName = inv.cryptoId?.symbol || inv.cryptoName || 'Outro';
                                cryptoMap[cryptoName] = (cryptoMap[cryptoName] || 0) + (Number(inv.amount) || 0);
                              });
                              return Object.entries(cryptoMap).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
                            })()}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                            cornerRadius={8}
                            stroke="none"
                          >
                            <Cell fill="#3B5BDB" />
                            <Cell fill="#10B981" />
                            <Cell fill="#F59E0B" />
                            <Cell fill="#EF4444" />
                            <Cell fill="#7C3AED" />
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </ChartCard>

                  {/* Gráfico 4: Resumo de Transações */}
                  <ChartCard title="📊 Resumo de Transações">
                    <ResponsiveContainer width={220} height={500}>
                      <BarChart 
                        data={[
                          { 
                            tipo: 'Total', 
                            entrada: (stats.recentTransactions || [])
                              .filter(t => t.type === 'deposit')
                              .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
                            saida: (stats.recentTransactions || [])
                              .filter(t => t.type === 'withdrawal')
                              .reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
                          }
                        ]} 
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="tipo" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value) => `R$ ${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="entrada" name="Depósito" fill="#10B981" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="saida" name="Saque" fill="#EF4444" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Gráfico 5: Criptos por Status */}
                  <ChartCard title="👥 Criptos por Status">
                    <ResponsiveContainer width={500} height={500}>
                      <BarChart 
                        data={[
                          { status: 'Ativas', count: investments.filter((i) => i.status === 'active').length },
                          { status: 'Completas', count: investments.filter((i) => i.status === 'completed').length },
                          { status: 'Resgatadas', count: investments.filter((i) => i.status === 'withdrawn').length },
                        ]}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="status" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                        <Bar dataKey="count" fill="#3B5BDB" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>


                  {/* Gráfico 6: Fluxo de Pessoas Ativas */}
                  <ChartCard title="👥 Fluxo de Pessoas Ativas">
                    <ResponsiveContainer width={500} height={500}>
                      <AreaChart 
                        data={[
                          { mes: 'Semana 1', pessoas: Math.max(0, (stats.activeReferrals || 0) - 2) },
                          { mes: 'Semana 2', pessoas: Math.max(0, (stats.activeReferrals || 0) - 1) },
                          { mes: 'Semana 3', pessoas: (stats.activeReferrals || 0) },
                          { mes: 'Hoje', pessoas: (stats.activeReferrals || 0) },
                        ]}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="colorReferrals" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="mes" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value) => `${Math.round(value)} pessoas`} />
                        <Area
                          type="monotone"
                          dataKey="pessoas"
                          stroke="#F59E0B"
                          fillOpacity={1}
                          fill="url(#colorReferrals)"
                          strokeWidth={2}
                          dot={{ fill: '#F59E0B', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </Grid>
              </Box>
            )}
          </Box>
        </Card>
      </Container>

    </PageLayout>
  );
}




