import React, { useEffect, useState } from 'react';
import { getReferralPercentage, setReferralPercentage } from '../services/adminService';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

const AdminReferralSettingsPage = () => {
  const [percentage, setPercentage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchPercentage() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const value = await getReferralPercentage(token);
        setPercentage(value);
      } catch (err) {
        setError('Erro ao buscar porcentagem.');
      }
      setLoading(false);
    }
    fetchPercentage();
  }, []);

  const handleChange = (e) => {
    setPercentage(e.target.value);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await setReferralPercentage(percentage, token);
      setSuccess('Porcentagem atualizada com sucesso!');
    } catch (err) {
      setError('Erro ao salvar porcentagem.');
    }
    setSaving(false);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Configuração de Porcentagem de Indicação
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              label="Porcentagem de Indicação (%)"
              type="number"
              value={percentage}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: 100 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
            >
              Salvar
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </>
        )}
      </Box>
    </Container>
  );
};

export default AdminReferralSettingsPage;
