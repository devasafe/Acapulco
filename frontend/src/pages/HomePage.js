import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  LinearProgress,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import LanguageIcon from '@mui/icons-material/Language';
import PageLayout from '../components/PageLayout';

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

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card
    sx={{
      p: 3,
      backgroundColor: theme.darkLight,
      border: `1px solid rgba(59, 91, 219, 0.15)`,
      borderRadius: '14px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 8px 24px rgba(59, 91, 219, 0.2)',
        borderColor: 'rgba(59, 91, 219, 0.3)',
      },
    }}
  >
    <Box sx={{ mb: 2 }}>
      <Icon sx={{ fontSize: 48, color: theme.primary }} />
    </Box>
    <Typography variant="h6" sx={{ mb: 1, color: theme.text, fontWeight: 700 }}>
      {title}
    </Typography>
    <Typography sx={{ color: theme.textSecondary, fontSize: '0.95rem' }}>
      {description}
    </Typography>
  </Card>
);

const StatCard = ({ value, label }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography
      sx={{
        fontSize: '2.5rem',
        fontWeight: 700,
        color: theme.primary,
        mb: 0.5,
      }}
    >
      {value}
    </Typography>
    <Typography sx={{ color: theme.textSecondary }}>
      {label}
    </Typography>
  </Box>
);

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Box sx={{ width: '100%', bgcolor: theme.dark }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            py: 12,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(59, 91, 219, 0.2) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 80%, rgba(107, 70, 193, 0.2) 0%, transparent 50%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 800,
                      color: 'white',
                      mb: 2,
                      lineHeight: 1.2,
                    }}
                  >
                    O Futuro do Investimento é Aqui
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.1rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    Invista em criptomoedas e comece a ganhar rendimentos reais com segurança e facilidade.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/dashboard')}
                      sx={{
                        bgcolor: 'white',
                        color: theme.primary,
                        fontWeight: 700,
                        py: 1.5,
                        px: 4,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      Começar Agora
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        fontWeight: 700,
                        py: 1.5,
                        px: 4,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'white',
                        },
                      }}
                    >
                      Saiba Mais
                    </Button>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    fontSize: '4rem',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  💰
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Stats Section */}
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard value="10K+" label="Usuários Ativos" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard value="$50M+" label="Volume Investido" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard value="24/7" label="Suporte Disponível" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard value="+15%" label="Retorno Médio" />
            </Grid>
          </Grid>
        </Container>

        {/* Video Section */}
        <Box sx={{ bgcolor: theme.darkLight, py: 12 }}>
          <Container maxWidth="xl">
            <Typography
              sx={{
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 700,
                color: theme.text,
                mb: 2,
                textAlign: 'center',
              }}
            >
              Por Que Investir em Criptomoedas?
            </Typography>
            <Typography
              sx={{
                fontSize: '1.05rem',
                color: theme.textSecondary,
                mb: 6,
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Entenda como criptomoedas podem revolucionar seus investimentos e gerar renda passiva
            </Typography>

            {/* Video Placeholder */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '900px',
                mx: 'auto',
                aspectRatio: '16 / 9',
                bgcolor: theme.darker,
                borderRadius: '14px',
                border: `2px dashed rgba(59, 91, 219, 0.3)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.primary,
                  bgcolor: 'rgba(59, 91, 219, 0.05)',
                },
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <Typography sx={{ fontSize: '4rem' }}>▶️</Typography>
                <Typography sx={{ color: theme.textSecondary }}>
                  Seu vídeo será inserido aqui
                </Typography>
              </Stack>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="xl" sx={{ py: 12 }}>
          <Typography
            sx={{
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              fontWeight: 700,
              color: theme.text,
              mb: 2,
              textAlign: 'center',
            }}
          >
            Por Que Escolher A Gente?
          </Typography>
          <Typography
            sx={{
              fontSize: '1.05rem',
              color: theme.textSecondary,
              mb: 8,
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Somos a plataforma mais segura e fácil para investir em criptomoedas
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={TrendingUpIcon}
                title="Rentabilidade"
                description="Ganhe com rendimentos passivos e valorizações de mercado"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={SecurityIcon}
                title="Segurança"
                description="Suas criptos protegidas com tecnologia blockchain"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={SpeedIcon}
                title="Rapidez"
                description="Transações instantâneas e saque em minutos"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                icon={LanguageIcon}
                title="Acessibilidade"
                description="Comece com qualquer valor e gerencie de qualquer lugar"
              />
            </Grid>
          </Grid>
        </Container>

        {/* Benefits Section */}
        <Box sx={{ bgcolor: theme.darkLight, py: 12 }}>
          <Container maxWidth="xl">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    fontWeight: 700,
                    color: theme.text,
                    mb: 3,
                  }}
                >
                  Rendimento Automático
                </Typography>
                <Stack spacing={2}>
                  {[
                    { label: 'Mês 1', value: 5 },
                    { label: 'Mês 2', value: 10 },
                    { label: 'Mês 3', value: 15 },
                  ].map((item) => (
                    <Box key={item.label}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ color: theme.text, fontWeight: 600 }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ color: theme.primary, fontWeight: 700 }}>
                          +{item.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.value * 6.67}
                        sx={{
                          height: 8,
                          borderRadius: '4px',
                          bgcolor: theme.darker,
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 2,
                  }}
                >
                  {[
                    { emoji: '🎯', text: 'Metas Personalizadas' },
                    { emoji: '📊', text: 'Análise em Tempo Real' },
                    { emoji: '🤝', text: 'Programa de Referência' },
                    { emoji: '📱', text: 'App Mobile' },
                  ].map((item, idx) => (
                    <Card
                      key={idx}
                      sx={{
                        p: 2,
                        bgcolor: theme.darker,
                        border: `1px solid rgba(59, 91, 219, 0.15)`,
                        borderRadius: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '2rem', mb: 1 }}>
                        {item.emoji}
                      </Typography>
                      <Typography sx={{ color: theme.text, fontSize: '0.9rem' }}>
                        {item.text}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Container maxWidth="xl" sx={{ py: 12, textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              fontWeight: 700,
              color: theme.text,
              mb: 3,
            }}
          >
            Pronto Para Começar?
          </Typography>
          <Typography
            sx={{
              fontSize: '1.05rem',
              color: theme.textSecondary,
              mb: 6,
            }}
          >
            Junte-se a milhares de investidores que já estão ganhando
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              bgcolor: theme.primary,
              color: 'white',
              fontWeight: 700,
              py: 1.8,
              px: 6,
              fontSize: '1.05rem',
              '&:hover': {
                bgcolor: theme.secondary,
              },
            }}
          >
            Criar Conta Agora
          </Button>
        </Container>
      </Box>
    </PageLayout>
  );
}
