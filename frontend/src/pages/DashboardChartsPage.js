import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  useTheme,
} from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PageLayout from '../components/PageLayout';

// Dados de exemplo
const carteiraMockData = [
  { month: 'Jan', value: 5000 },
  { month: 'Fev', value: 7500 },
  { month: 'Mar', value: 6800 },
  { month: 'Abr', value: 9200 },
  { month: 'Mai', value: 10500 },
  { month: 'Jun', value: 12000 },
];

const ganhosMockData = [
  { month: 'Jan', ganho: 100 },
  { month: 'Fev', ganho: 250 },
  { month: 'Mar', ganho: 180 },
  { month: 'Abr', ganho: 450 },
  { month: 'Mai', ganho: 700 },
  { month: 'Jun', ganho: 1000 },
];

const composicaoMockData = [
  { name: 'Criptomoedas', value: 35 },
  { name: 'Imóveis', value: 40 },
  { name: 'Outros', value: 25 },
];

const movimentacaoMockData = [
  { month: 'Jan', entrada: 5000, saida: 2000 },
  { month: 'Fev', entrada: 3000, saida: 1000 },
  { month: 'Mar', entrada: 4000, saida: 1500 },
  { month: 'Abr', entrada: 6000, saida: 2000 },
  { month: 'Mai', entrada: 5500, saida: 1800 },
  { month: 'Jun', entrada: 7000, saida: 2500 },
];

const investidoresMockData = [
  { status: 'Ativos', count: 8 },
  { status: 'Completados', count: 5 },
];

const indicacoesMockData = [
  { month: 'Jan', acumulado: 2 },
  { month: 'Fev', acumulado: 5 },
  { month: 'Mar', acumulado: 8 },
  { month: 'Abr', acumulado: 12 },
  { month: 'Mai', acumulado: 18 },
  { month: 'Jun', acumulado: 25 },
];

const COLORS = ['#3B5BDB', '#7C3AED', '#10B981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ backgroundColor: '#1f2937', padding: '8px', borderRadius: '4px', border: '1px solid #374151' }}>
        <Typography variant="body2" sx={{ color: '#fff' }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const DashboardChartsPage = () => {
  const theme = useTheme();

  useEffect(() => {
    // Componente montado
  }, []);

  return (
    <PageLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          📊 Análise de Dados
        </Typography>

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {/* Gráfico 1: Evolução da Carteira */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#fff', height: '240px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                📈 Evolução da Carteira
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={carteiraMockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCarteira" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorCarteira)"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Gráfico 2: Ganhos ao Longo do Tempo */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#fff', height: '240px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                📈 Ganhos ao Longo do Tempo
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={ganhosMockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorGanhos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="ganho"
                    stroke="#F59E0B"
                    fillOpacity={1}
                    fill="url(#colorGanhos)"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Gráfico 3: Composição de Investimentos (Donut) */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#fff', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.palette.text.secondary, width: '100%', textAlign: 'center' }}>
                🥧 Composição de Investimentos
              </Typography>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={composicaoMockData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="value"
                    cornerRadius={12}
                    stroke="none"
                  >
                    {composicaoMockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Gráfico 4: Movimentação Mensal */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#fff', height: '240px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                📊 Movimentação Mensal
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={movimentacaoMockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="entrada" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="saida" fill="#EF4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Gráfico 5: Investidores por Status */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#fff', height: '240px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                👥 Investidores por Status
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={investidoresMockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="status" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#3B5BDB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* Gráfico 6: Indicações Acumuladas */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#fff', height: '240px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                🎯 Indicações Acumuladas
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={indicacoesMockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorIndicacoes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="acumulado"
                    stroke="#7C3AED"
                    fillOpacity={1}
                    fill="url(#colorIndicacoes)"
                    strokeWidth={2}
                    dot={{ fill: '#7C3AED', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </PageLayout>
  );
};

export default DashboardChartsPage;
