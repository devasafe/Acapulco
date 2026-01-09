import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
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
  success: '#10B981',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCodeInput: referralCode || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!agreeTerms) {
      setError('Você deve aceitar os termos');
      return;
    }

    setLoading(true);

    try {
      const finalReferralCode = formData.referralCodeInput || referralCode;
      const endpoint = finalReferralCode ? '/auth/register-with-referral' : '/auth/register';
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: finalReferralCode,
      };

      const response = await axios.post(endpoint, payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
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
              Criar Conta
            </Typography>
            <Typography variant="body2" sx={{ color: theme.textSecondary }}>
              Junte-se à Acapulco
            </Typography>
            {referralCode && (
              <Typography variant="caption" sx={{ color: theme.success, display: 'block', mt: 1 }}>
                Você foi convidado por um usuário
              </Typography>
            )}
          </Box>

          <form onSubmit={handleRegister}>
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
                label="Nome Completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: theme.primary }} />
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

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                }}
              />

              <TextField
                fullWidth
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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

              <TextField
                fullWidth
                label="Confirmar Senha"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
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

              <TextField
                fullWidth
                label="Código de Referência (Opcional)"
                name="referralCodeInput"
                value={formData.referralCodeInput}
                onChange={handleChange}
                disabled={loading}
                placeholder="Cole o código do seu indicador"
                helperText="Se você foi indicado por alguém, enter seu código aqui"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span sx={{ color: theme.primary }}>🔗</span>
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
                  '& .MuiFormHelperText-root': { color: theme.textSecondary },
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    sx={{ color: theme.primary }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                    Aceito os termos de serviço
                  </Typography>
                }
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
                {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                  Já tem conta?{' '}
                  <Typography
                    component="span"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: theme.primary,
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { color: theme.secondary },
                    }}
                  >
                    Faça login
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
