import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  Stack,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import axios from '../api';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  error: '#EF4444',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.dark} 0%, ${theme.darkLight} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 4,
            background: `rgba(26, 31, 46, 0.8)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid rgba(59, 91, 219, 0.2)`,
            borderRadius: '16px',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.text, mb: 1 }}>
              Acapulco
            </Typography>
            <Typography variant="body2" sx={{ color: theme.textSecondary }}>
              Plataforma de Investimentos em Criptomeda
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              {error && (
                <Box
                  sx={{
                    p: 2,
                    background: `rgba(239, 68, 68, 0.1)`,
                    border: `1px solid ${theme.error}`,
                    borderRadius: '8px',
                    color: theme.error,
                  }}
                >
                  <Typography variant="body2">{error}</Typography>
                </Box>
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: theme.primary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: theme.text,
                    '& fieldset': { borderColor: `rgba(59, 91, 219, 0.3)` },
                    '&:hover fieldset': { borderColor: theme.primary },
                    '&.Mui-focused fieldset': { borderColor: theme.primary },
                  },
                  '& .MuiInputBase-input::placeholder': { color: theme.textSecondary },
                }}
              />

              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.primary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: theme.text,
                    '& fieldset': { borderColor: `rgba(59, 91, 219, 0.3)` },
                    '&:hover fieldset': { borderColor: theme.primary },
                    '&.Mui-focused fieldset': { borderColor: theme.primary },
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                  color: 'white',
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: '8px',
                  '&:hover': {
                    boxShadow: `0 0 20px rgba(59, 91, 219, 0.4)`,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Entrar'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                  Não tem conta?{' '}
                  <Typography
                    component="span"
                    onClick={() => navigate('/register')}
                    sx={{
                      color: theme.primary,
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { color: theme.secondary },
                    }}
                  >
                    Cadastre-se
                  </Typography>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
