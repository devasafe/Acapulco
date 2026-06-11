import React from 'react';
import { Box, Container, Grid, Typography, Stack, Link, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const theme = {
  primary: '#7C3AED',
  secondary: '#6B46C1',
  success: '#10B981',
  error: '#EF4444',
  dark: '#0a0e27',
  darkLight: 'rgba(26, 26, 77, 0.6)',
  darker: 'rgba(45, 27, 78, 0.6)',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
};

const FooterLink = ({ label, onClick, external = false, href = '#' }) => (
  <Link
    component={external ? 'a' : 'button'}
    href={external ? href : undefined}
    onClick={!external ? onClick : undefined}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    sx={{
      color: theme.textSecondary,
      textDecoration: 'none',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: theme.primary,
        transform: 'translateX(4px)',
      },
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      padding: 0,
    }}
  >
    {label}
  </Link>
);

export default function Footer() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.dark} 0%, ${theme.darkLight} 100%)`,
        borderTop: `1px solid rgba(124, 58, 237, 0.2)`,
        py: 12,
        mt: 12,
      }}
    >
      <Container maxWidth="xl">
        {/* Main Footer Content - Centered Layout */}
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          {/* Brand */}
          <Box sx={{ mb: 8 }}>
            <Typography
              sx={{
                fontSize: '2.2rem',
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              Acapulco
            </Typography>
            <Typography sx={{ color: theme.textSecondary, lineHeight: 1.8, maxWidth: '600px', mx: 'auto', fontSize: '1rem' }}>
              A plataforma mais segura e fácil para investir em criptomoedas e gerar renda passiva.
            </Typography>
          </Box>

          {/* Navigation Links - 3 Columns Centered */}
          <Grid container spacing={8} sx={{ mb: 8, justifyContent: 'center' }}>
            {/* Produtos */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, color: theme.primary, mb: 3, fontSize: '1.05rem', textAlign: 'center' }}>
                  Produtos
                </Typography>
                <Stack spacing={2} sx={{ textAlign: 'center' }}>
                  <FooterLink label="Mercados" onClick={() => navigate('/markets')} />
                </Stack>
              </Box>
            </Grid>

            {/* Empresa */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, color: theme.primary, mb: 3, fontSize: '1.05rem', textAlign: 'center' }}>
                  Empresa
                </Typography>
                <Stack spacing={2} sx={{ textAlign: 'center' }}>
                  <FooterLink label="Sobre Nós" onClick={() => navigate('/about')} />
                </Stack>
              </Box>
            </Grid>

            {/* Suporte */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, color: theme.primary, mb: 3, fontSize: '1.05rem', textAlign: 'center' }}>
                  Suporte
                </Typography>
                <Stack spacing={2} sx={{ textAlign: 'center' }}>
                  <FooterLink label="Contato" onClick={() => navigate('/contact')} />
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: 'rgba(124, 58, 237, 0.2)', mb: 6 }} />

        {/* Bottom Footer - Centered */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: theme.textTertiary, fontSize: '0.9rem', mb: 2 }}>
            © 2024 Acapulco. Todos os direitos reservados.
          </Typography>
          <Typography sx={{ color: theme.textTertiary, fontSize: '0.9rem' }}>
            Desenvolvido por bigz
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
