import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getAllCryptos } from '../services/apiService';
import { getToken } from '../utils/auth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  success: '#10B981',
  warning: '#F59E0B',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
};

export default function CryptoListPage() {
  const token = getToken();
  const navigate = useNavigate();
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCryptos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Public endpoint - no token needed
      const data = await getAllCryptos(token);
      setCryptos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar criptmoedas:', err);
      setError('Erro ao carregar criptmoedas. Tente novamente.');
      setCryptos([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCryptos();
  }, [loadCryptos]);

  // Debug: log image data
  useEffect(() => {
    if (cryptos.length > 0) {
      console.log('Cryptos loaded:', cryptos.map(c => ({
        name: c.name,
        image: c.image,
        hasImage: !!c.image
      })));
    }
  }, [cryptos]);

  const handleInvest = (cryptoId) => {
    navigate(`/cryptos/${cryptoId}`);
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

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6, position: 'relative', zIndex: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CurrencyBitcoinIcon sx={{ fontSize: 40, color: theme.primary }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.text }}>
              Criptmoedas Disponíveis
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: theme.textSecondary, maxWidth: '600px' }}>
            Escolha uma criptmoeda e invista agora. Obtenha rendimentos baseado no período e taxa selecionados.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {cryptos.length === 0 ? (
          <Card sx={{ p: 4, background: `rgba(26, 31, 46, 0.6)`, border: `1px solid rgba(59, 91, 219, 0.2)`, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.textSecondary }}>
              Nenhuma criptmoeda disponível no momento.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: '.swiper-next',
                prevEl: '.swiper-prev',
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1400: { slidesPerView: 4 },
              }}
              sx={{
                pb: 6,
                pt: 2,
                '& .swiper-pagination': {
                  bottom: '0 !important',
                  position: 'static !important',
                  mt: 2,
                },
              }}
            >
              {cryptos.map((crypto) => (
                <SwiperSlide key={crypto._id}>
                  <Card
                    sx={{
                      p: 3,
                      mt: 2,
                      height: '100%',
                      background: `rgba(26, 31, 46, 0.6)`,
                      border: `1px solid rgba(59, 91, 219, 0.2)`,
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      position: 'relative',
                      '&:hover': {
                        border: `1px solid ${theme.primary}`,
                        boxShadow: `0 0 20px rgba(59, 91, 219, 0.2)`,
                        transform: 'translateY(-4px)',
                        zIndex: 100,
                      },
                    }}
                  >
                    {/* Crypto Image or Icon */}
                    <Box sx={{ mb: 3, position: 'relative', height: 120, overflow: 'hidden', borderRadius: '8px' }}>
                      {crypto.image && crypto.image.trim() ? (
                        <img
                          key={crypto._id}
                          src={`http://localhost:5000${crypto.image.startsWith('/') ? crypto.image : '/' + crypto.image}`}
                          alt={crypto.name}
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.log('Image failed to load:', crypto.image);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', crypto.image);
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : null}
                      {!crypto.image || !crypto.image.trim() ? (
                        <Box sx={{
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(135deg, rgba(59, 91, 219, 0.2), rgba(107, 70, 193, 0.2))`,
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <CurrencyBitcoinIcon sx={{ fontSize: 48, color: theme.primary, opacity: 0.5 }} />
                        </Box>
                      ) : null}
                    </Box>

                    {/* Crypto Info */}
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text, mb: 0.5 }}>
                          {crypto.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.primary, fontWeight: 600 }}>
                          {crypto.symbol}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.warning, fontWeight: 700, mt: 0.5 }}>
                          R$ {(Number(crypto.price) || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ height: '1px', background: `rgba(59, 91, 219, 0.1)`, mb: 3 }} />

                    {/* Details */}
                    <Box sx={{ mb: 3, flex: 1 }}>
                      {/* Planos */}
                      <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 1.5, fontWeight: 600 }}>
                        Planos Disponíveis
                      </Typography>
                      {crypto.plans && crypto.plans.map((plan, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1.5,
                            p: 1.5,
                            background: `rgba(16, 185, 129, 0.05)`,
                            borderRadius: '8px',
                            border: `1px solid rgba(16, 185, 129, 0.2)`,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600 }}>
                              {plan.period} dias
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                              Período
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUpIcon sx={{ color: theme.success, fontSize: 18 }} />
                            <Typography variant="h6" sx={{ color: theme.success, fontWeight: 700 }}>
                              {plan.yieldPercentage}%
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {/* Action Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleInvest(crypto._id)}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          opacity: 0.9,
                        },
                      }}
                    >
                      Investir Agora
                    </Button>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons - Below Swiper */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <IconButton
                className="swiper-prev"
                sx={{
                  background: `rgba(59, 91, 219, 0.2)`,
                  color: theme.text,
                  '&:hover': {
                    background: `rgba(59, 91, 219, 0.4)`,
                  },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>

              <IconButton
                className="swiper-next"
                sx={{
                  background: `rgba(59, 91, 219, 0.2)`,
                  color: theme.text,
                  '&:hover': {
                    background: `rgba(59, 91, 219, 0.4)`,
                  },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {/* Alternative Table View */}
        {cryptos.length > 0 && (
          <Card sx={{ mt: 4, background: `rgba(26, 31, 46, 0.6)`, border: `1px solid rgba(59, 91, 219, 0.2)` }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text, p: 3, pb: 2 }}>
              Visão em Tabela
            </Typography>
            <TableContainer sx={{ maxHeight: cryptos.length >= 10 ? '600px' : 'auto', overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                    <TableCell sx={{ color: theme.textSecondary, fontWeight: 600 }}>Nome</TableCell>
                    <TableCell sx={{ color: theme.textSecondary, fontWeight: 600 }}>Símbolo</TableCell>
                    <TableCell sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                      Planos
                    </TableCell>
                    <TableCell align="center" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                      Ação
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cryptos.map((crypto) => (
                    <TableRow key={crypto._id} sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)`, '&:hover': { background: `rgba(59, 91, 219, 0.05)` } }}>
                      <TableCell sx={{ color: theme.text }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CurrencyBitcoinIcon sx={{ fontSize: 20, color: theme.warning }} />
                          {crypto.name}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: theme.primary, fontWeight: 600 }}>
                        {crypto.symbol}
                      </TableCell>
                      <TableCell sx={{ color: theme.text }}>
                        {crypto.plans && crypto.plans.map((plan, idx) => (
                          <Box key={idx} sx={{ fontSize: '0.85rem', mb: idx < crypto.plans.length - 1 ? 0.5 : 0 }}>
                            <span style={{ color: theme.text }}>{plan.period}d</span>
                            <span style={{ color: theme.textSecondary, margin: '0 4px' }}>→</span>
                            <span style={{ color: theme.success, fontWeight: 600 }}>{plan.yieldPercentage}%</span>
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleInvest(crypto._id)}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                            fontSize: '0.75rem',
                          }}
                        >
                          Investir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Container>
    </PageLayout>
  );
}
