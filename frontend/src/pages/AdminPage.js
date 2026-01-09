import React from 'react';
import { Box, Container, Grid, Card, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import SettingsIcon from '@mui/icons-material/Settings';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import PeopleIcon from '@mui/icons-material/People';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  warning: '#F59E0B',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
};

export default function AdminPage() {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: 'Gerenciar Criptomoedas',
      description: 'Criar, editar e deletar criptomoedas e seus rendimentos',
      icon: <CurrencyBitcoinIcon sx={{ fontSize: 48, color: theme.primary }} />,
      path: '/admin/cryptos',
    },
    {
      title: 'Configurar Referência',
      description: 'Ajuste o percentual de bônus de referência',
      icon: <SettingsIcon sx={{ fontSize: 48, color: theme.warning }} />,
      path: '/admin/referral-settings',
    },
    {
      title: 'Lucros de Referência',
      description: 'Visualize os lucros gerados por referências',
      icon: <PeopleIcon sx={{ fontSize: 48, color: theme.secondary }} />,
      path: '/admin/referral-profits',
    },
  ];

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: theme.text, mb: 4 }}>
          Painel Administrativo
        </Typography>

        <Grid container spacing={3}>
          {adminSections.map((section, idx) => (
            <Grid item xs={12} md={6} lg={4} key={idx}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  background: `rgba(26, 31, 46, 0.6)`,
                  border: `1px solid rgba(59, 91, 219, 0.2)`,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    border: `1px solid ${theme.primary}`,
                    boxShadow: `0 0 20px rgba(59, 91, 219, 0.2)`,
                  },
                }}
                onClick={() => navigate(section.path)}
              >
                <Box sx={{ mb: 2 }}>
                  {section.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text, mb: 1 }}>
                  {section.title}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 'auto' }}>
                  {section.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 2,
                    color: theme.primary,
                    borderColor: theme.primary,
                    '&:hover': { background: `rgba(59, 91, 219, 0.1)` },
                  }}
                >
                  Acessar
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageLayout>
  );
}
