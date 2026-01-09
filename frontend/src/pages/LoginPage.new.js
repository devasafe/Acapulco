import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Stack,
  Paper
} from '@mui/material';
import { login } from '../services/authService';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (onLogin) onLogin();
      window.dispatchEvent(new Event('userLoggedIn'));
      navigate(res.data.user.isAdmin ? '/admin-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f1724 0%, #1a202c 100%)',
        backgroundAttachment: 'fixed',
        py: 4,
        px: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                fontSize: '3rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              💼 Acapulco
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: '#a0aec0',
                fontWeight: 400,
                mb: 1,
              }}
            >
              Bem-vindo de volta
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096' }}>
              Acesse sua conta para continuar
            </Typography>
          </Box>

          {/* Login Card */}
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.8) 0%, rgba(15, 23, 36, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(230, 238, 248, 0.1)',
              borderRadius: '16px',
              p: 4,
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Error Alert */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: 'rgba(245, 101, 101, 0.1)',
                      color: '#fc8181',
                      border: '1px solid rgba(245, 101, 101, 0.2)',
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#667eea', mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(26, 32, 44, 0.5)',
                      borderRadius: '8px',
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#667eea', mr: 1 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(26, 32, 44, 0.5)',
                      borderRadius: '8px',
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  onClick={handleSubmit}
                  endIcon={loading ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    transition: 'all 200ms',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      opacity: 0.6,
                    },
                  }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </Stack>
            </form>
          </Card>

          {/* Divider */}
          <Divider sx={{ color: '#4a5568' }}>ou</Divider>

          {/* Register Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#a0aec0', mb: 1 }}>
              Não tem uma conta?
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              fullWidth
              sx={{
                color: '#667eea',
                borderColor: '#667eea',
                textTransform: 'none',
                fontSize: '1rem',
                py: 1,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#764ba2',
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                },
              }}
            >
              Criar Conta
            </Button>
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: '#718096',
              display: 'block',
            }}
          >
            © 2025 Acapulco. Todos os direitos reservados.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
