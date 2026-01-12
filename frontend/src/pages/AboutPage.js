import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Stack,
  LinearProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PageLayout from '../components/PageLayout';

const theme = {
  primary: '#7C3AED',
  secondary: '#6B46C1',
  dark: '#0a0e27',
  darkLight: 'rgba(26, 26, 77, 0.6)',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
};

export default function AboutPage() {
  return (
    <PageLayout>
      <Box sx={{ width: '100%', bgcolor: theme.dark }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, #0a0e27 0%, #1a1a4d 15%, #2d1b4e 30%, #3d2e5f 45%, #2a1f4d 60%, #1a1a3e 75%, #0f172a 100%)`,
            py: 12,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: `
                radial-gradient(circle at 15% 25%, rgba(124, 58, 237, 0.25) 0%, transparent 40%),
                radial-gradient(circle at 85% 75%, rgba(59, 91, 219, 0.2) 0%, transparent 45%)
              `,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                color: 'white',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Sobre a Acapulco
            </Typography>
            <Typography
              sx={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Somos uma plataforma inovadora de investimento em criptomoedas, dedicada a democratizar o acesso ao mercado cripto para todos.
            </Typography>
          </Container>
        </Box>

        {/* Our Story */}
        <Container maxWidth="xl" sx={{ py: 12 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: theme.text,
                  mb: 3,
                }}
              >
                Nossa História
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.05rem',
                  color: theme.textSecondary,
                  mb: 2,
                  lineHeight: 1.8,
                }}
              >
                Fundada em 2023, a Acapulco nasceu da visão de criar uma plataforma segura, intuitiva e acessível para investir em criptomoedas. Com uma equipe dedicada de especialistas em blockchain e finanças, estamos transformando a forma como as pessoas investem.
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.05rem',
                  color: theme.textSecondary,
                  lineHeight: 1.8,
                }}
              >
                Acreditamos que o futuro das finanças é descentralizado e que todos devem ter a oportunidade de participar dessa revolução. Por isso, trabalhamos incansavelmente para fornecer as melhores ferramentas e suporte aos nossos usuários.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.darkLight} 0%, rgba(45, 27, 78, 0.6) 100%)`,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '16px',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Box sx={{ fontSize: '5rem', mb: 2 }}>🚀</Box>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: theme.text, mb: 2 }}>
                  Missão
                </Typography>
                <Typography sx={{ color: theme.textSecondary, lineHeight: 1.8 }}>
                  Democratizar o acesso ao investimento em criptomoedas, fornecendo uma plataforma segura, transparente e inovadora para pessoas do mundo todo gerenciarem seu patrimônio digital.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Stats Section */}
        <Box sx={{ bgcolor: theme.darkLight, py: 12 }}>
          <Container maxWidth="xl">
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: theme.primary, mb: 1 }}>
                    100K+
                  </Typography>
                  <Typography sx={{ color: theme.textSecondary }}>Usuários Ativos</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: theme.primary, mb: 1 }}>
                    $500M+
                  </Typography>
                  <Typography sx={{ color: theme.textSecondary }}>Volume Movimentado</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: theme.primary, mb: 1 }}>
                    50+
                  </Typography>
                  <Typography sx={{ color: theme.textSecondary }}>Criptomoedas Suportadas</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: theme.primary, mb: 1 }}>
                    24/7
                  </Typography>
                  <Typography sx={{ color: theme.textSecondary }}>Suporte Disponível</Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Values Section */}
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
            Nossos Valores
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
            Os princípios que guiam nossas decisões e ações todos os dias
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: theme.darkLight,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
                    borderColor: 'rgba(124, 58, 237, 0.4)',
                  },
                }}
              >
                <Box sx={{ fontSize: '3rem', mb: 2 }}>🔒</Box>
                <Typography sx={{ fontWeight: 700, color: theme.text, mb: 1 }}>Segurança</Typography>
                <Typography sx={{ color: theme.textSecondary, fontSize: '0.95rem' }}>
                  Proteger seus ativos com tecnologia de ponta
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: theme.darkLight,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
                    borderColor: 'rgba(124, 58, 237, 0.4)',
                  },
                }}
              >
                <Box sx={{ fontSize: '3rem', mb: 2 }}>💡</Box>
                <Typography sx={{ fontWeight: 700, color: theme.text, mb: 1 }}>Inovação</Typography>
                <Typography sx={{ color: theme.textSecondary, fontSize: '0.95rem' }}>
                  Criar soluções criativas para novos desafios
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: theme.darkLight,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
                    borderColor: 'rgba(124, 58, 237, 0.4)',
                  },
                }}
              >
                <Box sx={{ fontSize: '3rem', mb: 2 }}>👥</Box>
                <Typography sx={{ fontWeight: 700, color: theme.text, mb: 1 }}>Comunidade</Typography>
                <Typography sx={{ color: theme.textSecondary, fontSize: '0.95rem' }}>
                  Construir juntos uma comunidade forte
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: theme.darkLight,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
                    borderColor: 'rgba(124, 58, 237, 0.4)',
                  },
                }}
              >
                <Box sx={{ fontSize: '3rem', mb: 2 }}>🌍</Box>
                <Typography sx={{ fontWeight: 700, color: theme.text, mb: 1 }}>Transparência</Typography>
                <Typography sx={{ color: theme.textSecondary, fontSize: '0.95rem' }}>
                  Operar com honestidade e clareza total
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Team Section */}
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
              Nossa Equipe
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
              Profissionais dedicados com experiência em blockchain, finanças e tecnologia
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {[
                { name: 'João Silva', role: 'CEO & Fundador', emoji: '👨‍💼' },
                { name: 'Maria Santos', role: 'CTO', emoji: '👩‍💻' },
                { name: 'Pedro Costa', role: 'CFO', emoji: '📊' },
                { name: 'Ana Oliveira', role: 'Head of Security', emoji: '🔐' },
              ].map((member, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Card
                    sx={{
                      p: 3,
                      bgcolor: 'rgba(26, 26, 77, 0.6)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      borderRadius: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <Box sx={{ fontSize: '4rem', mb: 2 }}>{member.emoji}</Box>
                    <Typography sx={{ fontWeight: 700, color: theme.text, mb: 0.5 }}>
                      {member.name}
                    </Typography>
                    <Typography sx={{ color: theme.primary, fontSize: '0.9rem' }}>
                      {member.role}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </PageLayout>
  );
}
