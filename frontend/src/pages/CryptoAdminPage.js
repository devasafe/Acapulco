import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
  IconButton,
} from '@mui/material';
import PageLayout from '../components/PageLayout';
import {
  getAllCryptosAdmin,
  createCrypto,
  updateCrypto,
  deleteCrypto,
  toggleCryptoStatus,
} from '../services/apiService';
import { getToken } from '../utils/auth';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    price: '',
    description: '',
    plans: [{ period: '', yieldPercentage: '' }],
    image: null,
    imagePreview: null,
  });

  const loadCryptos = useCallback(async () => {
    try {
      const data = await getAllCryptosAdmin(token);
      setCryptos(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    loadCryptos();
  }, [loadCryptos]);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      symbol: '',
      price: '',
      description: '',
      plans: [{ period: '', yieldPercentage: '' }],
      image: null,
      imagePreview: null,
    });
    setDialogOpen(true);
  };

  const handleEditClick = (crypto) => {
    setEditingId(crypto._id);
    setFormData({
      name: crypto.name,
      symbol: crypto.symbol,
      price: crypto.price || '',
      description: crypto.description || '',
      plans: crypto.plans && crypto.plans.length > 0 ? crypto.plans : [{ period: '', yieldPercentage: '' }],
      image: null,
      imagePreview: crypto.image || null,
    });
    setDialogOpen(true);
  };

  const handleAddPlan = () => {
    setFormData({
      ...formData,
      plans: [...formData.plans, { period: '', yieldPercentage: '' }],
    });
  };

  const handleRemovePlan = (index) => {
    if (formData.plans.length === 1) {
      alert('Você deve ter pelo menos um plano!');
      return;
    }
    setFormData({
      ...formData,
      plans: formData.plans.filter((_, i) => i !== index),
    });
  };

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...formData.plans];
    newPlans[index][field] = value;
    setFormData({
      ...formData,
      plans: newPlans,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.symbol) {
      alert('Nome e símbolo são obrigatórios');
      return;
    }

    // Validar preço
    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum)) {
      alert('Preço é obrigatório e deve ser um número válido');
      return;
    }
    if (priceNum < 0) {
      alert('Preço não pode ser negativo');
      return;
    }

    // Validar que todos os planos têm valores
    for (let i = 0; i < formData.plans.length; i++) {
      const plan = formData.plans[i];
      if (!plan.period || plan.period === '' || !plan.yieldPercentage || plan.yieldPercentage === '') {
        alert(`Plano ${i + 1} está incompleto: período e rendimento são obrigatórios`);
        return;
      }
      const period = Number(plan.period);
      const yield_ = Number(plan.yieldPercentage);
      if (isNaN(period) || isNaN(yield_)) {
        alert(`Plano ${i + 1}: período e rendimento devem ser números válidos`);
        return;
      }
      if (period <= 0) {
        alert(`Plano ${i + 1}: período deve ser maior que 0`);
        return;
      }
      if (yield_ < 0) {
        alert(`Plano ${i + 1}: rendimento não pode ser negativo`);
        return;
      }
    }

    try {
      // Usar FormData para suportar upload de arquivo
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('symbol', formData.symbol);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description);
      submitData.append('plans', JSON.stringify(formData.plans));
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingId) {
        await updateCrypto(editingId, submitData, token);
      } else {
        await createCrypto(submitData, token);
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

  const handleToggleActive = async (id, isCurrentlyActive) => {
    try {
      await toggleCryptoStatus(id, token);
      loadCryptos();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao alternar status');
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
                  <TableCell align="right" sx={{ color: theme.textSecondary }}>Preço</TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>Planos</TableCell>
                  <TableCell align="center" sx={{ color: theme.textSecondary }}>
                    Status
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
                    <TableCell sx={{ color: theme.primary, fontWeight: 600 }}>{crypto.symbol}</TableCell>
                    <TableCell align="right" sx={{ color: theme.primary, fontWeight: 600 }}>
                      R$ {(Number(crypto.price) || 0).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ color: theme.text }}>
                      <Stack direction="row" spacing={1}>
                        {crypto.plans && crypto.plans.map((plan, idx) => (
                          <Chip
                            key={idx}
                            label={`${plan.period}d / ${plan.yieldPercentage}%`}
                            size="small"
                            sx={{
                              background: `rgba(16, 185, 129, 0.2)`,
                              color: theme.success,
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={crypto.isActive ? '✓ Ativa' : '✗ Inativa'}
                        color={crypto.isActive ? 'success' : 'default'}
                        variant="outlined"
                        onClick={() => handleToggleActive(crypto._id, crypto.isActive)}
                        sx={{ cursor: 'pointer' }}
                      />
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: theme.darkLight, color: theme.text }}>
          {editingId ? 'Editar Cripto' : 'Nova Cripto'}
        </DialogTitle>
        <DialogContent sx={{ background: theme.darkLight }}>
          <Stack spacing={3} sx={{ pt: 2 }}>
            {/* Nome */}
            <TextField
              fullWidth
              label="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            {/* Símbolo */}
            <TextField
              fullWidth
              label="Símbolo"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            />

            {/* Preço */}
            <TextField
              fullWidth
              label="Preço (R$)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              inputProps={{ step: 0.01, min: 0 }}
            />

            {/* Descrição */}
            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            {/* Imagem */}
            <Box>
              <Box sx={{ mb: 2, p: 2, background: `rgba(59, 91, 219, 0.1)`, borderRadius: 1, textAlign: 'center' }}>
                {formData.imagePreview ? (
                  <Box>
                    <Box
                      component="img"
                      src={formData.imagePreview}
                      alt="Preview"
                      sx={{ maxWidth: '100%', maxHeight: 120, borderRadius: 1, mb: 1 }}
                    />
                    <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                      Imagem carregada
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ color: theme.textSecondary }}>Nenhuma imagem</Typography>
                )}
              </Box>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Selecionar Imagem
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>

            {/* Planos */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text, mb: 2 }}>
                Planos de Investimento
              </Typography>

              {formData.plans.map((plan, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    background: `rgba(59, 91, 219, 0.1)`,
                    border: `1px solid rgba(59, 91, 219, 0.2)`,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                    <TextField
                      label="Período (dias)"
                      type="number"
                      value={plan.period}
                      onChange={(e) => handlePlanChange(index, 'period', e.target.value)}
                      sx={{ flex: 1 }}
                      size="small"
                    />
                    <TextField
                      label="Rendimento (%)"
                      type="number"
                      step="0.1"
                      value={plan.yieldPercentage}
                      onChange={(e) => handlePlanChange(index, 'yieldPercentage', e.target.value)}
                      sx={{ flex: 1 }}
                      size="small"
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemovePlan(index)}
                      sx={{ mt: 0.5 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              ))}

              <Button
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleAddPlan}
                sx={{ color: theme.primary, borderColor: theme.primary, mt: 1 }}
                variant="outlined"
              >
                Adicionar Plano
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ background: theme.darkLight, p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
