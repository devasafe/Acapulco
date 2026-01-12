import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PageLayout from '../components/PageLayout';

const theme = {
  primary: '#7C3AED',
  secondary: '#6B46C1',
  dark: '#0a0e27',
  darkLight: 'rgba(26, 26, 77, 0.6)',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulário enviado:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <PageLayout>
      <Box sx={{ width: '100%', bgcolor: theme.dark, py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                color: theme.text,
                mb: 2,
              }}
            >
              Entre em Contato
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', color: theme.textSecondary, maxWidth: '600px', mx: 'auto' }}>
              Tem alguma dúvida? Estamos aqui para ajudar! Entre em contato conosco e responderemos o mais rápido possível.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 8 }}>
            {/* Formulário */}
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                bgcolor: theme.darkLight,
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: '16px',
              }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Seu Nome"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: 'rgba(124, 58, 237, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(124, 58, 237, 0.4)' },
                      '&.Mui-focused fieldset': { borderColor: theme.primary },
                    },
                    '& .MuiOutlinedInput-input::placeholder': { color: theme.textSecondary },
                    '& .MuiInputBase-input': { color: theme.text },
                    '& .MuiInputLabel-root': { color: theme.textSecondary },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
                  }}
                />
                <TextField
                  fullWidth
                  label="Seu Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: 'rgba(124, 58, 237, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(124, 58, 237, 0.4)' },
                      '&.Mui-focused fieldset': { borderColor: theme.primary },
                    },
                    '& .MuiOutlinedInput-input::placeholder': { color: theme.textSecondary },
                    '& .MuiInputBase-input': { color: theme.text },
                    '& .MuiInputLabel-root': { color: theme.textSecondary },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
                  }}
                />
                <TextField
                  fullWidth
                  label="Assunto"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: 'rgba(124, 58, 237, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(124, 58, 237, 0.4)' },
                      '&.Mui-focused fieldset': { borderColor: theme.primary },
                    },
                    '& .MuiOutlinedInput-input::placeholder': { color: theme.textSecondary },
                    '& .MuiInputBase-input': { color: theme.text },
                    '& .MuiInputLabel-root': { color: theme.textSecondary },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
                  }}
                />
                <TextField
                  fullWidth
                  label="Mensagem"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={5}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: 'rgba(124, 58, 237, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(124, 58, 237, 0.4)' },
                      '&.Mui-focused fieldset': { borderColor: theme.primary },
                    },
                    '& .MuiOutlinedInput-input::placeholder': { color: theme.textSecondary },
                    '& .MuiInputBase-input': { color: theme.text },
                    '& .MuiInputLabel-root': { color: theme.textSecondary },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme.primary },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    bgcolor: theme.primary,
                    color: 'white',
                    fontWeight: 700,
                    py: 1.5,
                    '&:hover': { bgcolor: theme.secondary },
                  }}
                >
                  Enviar Mensagem
                </Button>
                {submitted && (
                  <Typography sx={{ color: '#10B981', textAlign: 'center', fontWeight: 600 }}>
                    ✓ Mensagem enviada com sucesso!
                  </Typography>
                )}
              </Stack>
            </Paper>

            {/* Informações de Contato */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: theme.darkLight,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: 2,
                }}
              >
                <EmailIcon sx={{ color: theme.primary, fontSize: 32, mt: 1 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: theme.text, mb: 0.5 }}>Email</Typography>
                  <Typography sx={{ color: theme.textSecondary }}>contato@acapulco.com</Typography>
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  bgcolor: theme.darkLight,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: 2,
                }}
              >
                <PhoneIcon sx={{ color: theme.primary, fontSize: 32, mt: 1 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: theme.text, mb: 0.5 }}>Telefone</Typography>
                  <Typography sx={{ color: theme.textSecondary }}>+55 (11) 9999-9999</Typography>
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  bgcolor: theme.darkLight,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: 2,
                }}
              >
                <LocationOnIcon sx={{ color: theme.primary, fontSize: 32, mt: 1 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: theme.text, mb: 0.5 }}>Endereço</Typography>
                  <Typography sx={{ color: theme.textSecondary }}>São Paulo, SP - Brasil</Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </PageLayout>
  );
}
