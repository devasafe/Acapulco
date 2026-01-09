import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Stack,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import PageLayout from '../components/PageLayout';
import { getProfile, updateProfile, getReferrals } from '../services/apiService';
import { getToken } from '../utils/auth';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  success: '#10B981',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
};

export default function ProfilePage() {
  const token = getToken();
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      Promise.all([getProfile(token), getReferrals(token)])
        .then(([profileRes, referralsRes]) => {
          setProfile(profileRes);
          setFormData(profileRes);
          setReferrals(referralsRes || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [token]);

  const handleSave = async () => {
    try {
      const updated = await updateProfile(formData, token);
      setProfile(updated);
      setEditMode(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao atualizar');
    }
  };

  const copyReferralCode = () => {
    if (profile?.referralCode) {
      const referralUrl = `${window.location.origin}/register?ref=${profile.referralCode}`;
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Container maxWidth="md">
          <Typography>Carregando...</Typography>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Perfil */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                p: 4,
                background: `rgba(26, 31, 46, 0.6)`,
                border: `1px solid rgba(59, 91, 219, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text }}>
                  Meu Perfil
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(!editMode)}
                  sx={{ color: theme.primary, borderColor: theme.primary }}
                >
                  {editMode ? 'Cancelar' : 'Editar'}
                </Button>
              </Box>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editMode}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: `rgba(59, 91, 219, 0.3)` },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.textSecondary,
                      '& fieldset': { borderColor: `rgba(59, 91, 219, 0.3)` },
                    },
                  }}
                />

                {editMode && (
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                    }}
                  >
                    Salvar Alterações
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid>

          {/* Código de Referência */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                background: `linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)`,
                border: `1px solid rgba(16, 185, 129, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Typography variant="subtitle2" sx={{ color: theme.textSecondary, mb: 2 }}>
                Seu Código de Referência
              </Typography>

              <Paper
                sx={{
                  p: 2,
                  background: `rgba(26, 31, 46, 0.8)`,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: theme.primary,
                    fontWeight: 700,
                    wordBreak: 'break-all',
                  }}
                >
                  {profile?.referralCode || '—'}
                </Typography>
              </Paper>

              <Button
                fullWidth
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={copyReferralCode}
                sx={{
                  background: copied ? theme.success : theme.primary,
                  transition: 'background 0.3s',
                }}
              >
                {copied ? 'Copiado!' : 'Copiar Link'}
              </Button>
            </Card>
          </Grid>

          {/* Referidos */}
          <Grid item xs={12}>
            <Card
              sx={{
                p: 4,
                background: `rgba(26, 31, 46, 0.6)`,
                border: `1px solid rgba(59, 91, 219, 0.2)`,
                borderRadius: '12px',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text, mb: 3 }}>
                Meus Referidos ({referrals.length})
              </Typography>

              {referrals.length > 0 ? (
                <Stack spacing={2}>
                  {referrals.map((ref, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        background: `rgba(59, 91, 219, 0.05)`,
                        border: `1px solid rgba(59, 91, 219, 0.1)`,
                        borderRadius: '8px',
                      }}
                    >
                      <Typography sx={{ color: theme.text, fontWeight: 600 }}>
                        {ref.name || 'Usuário'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                        {ref.email}
                      </Typography>
                      {ref.referralBonusEarned !== undefined && (
                        <Chip
                          label={`Bônus: R$ ${(Number(ref.referralBonusEarned) || 0).toFixed(2)}`}
                          sx={{
                            mt: 1,
                            background: `rgba(16, 185, 129, 0.2)`,
                            color: theme.success,
                          }}
                        />
                      )}
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ color: theme.textSecondary }}>
                  Você ainda não tem referidos
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
}
