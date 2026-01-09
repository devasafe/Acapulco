#!/usr/bin/env python3
"""Generate remaining frontend pages"""

BASE_PATH = "d:\\PROJETOS\\Acapulco\\frontend\\src"

PROFILE_PAGE = '''import React, { useState, useEffect } from 'react';
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
                      {ref.referralBonusEarned && (
                        <Chip
                          label={`Bônus: R$ ${ref.referralBonusEarned.toFixed(2)}`}
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
'''

ADMIN_PAGE = '''import React from 'react';
import { Box, Container, Grid, Card, Typography, Button, Stack } from '@mui/material';
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
'''

CRYPTO_ADMIN_PAGE = '''import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import PageLayout from '../components/PageLayout';
import {
  getAllCryptos,
  createCrypto,
  updateCrypto,
  deleteCrypto,
} from '../services/apiService';
import { getToken } from '../utils/auth';
import AddIcon from '@mui/icons-material/Add';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  success: '#10B981',
  error: '#EF4444',
  darkLight: '#1A1F2E',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
};

export default function CryptoAdminPage() {
  const token = getToken();
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    period: '',
    yieldPercentage: '',
  });

  useEffect(() => {
    loadCryptos();
  }, [token]);

  const loadCryptos = async () => {
    try {
      const data = await getAllCryptos(token);
      setCryptos(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ name: '', symbol: '', period: '', yieldPercentage: '' });
    setDialogOpen(true);
  };

  const handleEditClick = (crypto) => {
    setEditingId(crypto._id);
    setFormData({
      name: crypto.name,
      symbol: crypto.symbol,
      period: crypto.period,
      yieldPercentage: crypto.yieldPercentage,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCrypto(editingId, formData, token);
      } else {
        await createCrypto(formData, token);
      }
      setDialogOpen(false);
      loadCryptos();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao salvar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    try {
      await deleteCrypto(id, token);
      loadCryptos();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao deletar');
    }
  };

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text }}>
            Gerenciar Criptomoedas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` }}
          >
            Nova Cripto
          </Button>
        </Box>

        <Card sx={{ background: `rgba(26, 31, 46, 0.6)`, border: `1px solid rgba(59, 91, 219, 0.2)` }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                  <TableCell sx={{ color: theme.textSecondary }}>Nome</TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>Símbolo</TableCell>
                  <TableCell align="right" sx={{ color: theme.textSecondary }}>
                    Período (dias)
                  </TableCell>
                  <TableCell align="right" sx={{ color: theme.textSecondary }}>
                    Rendimento
                  </TableCell>
                  <TableCell align="center" sx={{ color: theme.textSecondary }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cryptos.map((crypto) => (
                  <TableRow key={crypto._id} sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                    <TableCell sx={{ color: theme.text }}>{crypto.name}</TableCell>
                    <TableCell sx={{ color: theme.primary }}>{crypto.symbol}</TableCell>
                    <TableCell align="right" sx={{ color: theme.text }}>
                      {crypto.period}
                    </TableCell>
                    <TableCell align="right" sx={{ color: theme.success }}>
                      {crypto.yieldPercentage}%
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => handleEditClick(crypto)}>
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(crypto._id)}
                      >
                        Deletar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ background: theme.darkLight, color: theme.text }}>
          {editingId ? 'Editar Cripto' : 'Nova Cripto'}
        </DialogTitle>
        <DialogContent sx={{ background: theme.darkLight }}>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Símbolo"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            />
            <TextField
              fullWidth
              label="Período (dias)"
              type="number"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            />
            <TextField
              fullWidth
              label="Rendimento (%)"
              type="number"
              step="0.1"
              value={formData.yieldPercentage}
              onChange={(e) => setFormData({ ...formData, yieldPercentage: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ background: theme.darkLight }}>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
'''

import os

files_to_create = [
    (f"{BASE_PATH}\\pages\\ProfilePage.js", PROFILE_PAGE),
    (f"{BASE_PATH}\\pages\\AdminPage.js", ADMIN_PAGE),
    (f"{BASE_PATH}\\pages\\CryptoAdminPage.js", CRYPTO_ADMIN_PAGE),
]

def create_files():
    for filepath, content in files_to_create:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Created: {filepath}")

if __name__ == "__main__":
    create_files()
    print("\n✅ All remaining pages generated successfully!")
