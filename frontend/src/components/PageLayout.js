import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
};

export default function PageLayout({ children }) {
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
    <Box sx={{ background: `linear-gradient(135deg, ${theme.dark} 0%, ${theme.darkLight} 100%)`, minHeight: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          background: `rgba(26, 31, 46, 0.95)`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid rgba(59, 91, 219, 0.1)`,
          boxShadow: 'none',
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
              onClick={() => navigate('/cryptos')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Criptmoedas
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/profile')}
              sx={{ color: theme.textSecondary, '&:hover': { color: theme.primary } }}
            >
              Perfil
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
      <Box sx={{ py: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
