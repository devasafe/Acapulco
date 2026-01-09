import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import PageLayout from '../components/PageLayout';
import { getAdminReferralProfits, getAdminReferralBonusDetails } from '../services/referralService';

const AdminReferralProfitsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profits, setProfits] = useState([]);
  const [bonusDetails, setBonusDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profitsRes, detailsRes] = await Promise.all([
        getAdminReferralProfits(token),
        getAdminReferralBonusDetails(token)
      ]);
      setProfits(profitsRes.data);
      setBonusDetails(detailsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const filteredBonusDetails = bonusDetails.filter(detail =>
    detail.referrer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.referrer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.referred.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.referred.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBonusEarned = profits.reduce((sum, p) => sum + p.totalBonusEarned, 0);
  const avgBonus = profits.length > 0 ? totalBonusEarned / profits.length : 0;

  if (loading) {
    return (
      <PageLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon /> Lucros de Referência
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Total de Referenciadores
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.primary }}>
                      {profits.length}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: theme.primary, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Total em Bônus Distribuído
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.success }}>
                      R$ {totalBonusEarned.toFixed(2)}
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, color: theme.success, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Bônus Médio por Referenciador
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.warning }}>
                      R$ {avgBonus.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ fontSize: 40, color: theme.warning, opacity: 0.3 }}>💰</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Histórico Detalhado de Bônus */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Histórico de Bônus Pagos ({filteredBonusDetails.length})
              </Typography>
              <TextField
                placeholder="Buscar por nome ou email..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
            </Box>

            {filteredBonusDetails.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                {bonusDetails.length === 0 ? 'Nenhum bônus de referência distribuído ainda' : 'Nenhum resultado encontrado'}
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `rgba(59, 91, 219, 0.05)` }}>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Quem Recebeu</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Conta Criada</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Email da Conta</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.primary }}>
                      Valor do Bônus
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBonusDetails.map((detail) => (
                    <TableRow key={detail.transactionId} sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                      <TableCell sx={{ color: theme.text, fontWeight: 600 }}>
                        {detail.referrer.name}
                        <Chip
                          label={detail.referrer.referralCode}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, height: 24, fontSize: 11 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: theme.textSecondary }}>
                        {detail.referrer.email}
                      </TableCell>
                      <TableCell sx={{ color: theme.text, fontWeight: 600 }}>
                        {detail.referred.name}
                      </TableCell>
                      <TableCell sx={{ color: theme.textSecondary }}>
                        {detail.referred.email}
                      </TableCell>
                      <TableCell align="right" sx={{ color: theme.success, fontWeight: 700 }}>
                        R$ {detail.bonusAmount.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: theme.textSecondary }}>
                        {new Date(detail.bonusDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Container>
    </PageLayout>
  );
};

export default AdminReferralProfitsPage;
