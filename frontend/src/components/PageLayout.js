import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Footer from './Footer';
import DisclaimerBanner from './DisclaimerBanner';

const theme = {
  primary: '#7C3AED',
  secondary: '#6B46C1',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  dark: '#0a0e27',
  darkLight: 'rgba(26, 26, 77, 0.6)',
  darker: 'rgba(45, 27, 78, 0.6)',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
};

export default function PageLayout({ children, noPadding = false }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Erro ao parsear usuário:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ background: `linear-gradient(135deg, ${theme.dark} 0%, #1a1a4d 15%, #2d1b4e 30%, #3d2e5f 45%, #2a1f4d 60%, #1a1a3e 75%, #0f172a 100%)`, minHeight: '100vh' }}>
      <DisclaimerBanner />
      <AppBar
        position="static"
        sx={{
          background: `linear-gradient(135deg, rgba(10, 14, 39, 0.98) 0%, rgba(26, 26, 77, 0.95) 100%)`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid rgba(124, 58, 237, 0.2)`,
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: theme.primary,
              cursor: 'pointer',
              flex: 1,
            }}
            onClick={() => navigate('/dashboard')}
          >
            Acapulco
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Início
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/markets')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Mercados
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/leaderboard')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Ranking
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/profile')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Perfil
            </Button>


            <Button
              color="inherit"
              onClick={() => navigate('/about')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Sobre
            </Button>

            <Button
              color="inherit"
              onClick={() => navigate('/contact')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Contato
            </Button>


            {user?.isAdmin && (
              <Button
                color="inherit"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => navigate('/admin')}
                sx={{ color: theme.secondary, '&:hover': { color: theme.primary }, fontWeight: 600 }}
              >
                Admin
              </Button>
            )}
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: theme.textSecondary, '&:hover': { color: '#EF4444' } }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ py: noPadding ? 0 : 4 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
