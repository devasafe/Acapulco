import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  CircularProgress,
  Stack,
  FormControl,
  Radio,
  RadioGroup,
  Divider,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getCryptoById } from '../services/cryptoService';
import { investInCrypto } from '../services/investmentService';
import { getWallet } from '../services/walletService';
import CryptoChart from '../components/CryptoChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  success: '#10B981',
  danger: '#EF4444',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  darker: '#252D3D',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
};

function formatTimeUnit(days) {
  if (!days) return '';
  if (days === 30) return '30 dias';
  if (days === 90) return '3 meses';
  if (days === 180) return '6 meses';
  if (days === 365) return '1 ano';
  return `${days} dias`;
}

export default function CryptoDetailPage() {
  const { id } = useParams();
  const [crypto, setCrypto] = useState(null);
  const [investmentPlan, setInvestmentPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      getCryptoById(id),
      token ? getWallet(token) : Promise.resolve({ data: { wallet: 0 } })
    ])
      .then(([cryptoRes, walletRes]) => {
        setCrypto(cryptoRes.data);
        setWallet(walletRes.data.wallet || 0);
        if (cryptoRes.data.plans && cryptoRes.data.plans.length > 0) {
          setInvestmentPlan(String(cryptoRes.data.plans[0].period));
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar dados');
        setLoading(false);
      });
  }, [id]);

  const handleInvest = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Faça login para investir.');
      return;
    }

    try {
      setInvesting(true);
      await investInCrypto(crypto._id, priceNum, Number(investmentPlan), token);
      alert(`Investimento realizado com sucesso!`);
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao realizar investimento.');
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Container sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Container>
      </PageLayout>
    );
  }

  if (!crypto) {
    return (
      <PageLayout>
        <Container sx={{ py: 4 }}>
          <Alert severity="error">Criptmoeda não encontrada</Alert>
        </Container>
      </PageLayout>
    );
  }

  const selectedPlanObj = (crypto.plans || []).find(p => String(p.period) === investmentPlan) || null;
  const selectedYield = selectedPlanObj ? Number(selectedPlanObj.yieldPercentage) || 0 : 0;
  const priceNum = Number(crypto.price) || 0;
  const expectedProfit = Number((priceNum * selectedYield) / 100) || 0;
  const totalReturn = priceNum + expectedProfit;

  return (
    <PageLayout>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, color: theme.primary }}>
          Voltar
        </Button>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Crypto Hero Header with Background Image */}
        <Box
          sx={{
            mb: 3,
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            height: 350,
            background: `linear-gradient(135deg, rgba(59, 91, 219, 0.2), rgba(107, 70, 193, 0.2))`,
            border: `2px solid ${theme.primary}`,
            boxShadow: `0 20px 60px rgba(59, 91, 219, 0.2)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background Image */}
          {crypto.image && crypto.image.trim() ? (
            <Box
              component="img"
              src={`http://localhost:5000${crypto.image.startsWith('/') ? crypto.image : '/' + crypto.image}`}
              alt={crypto.name}
              crossOrigin="anonymous"
              onLoad={() => {
                console.log('Background image loaded successfully:', crypto.image);
              }}
              onError={(e) => {
                console.log('Background image failed to load:', crypto.image);
                e.target.style.opacity = '0.1';
              }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.7,
                zIndex: 0,
              }}
            />
          ) : null}

          {/* Overlay Gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, rgba(26, 31, 46, 0.85), rgba(26, 31, 46, 0.7))`,
              zIndex: 1,
            }}
          />

          {/* Content on top of image */}
          <Stack spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
            {/* Crypto Name & Symbol */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: theme.text,
                  mb: 1,
                  textShadow: `0 4px 12px rgba(0, 0, 0, 0.5)`,
                  letterSpacing: '-1px',
                }}
              >
                {crypto.name}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: theme.primary,
                  fontWeight: 700,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  textShadow: `0 2px 8px rgba(0, 0, 0, 0.5)`,
                }}
              >
                {crypto.symbol}
              </Typography>
            </Box>

            {/* Price */}
            <Box
              sx={{
                background: `rgba(59, 91, 219, 0.2)`,
                border: `2px solid ${theme.primary}`,
                borderRadius: '12px',
                px: 4,
                py: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="caption" sx={{ color: theme.textTertiary, display: 'block', mb: 0.5 }}>
                VALOR DO INVESTIMENTO
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: theme.success,
                  fontWeight: 900,
                }}
              >
                R$ {(Number(crypto.price) || 0).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Description Card */}
        {crypto.description && (
          <Card
            sx={{
              p: 3,
              mb: 3,
              bgcolor: theme.darkLight,
              border: `1px solid ${theme.darker}`,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.textSecondary,
                lineHeight: 1.8,
              }}
            >
              {crypto.description}
            </Typography>
          </Card>
        )}



        {/* Chart */}
        <Card sx={{ p: 2, mb: 3, bgcolor: theme.darkLight, border: `1px solid ${theme.darker}` }}>
          <CryptoChart symbol={crypto.symbol} />
        </Card>

        {/* Plans */}
        <Card sx={{ p: 3, mb: 3, bgcolor: theme.darkLight, border: `1px solid ${theme.darker}` }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.text, mb: 2 }}>
            Selecione o Plano
          </Typography>
          <FormControl fullWidth>
            <RadioGroup value={investmentPlan} onChange={(e) => setInvestmentPlan(e.target.value)}>
              <Stack spacing={1}>
                {(crypto.plans || []).map((plan, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setInvestmentPlan(String(plan.period))}
                    sx={{
                      p: 2,
                      border: `1px solid ${investmentPlan === String(plan.period) ? theme.primary : theme.darker}`,
                      borderRadius: '8px',
                      bgcolor: investmentPlan === String(plan.period) ? `${theme.primary}10` : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      '&:hover': {
                        borderColor: theme.primary,
                        bgcolor: `${theme.primary}08`,
                      }
                    }}
                  >
                    <Radio checked={investmentPlan === String(plan.period)} size="small" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.text }}>
                        {formatTimeUnit(plan.period)}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: theme.success, fontWeight: 700, fontSize: '0.9rem' }}>
                      +{plan.yieldPercentage}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
        </Card>

        {/* Summary */}
        <Card sx={{ p: 3, mb: 3, bgcolor: `${theme.primary}08`, border: `1px solid ${theme.primary}20` }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                Investimento
              </Typography>
              <Typography variant="body2" sx={{ color: theme.primary, fontWeight: 700 }}>
                R$ {priceNum.toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                Rendimento ({selectedYield}%)
              </Typography>
              <Typography variant="body2" sx={{ color: theme.success, fontWeight: 700 }}>
                +R$ {expectedProfit.toFixed(2)}
              </Typography>
            </Stack>
            <Divider sx={{ borderColor: `${theme.primary}30` }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600 }}>
                Total em {formatTimeUnit(investmentPlan)}
              </Typography>
              <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 800 }}>
                R$ {totalReturn.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Card>

        {/* Button */}
        {wallet < priceNum && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Saldo insuficiente! Você tem R$ {wallet.toFixed(2)} e precisa de R$ {priceNum.toFixed(2)}
            </Typography>
            <Button
              size="small"
              sx={{ mt: 1, color: theme.danger }}
              onClick={() => navigate('/wallet')}
            >
              Depositar agora
            </Button>
          </Alert>
        )}
        <Button
          fullWidth
          variant="contained"
          size="medium"
          onClick={handleInvest}
          disabled={investing || wallet < priceNum}
          startIcon={<TrendingUpIcon />}
          sx={{
            bgcolor: wallet < priceNum ? theme.textTertiary : theme.success,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover:not(:disabled)': {
              bgcolor: '#059669',
            },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {investing ? <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> : wallet < priceNum ? 'Saldo insuficiente' : 'Investir'}
        </Button>
      </Container>
    </PageLayout>
  );
}
