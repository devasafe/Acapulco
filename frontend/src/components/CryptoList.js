import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { getCryptos } from '../services/cryptoService';
import PageLayout from './PageLayout';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

export default function CryptoList({ onCryptoClick }) {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

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
    getCryptos()
      .then(res => {
        setCryptos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #0a0e27 100%)',
          }}
        >
          <CircularProgress 
            sx={{
              color: '#00ffff',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
            size={60}
            thickness={4}
          />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 6, 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0a0e27 100%)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255, 255, 0, 0.05) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }
        }}
      >
        {/* CSS Animations */}
        <style jsx>{`
          @keyframes cryptoPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-8px) rotate(1deg); }
            66% { transform: translateY(4px) rotate(-1deg); }
          }
        `}</style>

        {/* Header */}
        <Card
          sx={{
            mb: 6,
            p: 4,
            background: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(255,0,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,255,255,0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,255,255,0.2)',
            animation: 'cryptoPulse 4s ease-in-out infinite',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.1), transparent)',
              animation: 'shimmer 3s ease-in-out infinite',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                animation: 'float 6s ease-in-out infinite'
              }}
            >
              💎
            </Box>
            <Stack>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(0,255,255,0.5)',
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  letterSpacing: '1px'
                }}
              >
                Crypto Marketplace
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#a8d8ff',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}
              >
                🚀 Explore e invista em criptomoedas premium
              </Typography>
            </Stack>
          </Box>
        </Card>

        {/* Crypto Grid */}
        {cryptos.length === 0 ? (
          <Card
            sx={{
              p: 8,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(255,0,100,0.1) 0%, rgba(255,0,255,0.05) 100%)',
              border: '1px solid rgba(255,0,100,0.3)',
              borderRadius: '20px',
              maxWidth: '100%',
              width: '100%',
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#ff0066',
                fontWeight: 600,
                mb: 2
              }}
            >
              🔍 Nenhuma criptomoeda disponível
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: '#a8d8ff' }}
            >
              Aguarde novas oportunidades de investimento!
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3} sx={{ maxWidth: '100%', width: '100%', justifyContent: 'center' }}>
            {cryptos.map(crypto => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={crypto._id}>
                <Card
                  onClick={() => onCryptoClick(crypto)}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, rgba(0,255,255,0.05) 0%, rgba(255,0,255,0.02) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,255,255,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, transparent 30%, rgba(0,255,255,0.02) 50%, transparent 70%)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.6s ease-in-out',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 16px 64px rgba(0,255,255,0.3)',
                      border: '1px solid rgba(0,255,255,0.4)',
                      '&::before': {
                        transform: 'translateX(100%)',
                      }
                    }
                  }}
                >
                  {/* Crypto Image */}
                  {crypto.image && (
                    <Box
                      sx={{
                        height: 200,
                        backgroundImage: `url(http://localhost:5000${crypto.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '50%',
                          background: 'linear-gradient(to top, rgba(10,14,39,0.8) 0%, transparent 100%)',
                        }
                      }}
                    />
                  )}

                  <Box sx={{ p: 3 }}>
                    {/* Crypto Header */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <CurrencyBitcoinIcon 
                        sx={{ 
                          color: '#00ffff',
                          fontSize: '2rem',
                          filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.5))'
                        }} 
                      />
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #00ffff 0%, #ffff00 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 20px rgba(0,255,255,0.3)',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {crypto.name}
                        </Typography>
                        <Chip
                          label={crypto.symbol}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #ff00ff 0%, #ffff00 100%)',
                            color: '#0a0e27',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                    </Stack>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#a8d8ff',
                        mb: 3,
                        lineHeight: 1.6,
                        minHeight: 40,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {crypto.description || 'Investimento premium em criptomoeda'}
                    </Typography>

                    {/* Investment Info */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,255,255,0.05) 100%)',
                        border: '1px solid rgba(0,255,136,0.2)',
                        mb: 3
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#00ff88', fontWeight: 600, mb: 1 }}
                      >
                        💰 Investimento Mínimo:
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#ffff00',
                          fontWeight: 800,
                          textShadow: '0 0 10px rgba(255,255,0,0.3)'
                        }}
                      >
                        R$ {crypto.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || 'N/A'}
                      </Typography>
                    </Box>

                    {/* Plans */}
                    {crypto.plans && crypto.plans.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: '#ff00ff', fontWeight: 600, mb: 1.5 }}
                        >
                          📈 Planos de Retorno:
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                          {crypto.plans.slice(0, 3).map((plan, i) => (
                            <Chip
                              key={i}
                              icon={<TrendingUpIcon />}
                              label={`${formatPlanDuration(plan.days)}: ${plan.yield}%`}
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, rgba(255,0,255,0.2) 0%, rgba(0,255,255,0.1) 100%)',
                                color: '#ff00ff',
                                fontWeight: 600,
                                border: '1px solid rgba(255,0,255,0.3)',
                                '& .MuiChip-icon': { color: '#ff00ff' }
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* CTA Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 800,
                        textTransform: 'none',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #00ffff 0%, #00ff88 100%)',
                        color: '#0a0e27',
                        boxShadow: '0 8px 32px rgba(0,255,255,0.3)',
                        border: '1px solid rgba(0,255,255,0.5)',
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.5px',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 48px rgba(0,255,255,0.4)',
                          background: 'linear-gradient(135deg, #00ff88 0%, #00ffff 100%)',
                        },
                      }}
                    >
                      🚀 Investir Agora
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Orbs Background */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: -1,
            overflow: 'hidden'
          }}
        >
          {/* Floating Orb 1 */}
          <Box
            sx={{
              position: 'absolute',
              top: '15%',
              right: '10%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 70%)',
              animation: 'float 10s ease-in-out infinite',
            }}
          />
          
          {/* Floating Orb 2 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '25%',
              left: '5%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,0,255,0.12) 0%, transparent 70%)',
              animation: 'float 15s ease-in-out infinite reverse',
            }}
          />
        </Box>
      </Container>
    </PageLayout>
  );
}
