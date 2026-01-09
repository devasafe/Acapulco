#!/usr/bin/env python3
"""
Script para gerar a página de detalhes de criptmoedas (CryptoDetailPage.js)
com design premium profissional.
"""

import os

def generate_crypto_detail_page():
    """Gera o arquivo CryptoDetailPage.js com design clean e compacto."""
    
    code = '''import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  CircularProgress,
  Stack,
  FormControl,
  Radio,
  RadioGroup,
  Divider,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { getCryptoById } from '../services/cryptoService';
import { investInCrypto } from '../services/investmentService';
import CryptoChart from '../components/CryptoChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

const theme = {
  primary: '#3B5BDB',
  secondary: '#6B46C1',
  success: '#10B981',
  dark: '#0F1117',
  darkLight: '#1A1F2E',
  darker: '#252D3D',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
};

function formatTimeUnit(days) {
  if (!days) return '';
  if (days === 30) return '30 dias';
  if (days === 90) return '3 meses';
  if (days === 180) return '6 meses';
  if (days === 365) return '1 ano';
  return `${days} dias`;
}

export default function CryptoDetailPage() {
  const { id } = useParams();
  const [crypto, setCrypto] = useState(null);
  const [investmentPlan, setInvestmentPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCryptoById(id)
      .then(res => {
        setCrypto(res.data);
        if (res.data.plans && res.data.plans.length > 0) {
          setInvestmentPlan(String(res.data.plans[0].period));
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar criptmoeda');
        setLoading(false);
      });
  }, [id]);

  const handleInvest = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Faça login para investir.');
      return;
    }

    try {
      setInvesting(true);
      await investInCrypto(crypto._id, priceNum, Number(investmentPlan), token);
      alert(`Investimento realizado com sucesso!`);
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao realizar investimento.');
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Container sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Container>
      </PageLayout>
    );
  }

  if (!crypto) {
    return (
      <PageLayout>
        <Container sx={{ py: 4 }}>
          <Alert severity="error">Criptmoeda não encontrada</Alert>
        </Container>
      </PageLayout>
    );
  }

  const selectedPlanObj = (crypto.plans || []).find(p => String(p.period) === investmentPlan) || null;
  const selectedYield = selectedPlanObj ? Number(selectedPlanObj.yieldPercentage) || 0 : 0;
  const priceNum = Number(crypto.price) || 0;
  const expectedProfit = Number((priceNum * selectedYield) / 100) || 0;
  const totalReturn = priceNum + expectedProfit;

  return (
    <PageLayout>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3, color: theme.primary }}>
          Voltar
        </Button>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Crypto Info Card */}
        <Card sx={{ p: 3, mb: 3, bgcolor: theme.darkLight, border: `1px solid ${theme.darker}` }}>
          <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: 70, 
              height: 70, 
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <CurrencyBitcoinIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: theme.text }}>
                {crypto.name}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.primary, fontWeight: 700 }}>
                {crypto.symbol}
              </Typography>
            </Box>
            {crypto.description && (
              <Typography variant="caption" sx={{ color: theme.textSecondary, lineHeight: 1.5 }}>
                {crypto.description}
              </Typography>
            )}
            <Divider sx={{ width: '100%', borderColor: theme.darker }} />
            <Box sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ color: theme.textTertiary }}>
                Valor
              </Typography>
              <Typography variant="h5" sx={{ color: theme.primary, fontWeight: 800 }}>
                R$ {priceNum.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Chart */}
        <Card sx={{ p: 2, mb: 3, bgcolor: theme.darkLight, border: `1px solid ${theme.darker}` }}>
          <CryptoChart symbol={crypto.symbol} />
        </Card>

        {/* Plans */}
        <Card sx={{ p: 3, mb: 3, bgcolor: theme.darkLight, border: `1px solid ${theme.darker}` }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: theme.text, mb: 2 }}>
            Selecione o Plano
          </Typography>
          <FormControl fullWidth>
            <RadioGroup value={investmentPlan} onChange={(e) => setInvestmentPlan(e.target.value)}>
              <Stack spacing={1}>
                {(crypto.plans || []).map((plan, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setInvestmentPlan(String(plan.period))}
                    sx={{
                      p: 2,
                      border: `1px solid ${investmentPlan === String(plan.period) ? theme.primary : theme.darker}`,
                      borderRadius: '8px',
                      bgcolor: investmentPlan === String(plan.period) ? `${theme.primary}10` : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      '&:hover': {
                        borderColor: theme.primary,
                        bgcolor: `${theme.primary}08`,
                      }
                    }}
                  >
                    <Radio checked={investmentPlan === String(plan.period)} size="small" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.text }}>
                        {formatTimeUnit(plan.period)}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: theme.success, fontWeight: 700, fontSize: '0.9rem' }}>
                      +{plan.yieldPercentage}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
        </Card>

        {/* Summary */}
        <Card sx={{ p: 3, mb: 3, bgcolor: `${theme.primary}08`, border: `1px solid ${theme.primary}20` }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                Investimento
              </Typography>
              <Typography variant="body2" sx={{ color: theme.primary, fontWeight: 700 }}>
                R$ {priceNum.toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                Rendimento ({selectedYield}%)
              </Typography>
              <Typography variant="body2" sx={{ color: theme.success, fontWeight: 700 }}>
                +R$ {expectedProfit.toFixed(2)}
              </Typography>
            </Stack>
            <Divider sx={{ borderColor: `${theme.primary}30` }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600 }}>
                Total em {formatTimeUnit(investmentPlan)}
              </Typography>
              <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 800 }}>
                R$ {totalReturn.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Card>

        {/* Button */}
        <Button
          fullWidth
          variant="contained"
          size="medium"
          onClick={handleInvest}
          disabled={investing}
          startIcon={<TrendingUpIcon />}
          sx={{
            bgcolor: theme.success,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover:not(:disabled)': {
              bgcolor: '#059669',
            },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {investing ? <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> : 'Investir'}
        </Button>
      </Container>
    </PageLayout>
  );
}
'''
    
    return code

def main():
    output_path = 'd:\\\\PROJETOS\\\\Acapulco\\\\frontend\\\\src\\\\pages\\\\CryptoDetailPage.js'
    code = generate_crypto_detail_page()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(code)
    
    print(f"✅ Arquivo gerado com sucesso!")
    print(f"📏 {len(code.splitlines())} linhas de código")
    print("\n✨ Design Clean & Compacto:")
    print("   � Espaçamento reduzido")
    print("   ⚡ Removido padding excessivo")
    print("   � Layout minimalista")
    print("   � Apenas essencial visível")
    print("   � Tamanhos otimizados")

if __name__ == '__main__':
    main()
