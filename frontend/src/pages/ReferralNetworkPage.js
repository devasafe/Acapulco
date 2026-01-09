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
  Button,
  Alert,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import PageLayout from '../components/PageLayout';
import { getReferralStats } from '../services/referralService';

const ReferralNetworkPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referralData, setReferralData] = useState({
    referralCode: '',
    totalReferrals: 0,
    referrals: [],
    totalBonusEarned: 0,
    bonusCount: 0,
    bonusTransactions: []
  });
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const response = await getReferralStats(token);
      setReferralData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar dados de referência');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setSuccess('Código copiado!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleShare = () => {
    setOpenShareDialog(true);
  };

  const shareMessage = `Use meu código de referência: ${referralData.referralCode}`;

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(shareMessage + '\nGanhe bônus no seu primeiro saque!');
    window.open(`https://wa.me/?text=${message}`, '_blank');
    setOpenShareDialog(false);
  };

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
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Seu Código de Referência */}
        <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` }}>
          <CardContent>
            <Typography color="white" variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShareIcon /> Seu Código de Referência
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <TextField
                value={referralData.referralCode}
                readOnly
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { color: 'white', background: 'rgba(255,255,255,0.1)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                  flex: 1
                }}
              />
              <Tooltip title="Copiar código">
                <IconButton
                  onClick={handleCopyCode}
                  sx={{ color: 'white', '&:hover': { background: 'rgba(255,255,255,0.2)' } }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { background: 'rgba(255,255,255,0.3)' }
                }}
              >
                Compartilhar
              </Button>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mt: 2 }}>
              Compartilhe este código com seus amigos. Eles ganham bônus no primeiro saque!
            </Typography>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Total de Indicações
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.primary }}>
                      {referralData.totalReferrals}
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
                      Bônus Ganhos
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.success }}>
                      R$ {referralData.totalBonusEarned.toFixed(2)}
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
                      Saques Bonificados
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.warning }}>
                      {referralData.bonusCount}
                    </Typography>
                  </Box>
                  <PriceChangeIcon sx={{ fontSize: 40, color: theme.warning, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Meus Indicados */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon /> Meus Indicados ({referralData.totalReferrals})
            </Typography>

            {referralData.referrals.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                Você ainda não tem indicações. Compartilhe seu código para começar a ganhar!
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `rgba(59, 91, 219, 0.05)` }}>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Nome</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Email</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.primary }}>Saldo</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Data de Cadastro</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {referralData.referrals.map((ref) => (
                    <TableRow key={ref._id} sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                      <TableCell sx={{ color: theme.text }}>{ref.name}</TableCell>
                      <TableCell sx={{ color: theme.textSecondary }}>{ref.email}</TableCell>
                      <TableCell align="right" sx={{ color: theme.success, fontWeight: 600 }}>
                        R$ {(ref.wallet || 0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: theme.textSecondary }}>
                        {new Date(ref.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ref.isActive ? 'Ativo' : 'Inativo'}
                          size="small"
                          color={ref.isActive ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Bônus */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon /> Histórico de Bônus
            </Typography>

            {referralData.bonusTransactions.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                Nenhum bônus recebido ainda
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `rgba(59, 91, 219, 0.05)` }}>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Descrição</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.primary }}>Valor</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.primary }}>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {referralData.bonusTransactions.map((tx) => (
                    <TableRow key={tx._id} sx={{ borderBottom: `1px solid rgba(59, 91, 219, 0.1)` }}>
                      <TableCell sx={{ color: theme.text }}>{tx.description}</TableCell>
                      <TableCell align="right" sx={{ color: theme.success, fontWeight: 700 }}>
                        + R$ {(tx.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: theme.textSecondary }}>
                        {new Date(tx.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Share Dialog */}
        <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)}>
          <DialogTitle>Compartilhar Código</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Escolha como deseja compartilhar seu código de referência:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={shareMessage}
              readOnly
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenShareDialog(false)}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={() => {
                navigator.clipboard.writeText(shareMessage);
                setSuccess('Texto copiado!');
                setOpenShareDialog(false);
                setTimeout(() => setSuccess(''), 3000);
              }}
            >
              Copiar Texto
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleShareWhatsApp}
            >
              WhatsApp
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageLayout>
  );
};

export default ReferralNetworkPage;
