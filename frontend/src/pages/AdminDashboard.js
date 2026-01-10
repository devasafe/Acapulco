import React, { useEffect, useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { connectSocket, disconnectSocket } from '../services/socketService';
import { getToken } from '../utils/auth';
import UserProfileDrawer from '../components/UserProfileDrawer';
import CryptoHoldersDrawer from '../components/CryptoHoldersDrawer';
import { getCryptoById } from '../services/cryptoService';
import {
  Box,
  Grid,
  Paper,
  Card,
  Typography,
  ButtonGroup,
  Button,
  Divider,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import styles from './AdminDashboard.module.css';
import { getAreaChartConfig, getBarChartConfig, getDoughnutChartConfig, getSparklineChartConfig } from '../utils/chartConfig';

const PERIOD_OPTIONS = [7, 30, 90];

const AdminDashboard = () => {
  const [events, setEvents] = useState([]); // newest first
  const [kpis, setKpis] = useState({ totalDeposits: 0, totalWithdrawals: 0, netFlow: 0, totalUsers: 0 });
  const [referralProfits, setReferralProfits] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [cryptos, setCryptos] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loadingCrypto, setLoadingCrypto] = useState(false);
  const [cryptoDrawerOpen, setCryptoDrawerOpen] = useState(false);
  const [referralPercentage, setReferralPercentage] = useState(null);
  const [period, setPeriod] = useState(30); // days
  const [filterType, setFilterType] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [focus, setFocus] = useState(null); // { type, data }
  const [focusOpen, setFocusOpen] = useState(false);
  const token = getToken();
  // Modal genérico de detalhes
  const FocusModal = ({ open, onClose, focus }) => {
    if (!focus) return null;
    const isChart = focus.type === 'area' || focus.type === 'bar' || focus.type === 'donut';
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(20,24,34,0.85)',
          zIndex: 2000,
          display: open ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          animation: open ? 'fadeInBg 0.3s' : 'none',
        }}
        onClick={onClose}
      >
        <Box
          sx={{
            minWidth: isChart ? 600 : 360,
            maxWidth: isChart ? '90vw' : 480,
            maxHeight: isChart ? '90vh' : undefined,
            bgcolor: 'rgba(24,31,46,0.85)',
            borderRadius: 6,
            boxShadow: '0 16px 64px 0 rgba(0,201,183,0.18), 0 2px 24px 0 #000a',
            p: isChart ? 4 : 5,
            color: '#e6eef8',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(0,201,183,0.18)',
            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            animation: open ? 'slideUpModal 0.4s cubic-bezier(.4,0,.2,1)' : 'none',
          }}
          onClick={e => e.stopPropagation()}
        >
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, color: '#fff', bgcolor: 'rgba(0,201,183,0.12)', '&:hover': { bgcolor: 'rgba(0,201,183,0.25)' }, boxShadow: '0 2px 8px #00c9b733' }}>
            <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>×</span>
          </IconButton>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 900, color: 'transparent', background: 'linear-gradient(90deg,#00c9b7 0%,#667eea 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px', textAlign: 'center' }}>
            {focus.title || (focus.type === 'area' ? 'Fluxo Líquido' : focus.type === 'bar' ? 'Depósitos vs Saques' : focus.type === 'donut' ? 'Distribuição de Carteiras' : 'Detalhes')}
          </Typography>
          <Divider sx={{ mb: 3, borderColor: 'rgba(0,201,183,0.15)' }} />
          {focus.type === 'donut' ? (
            (() => {
              // Espera-se que focus.options.labels e focus.series estejam disponíveis
              const labels = (focus.options?.labels || []);
              const series = (focus.series || []);
              if (!labels.length || !series.length) return null;
              // Ordena do maior para o menor
              const data = labels.map((name, i) => ({ name, value: series[i] })).sort((a, b) => b.value - a.value);
              const max = data.length > 0 ? data[0].value : 1;
              return (
                <Box sx={{ width: '100%', minWidth: 320, maxWidth: 480, mt: 2 }}>
                  {data.map((row, idx) => (
                    <Box key={row.name} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(0,201,183,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#00c9b7', fontSize: 18, mr: 1 }}>{idx + 1}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: '#e6eef8', fontSize: 16, mb: 0.5 }}>{row.name}</Typography>
                        <Box sx={{ width: '100%', height: 14, bgcolor: 'rgba(0,201,183,0.08)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                          <Box sx={{ width: `${max > 0 ? (row.value / max) * 100 : 0}%`, height: '100%', bgcolor: 'linear-gradient(90deg,#00c9b7 0%,#667eea 100%)', borderRadius: 2, transition: 'width 0.4s' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: '#4ade80', fontSize: 16, minWidth: 90, textAlign: 'right', ml: 2 }}>
                        R$ {Number(row.value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              );
            })()
          ) : isChart ? (
            <Chart
              options={focus.options}
              series={focus.series}
              type={focus.type}
              height={500}
              width={900}
            />
          ) : (
            <Box sx={{ width: '100%', overflowX: 'auto', mt: 1 }}>
              {focus.content && focus.content.includes(' - R$ ')
                ? (() => {
                    // Tenta detectar colunas: Nome, Valor, Data
                    const rows = focus.content.split(/---/g).map(line => line.trim()).filter(Boolean);
                    // Exemplo de linha: "Nome - R$ 123,45\n01/01/2024"
                    const parsed = rows.map(row => {
                      const [first, ...rest] = row.split('\n');
                      // first: "Nome - R$ 123,45", rest[0]: "01/01/2024" (opcional)
                      const [name, value] = first.split(' - R$ ');
                      return {
                        name: name?.trim() || '',
                        value: value?.trim() || '',
                        date: rest[0]?.trim() || '',
                      };
                    });
                    const hasDate = parsed.some(r => r.date);
                    return (
                      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(0,201,183,0.04)', borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 12px 0 rgba(0,201,183,0.08)' }}>
                        <Box component="thead" sx={{ background: 'rgba(0,201,183,0.10)' }}>
                          <Box component="tr">
                            <Box component="th" sx={{ textAlign: 'left', py: 1, px: 2, color: '#00c9b7', fontWeight: 700, fontSize: 15 }}>Nome</Box>
                            <Box component="th" sx={{ textAlign: 'left', py: 1, px: 2, color: '#00c9b7', fontWeight: 700, fontSize: 15 }}>Valor</Box>
                            {hasDate && <Box component="th" sx={{ textAlign: 'left', py: 1, px: 2, color: '#00c9b7', fontWeight: 700, fontSize: 15 }}>Data</Box>}
                          </Box>
                        </Box>
                        <Box component="tbody">
                          {parsed.map((row, idx) => (
                            <Box component="tr" key={idx} sx={{ borderBottom: '1px solid rgba(0,201,183,0.08)', '&:last-child': { borderBottom: 'none' } }}>
                              <Box component="td" sx={{ py: 1.5, px: 2, color: '#e6eef8', fontWeight: 500 }}>{row.name}</Box>
                              <Box component="td" sx={{ py: 1.5, px: 2, color: '#4ade80', fontWeight: 700 }}>R$ {row.value}</Box>
                              {hasDate && <Box component="td" sx={{ py: 1.5, px: 2, color: '#b5eaea', fontWeight: 400 }}>{row.date}</Box>}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    );
                  })()
                : <Box sx={{ fontFamily: 'monospace', fontSize: 15, color: '#b5eaea', whiteSpace: 'pre-line' }}>{focus.content || JSON.stringify(focus.data, null, 2)}</Box>
              }
            </Box>
          )}
        </Box>
        {/* Animations */}
        <style>{`
          @keyframes fadeInBg {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUpModal {
            from { opacity: 0; transform: translateY(60px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </Box>
    );
  };

  useEffect(() => {
    // fetch recent events and referral profits from backend
    const fetchAdminEvents = async () => {
      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const res = await axios.get(base + '/api/admin/events', { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data || {};
        console.log('📊 Resposta /api/admin/events:', data);
        const transactionsRaw = data.transactions || [];
        console.log('📊 Transações brutas:', transactionsRaw.slice(0, 5));
        const txEvents = transactionsRaw.map(t => ({ id: t.id, event: t.type, amount: t.amount, date: t.date, userName: t.userName, userEmail: t.userEmail }));
        console.log('📊 Eventos mapeados:', txEvents.slice(0, 5));
  const regEvents = (data.registrations || []).map(r => ({ id: r.id, event: 'registration', name: r.name, email: r.email, indicadoPorName: r.indicadoPorName || null, indicadoPorEmail: r.indicadoPorEmail || null, date: r.date }));
        const combined = [...txEvents, ...regEvents].sort((a,b)=> new Date(b.date) - new Date(a.date));
        setEvents(combined.slice(0, 1000));
  // categorize
  setDeposits(txEvents.filter(t => ['deposit','buy'].includes(t.event)));
  setWithdrawals(txEvents.filter(t => ['withdrawal','sell'].includes(t.event)));
  setReferrals(txEvents.filter(t => t.event === 'referral'));
  setRegistrations(regEvents);
        // fetch users list
        try {
          const usersRes = await axios.get(base + '/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
          setUsersList(usersRes.data.users || []);
        } catch (e) {
          console.info('Não foi possível carregar lista de usuários', e.message);
        }
        // referral profits to side panel
        if (data.referralProfits) setReferralProfits(data.referralProfits);
        // try fetch referral percentage
        try {
          const percRes = await axios.get(base + '/api/admin/settings/referral-percentage', { headers: { Authorization: `Bearer ${token}` } });
          setReferralPercentage(percRes.data?.percentage ?? null);
        } catch (e) {
          // ignore if not available
        }
        // fetch cryptos with holders count
        try {
          const cryptosRes = await axios.get(base + '/api/admin/cryptos', { headers: { Authorization: `Bearer ${token}` } });
          setCryptos(cryptosRes.data || []);
        } catch (e) {
          console.info('Não foi possível carregar criptos', e.message);
        }
        // fetch investments for pie chart
        try {
          const investmentsRes = await axios.get(base + '/api/admin/investments', { headers: { Authorization: `Bearer ${token}` } });
          setInvestments(investmentsRes.data || []);
        } catch (e) {
          console.info('Não foi possível carregar investimentos', e.message);
        }
        // try to fetch aggregated metrics snapshot (if backend exposes it)
        try {
          const metricsRes = await axios.get(base + '/api/admin/metrics', { headers: { Authorization: `Bearer ${token}` } });
          const m = metricsRes.data || {};
          setKpis({
            totalDeposits: Number(m.totalDeposits || 0),
            totalWithdrawals: Number(m.totalWithdrawals || 0),
            netFlow: Number((m.totalDeposits || 0) - (m.totalWithdrawals || 0)),
            totalUsers: Number(m.totalUsers || 0)
          });
        } catch (e) {
          // fallback: compute simple totals from fetched txEvents
          const totalDeposits = txEvents.filter(t => ['deposit','buy','yield','referral'].includes(t.event)).reduce((s, t) => s + Number(t.amount || 0), 0) || 0;
          const totalWithdrawals = txEvents.filter(t => ['withdrawal','sell'].includes(t.event)).reduce((s, t) => s + Number(t.amount || 0), 0) || 0;
          setKpis({ totalDeposits, totalWithdrawals, netFlow: totalDeposits - totalWithdrawals, totalUsers: regEvents.length || 0 });
        }
      } catch (err) {
        console.info('Não foi possível carregar eventos administrativos:', err.response?.status || err.message);
      }
    };
    fetchAdminEvents();

    const socket = connectSocket(token);
  socket.on('connect', () => console.log('Socket conectado', socket.id));

    socket.on('metrics_update', (payload) => {
      console.log('📊 metrics_update recebido:', payload);
      // normalize incoming payload into our events shape
      const ev = {
        id: payload.id || Date.now(),
        event: payload.event || payload.type || 'unknown',
        amount: payload.amount || 0,
        date: payload.date || payload.createdAt || new Date().toISOString(),
        userName: payload.userName || payload.user?.name || payload.user?.email || null
      };
      console.log('📊 Evento normalizado:', ev);
      setEvents(prev => [ev, ...prev].slice(0, 1000));
      // also add to categorized lists
      if (['deposit','buy','yield'].includes(ev.event)) setDeposits(prev => [ev, ...prev].slice(0,100));
      if (['withdrawal','sell'].includes(ev.event)) setWithdrawals(prev => [ev, ...prev].slice(0,100));
      if (ev.event === 'referral') setReferrals(prev => [ev, ...prev].slice(0,100));
      if (ev.event === 'registration' || ev.event === 'signup') setRegistrations(prev => [ev, ...prev].slice(0,100));
      setKpis(prev => {
        const next = { ...prev };
        if (payload.event === 'deposit' || payload.event === 'buy' || payload.event === 'yield' || payload.event === 'referral') {
          next.totalDeposits = (prev.totalDeposits || 0) + Number(payload.amount || 0);
        }
        if (payload.event === 'sell' || payload.event === 'withdrawal') {
          next.totalWithdrawals = (prev.totalWithdrawals || 0) + Number(payload.amount || 0);
        }
        next.netFlow = (next.totalDeposits || 0) - (next.totalWithdrawals || 0);
        return next;
      });
    });

  socket.on('connect_error', (err) => console.error('Erro de conexão do socket', err));

    return () => disconnectSocket();
  }, [token]);

  const exportEvents = () => {
    // export current events as CSV
    const rows = filteredEvents.map(ev => ({
      date: new Date(ev.date || Date.now()).toISOString(),
      type: ev.event,
      amount: ev.amount || 0,
      user: ev.userName || ev.userEmail || ev.name || ''
    }));
    const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // apply filters to events for display
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      if (filterType !== 'all' && ev.event !== filterType) return false;
      if (filterQuery) {
        const q = filterQuery.toLowerCase();
        const name = (ev.userName || ev.userEmail || ev.name || '').toLowerCase();
        if (!name.includes(q) && !(String(ev.amount||'')).includes(q)) return false;
      }
      if (filterFrom) {
        const from = new Date(filterFrom);
        if (new Date(ev.date) < from) return false;
      }
      if (filterTo) {
        const to = new Date(filterTo);
        to.setHours(23,59,59,999);
        if (new Date(ev.date) > to) return false;
      }
      return true;
    });
  }, [events, filterType, filterQuery, filterFrom, filterTo]);

  // aggregate events into timeseries by day for selected period
  const aggregated = useMemo(() => {
    console.log('📊 Agregando. filteredEvents:', filteredEvents.length);
    console.log('📊 Primeiros 3 eventos:', filteredEvents.slice(0, 3));
    
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - (period - 1));
    start.setHours(0,0,0,0);
    
    // Estender o range para 5 dias no futuro para lidar com diferenças de timezone/clock durante o processamento
    const end = new Date(now);
    end.setDate(end.getDate() + 5);
    end.setHours(23,59,59,999);
    
    const byDate = {};
    
    // Preencher dias
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0,10);
      byDate[key] = { deposit: 0, withdrawal: 0 };
    }
    
    console.log('📊 Dias criados:', Object.keys(byDate).length, 'de', start.toISOString().slice(0,10), 'a', end.toISOString().slice(0,10));
    
    // Processar eventos
    filteredEvents.forEach(ev => {
      try {
        // Garantir que a data é um objeto Date válido
        let eventDate = ev.date;
        if (typeof eventDate === 'string') {
          eventDate = new Date(eventDate);
        }
        
        if (isNaN(eventDate.getTime())) {
          console.warn('📊 Data inválida:', ev.date, ev);
          return;
        }
        
        const key = eventDate.toISOString().slice(0,10);
        
        if (!byDate[key]) {
          console.warn('📊 Data fora do range:', key, ev);
          return;
        }
        
        const amount = Number(ev.amount || 0);
        console.log('📊 Processando:', { event: ev.event, amount, date: key });
        
        if (['deposit','buy','yield','referral'].includes(ev.event)) {
          byDate[key].deposit += amount;
        }
        if (['withdrawal','sell'].includes(ev.event)) {
          byDate[key].withdrawal += amount;
        }
      } catch (err) {
        console.error('📊 Erro ao processar evento:', err, ev);
      }
    });
    
    // Filtrar apenas até hoje
    const todayKey = now.toISOString().slice(0,10);
    const allLabels = Object.keys(byDate).sort();
    const labels = allLabels.filter(d => d <= todayKey).slice(-(period));
    const deposits = labels.map(l => byDate[l].deposit);
    const withdrawals = labels.map(l => byDate[l].withdrawal);
    const net = labels.map((_,i) => deposits[i] - withdrawals[i]);
    
    console.log('📊 Final:', { labels, deposits, withdrawals, net });
    return { labels, deposits, withdrawals, net };
  }, [filteredEvents, period]);

  // Professional chart configurations
  const areaOptions = useMemo(() => {
    const config = getAreaChartConfig('Fluxo Líquido');
    config.xaxis.categories = aggregated.labels;
    return config;
  }, [aggregated.labels]);

  const barOptions = useMemo(() => {
    const config = getBarChartConfig('Depósitos vs Saques');
    config.xaxis.categories = aggregated.labels;
    return config;
  }, [aggregated.labels]);

  // Doughnut chart para distribuição de carteiras por pessoa (top 8 usuários)
  // Bar chart para ranking de carteiras (top 8 usuários)
  const { barWalletSeries, barWalletOptions } = useMemo(() => {
    const topUsersByWallet = [...usersList]
      .map(u => ({
        name: u.name || u.email || 'Usuário',
        value: Number(u.wallet || 0)
      }))
      .filter(u => u.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return {
      barWalletSeries: [{
        name: 'Saldo',
        data: topUsersByWallet.map(u => u.value)
      }],
      barWalletOptions: {
        chart: {
          type: 'bar',
          toolbar: { show: false },
          background: 'transparent',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 6,
            barHeight: '60%',
            distributed: true,
            dataLabels: {
              position: 'right',
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `R$ ${Number(val).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`,
          style: {
            fontWeight: 700,
            colors: ['#e6eef8'],
          },
        },
        xaxis: {
          categories: topUsersByWallet.map(u => u.name),
          labels: {
            style: {
              colors: '#e6eef8',
              fontWeight: 700,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#e6eef8',
              fontWeight: 700,
            },
          },
        },
        grid: {
          show: false,
        },
        tooltip: {
          y: {
            formatter: (val) => `R$ ${Number(val).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`,
          },
        },
        colors: ['#00c9b7', '#667eea', '#4ade80', '#facc15', '#f472b6', '#38bdf8', '#f87171', '#a78bfa'],
        title: {
          text: undefined,
        },
        background: 'transparent',
      }
    };
  }, [usersList]);

  // Pie chart para distribuição de investimentos por moeda
  const { pieInvestmentSeries, pieInvestmentOptions } = useMemo(() => {
    if (!investments || investments.length === 0) {
      return { pieInvestmentSeries: [], pieInvestmentOptions: {} };
    }

    // Agrupar investimentos por moeda
    const investmentsByCrypto = {};
    investments.forEach(inv => {
      const cryptoName = inv.crypto?.name || 'Desconhecido';
      const cryptoSymbol = inv.crypto?.symbol || '';
      const label = cryptoSymbol ? `${cryptoName} (${cryptoSymbol})` : cryptoName;
      investmentsByCrypto[label] = (investmentsByCrypto[label] || 0) + 1;
    });

    const labels = Object.keys(investmentsByCrypto);
    const series = Object.values(investmentsByCrypto);

    return {
      pieInvestmentSeries: series,
      pieInvestmentOptions: {
        chart: { type: 'donut', background: 'transparent' },
        labels,
        colors: ['#00ffff', '#ff00ff', '#00ff88', '#ffff00', '#ff6b6b', '#4ecdc4'],
        legend: { position: 'bottom', labels: { colors: '#e6eef8' } },
        plotOptions: {
          pie: {
            donut: {
              size: '55%',
              labels: {
                show: true,
                name: { color: '#e6eef8', fontSize: '14px' },
                value: { color: '#00c9b7', fontSize: '18px', fontWeight: 700 },
                total: { show: true, label: 'Total', color: '#e6eef8', fontSize: '12px', fontWeight: 600, formatter: () => investments.length }
              }
            }
          }
        },
        dataLabels: { enabled: true, style: { fontSize: '12px', fontWeight: 700, colors: ['#000'] }, formatter: (val) => `${Math.round(val)}%` },
        tooltip: { y: { formatter: (val) => `${val} investimentos` } }
      }
    };
  }, [investments]);

  // Sparkline data for KPI trends
  const depositSparkline = useMemo(() => {
    const data = {};
    filteredEvents.filter(e => ['deposit', 'buy', 'yield'].includes(e.event)).forEach(e => {
      const key = new Date(e.date).toISOString().slice(0, 10);
      data[key] = (data[key] || 0) + Number(e.amount || 0);
    });
    return Object.values(data).slice(-7); // Last 7 days
  }, [filteredEvents]);

  const withdrawalSparkline = useMemo(() => {
    const data = {};
    filteredEvents.filter(e => ['withdrawal', 'sell'].includes(e.event)).forEach(e => {
      const key = new Date(e.date).toISOString().slice(0, 10);
      data[key] = (data[key] || 0) + Number(e.amount || 0);
    });
    return Object.values(data).slice(-7); // Last 7 days
  }, [filteredEvents]);

  // resumo dos principais eventos (últimos 10 eventos por valor)
  const topEvents = useMemo(() => {
    return filteredEvents.slice().sort((a,b)=> (Number(b.amount||0) - Number(a.amount||0))).slice(0,8);
  }, [filteredEvents]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a0a2e 25%, #0f1428 50%, #1a0a2e 75%, #0a0e1a 100%)',
        py: 0,
        px: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(0, 255, 255, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(255, 0, 255, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(0, 255, 255, 0.03) 50%, transparent 100%)',
          pointerEvents: 'none',
          animation: 'scanlines 8s linear infinite',
          zIndex: 1,
        }
      }}
    >
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes adminPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes iconGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(0,255,255,0.4), inset 0 0 15px rgba(0,255,255,0.2);
          }
          50% { 
            box-shadow: 0 0 30px rgba(0,255,255,0.8), inset 0 0 20px rgba(0,255,255,0.3);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes neonGlow {
          0%, 100% {
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, inset 0 0 10px currentColor;
          }
          50% {
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, inset 0 0 15px currentColor;
          }
        }
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
      `}</style>
      {/* CONTEÚDO PRINCIPAL */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Box 
          sx={{
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            py: { xs: 2, sm: 3, md: 4 },
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '1920px',
            width: '100%',
          }}
        >
        {/* HEADER PREMIUM */}
        <Box sx={{ mb: 12, position: 'relative', width: '100%' }}>
          <Box sx={{
            position: 'absolute',
            top: -50,
            left: 0,
            right: 0,
            height: 300,
            background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                letterSpacing: '-1px',
              }}
            >
              📊 Dashboard Administrativo
            </Typography>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, mb: 6, maxWidth: 600 }}>
              Acompanhe em tempo real os dados e eventos da plataforma Acapulco
            </Typography>
          </Box>

          {/* CONTROLES DE FILTRO PREMIUM */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              p: 4,
              background: 'rgba(15, 23, 36, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(102, 126, 234, 0.25)',
              borderRadius: '20px',
              mb: 10,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
          <TextField
            size="small"
            select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Tipo"
            sx={{
              minWidth: 130,
              '& .MuiOutlinedInput-root': {
                color: '#e6eef8',
                '& fieldset': { borderColor: 'rgba(102, 126, 234, 0.3)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="deposit">Depósito</MenuItem>
            <MenuItem value="withdrawal">Saque</MenuItem>
            <MenuItem value="referral">Indicação</MenuItem>
          </TextField>
          <TextField
            size="small"
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            label="De"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#e6eef8',
                '& fieldset': { borderColor: 'rgba(102, 126, 234, 0.3)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          />
          <TextField
            size="small"
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            label="Até"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#e6eef8',
                '& fieldset': { borderColor: 'rgba(102, 126, 234, 0.3)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          />
          <TextField
            size="small"
            placeholder="Pesquisar..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                color: '#e6eef8',
                '& fieldset': { borderColor: 'rgba(102, 126, 234, 0.3)' },
              },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 },
            }}
          />
          <Button
            variant="contained"
            onClick={() => exportEvents()}
            startIcon={<DownloadIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transition: 'all 300ms ease',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Exportar
          </Button>
        </Stack>
      </Box>

      {/* SEÇÃO KPIs - CARDS LUXO */}
      <Grid container spacing={6} sx={{ mb: 14, width: '100%' }} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              p: 5,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(0, 201, 183, 0.15) 0%, rgba(0, 255, 221, 0.05) 100%)',
              backdropFilter: 'blur(25px)',
              border: '2px solid rgba(0, 201, 183, 0.4)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 30px rgba(0, 201, 183, 0.25), inset 0 0 20px rgba(0, 201, 183, 0.08)',
              animation: 'fadeInUp 0.8s ease-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'linear-gradient(90deg, #00c9b7, #00ffdd, #00c9b7)',
                boxShadow: '0 0 15px rgba(0,255,221,0.6)',
              },
              '&:hover': {
                border: '2px solid rgba(0, 255, 221, 0.8)',
                boxShadow: '0 0 60px rgba(0, 201, 183, 0.5), inset 0 0 30px rgba(0, 201, 183, 0.15)',
                transform: 'translateY(-6px)',
                background: 'linear-gradient(135deg, rgba(0, 255, 221, 0.2) 0%, rgba(0, 255, 221, 0.08) 100%)',
              },
            }}
          >
            <Stack spacing={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(0,255,221,0.2) 0%, rgba(0,201,183,0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00ffdd',
                    boxShadow: '0 0 25px rgba(0,255,221,0.4), inset 0 0 15px rgba(0,255,221,0.15)',
                    border: '1.5px solid rgba(0,255,221,0.3)',
                  }}
                >
                  <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Depósitos Totais
                </Typography>
                <Typography variant="h3" sx={{ color: '#00ffdd', fontWeight: 900, letterSpacing: '-1px', textShadow: '0 0 20px rgba(0,255,221,0.5)' }}>
                  R$ {Number(kpis.totalDeposits || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              p: 5,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(255, 85, 85, 0.05) 100%)',
              backdropFilter: 'blur(25px)',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.25), inset 0 0 20px rgba(239, 68, 68, 0.08)',
              animation: 'fadeInUp 0.9s ease-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'linear-gradient(90deg, #ef4444, #ff5555, #ef4444)',
                boxShadow: '0 0 15px rgba(255,85,85,0.6)',
              },
              '&:hover': {
                border: '2px solid rgba(255, 85, 85, 0.8)',
                boxShadow: '0 0 60px rgba(239, 68, 68, 0.5), inset 0 0 30px rgba(239, 68, 68, 0.15)',
                transform: 'translateY(-6px)',
                background: 'linear-gradient(135deg, rgba(255, 85, 85, 0.2) 0%, rgba(255, 85, 85, 0.08) 100%)',
              },
            }}
          >
            <Stack spacing={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(255,85,85,0.2) 0%, rgba(239,68,68,0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff5555',
                    boxShadow: '0 0 25px rgba(255,85,85,0.4), inset 0 0 15px rgba(255,85,85,0.15)',
                    border: '1.5px solid rgba(255,85,85,0.3)',
                  }}
                >
                  <TrendingDownIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Saques Totais
                </Typography>
                <Typography variant="h3" sx={{ color: '#ff5555', fontWeight: 900, letterSpacing: '-1px', textShadow: '0 0 20px rgba(255,85,85,0.5)' }}>
                  R$ {Number(kpis.totalWithdrawals || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              p: 5,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(100, 255, 150, 0.05) 100%)',
              backdropFilter: 'blur(25px)',
              border: '2px solid rgba(74, 222, 128, 0.4)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 30px rgba(74, 222, 128, 0.25), inset 0 0 20px rgba(74, 222, 128, 0.08)',
              animation: 'fadeInUp 1s ease-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'linear-gradient(90deg, #4ade80, #64ff96, #4ade80)',
                boxShadow: '0 0 15px rgba(100,255,150,0.6)',
              },
              '&:hover': {
                border: '2px solid rgba(100, 255, 150, 0.8)',
                boxShadow: '0 0 60px rgba(74, 222, 128, 0.5), inset 0 0 30px rgba(74, 222, 128, 0.15)',
                transform: 'translateY(-6px)',
                background: 'linear-gradient(135deg, rgba(100, 255, 150, 0.2) 0%, rgba(100, 255, 150, 0.08) 100%)',
              },
            }}
          >
            <Stack spacing={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(100,255,150,0.2) 0%, rgba(74,222,128,0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64ff96',
                    boxShadow: '0 0 25px rgba(100,255,150,0.4), inset 0 0 15px rgba(100,255,150,0.15)',
                    border: '1.5px solid rgba(100,255,150,0.3)',
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Fluxo Líquido
                </Typography>
                <Typography variant="h3" sx={{ color: '#64ff96', fontWeight: 900, letterSpacing: '-1px', textShadow: '0 0 20px rgba(100,255,150,0.5)' }}>
                  R$ {Number(kpis.netFlow || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              p: 5,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(150, 160, 255, 0.05) 100%)',
              backdropFilter: 'blur(25px)',
              border: '2px solid rgba(102, 126, 234, 0.4)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 30px rgba(102, 126, 234, 0.25), inset 0 0 20px rgba(102, 126, 234, 0.08)',
              animation: 'fadeInUp 1.1s ease-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: 'linear-gradient(90deg, #667eea, #96a0ff, #667eea)',
                boxShadow: '0 0 15px rgba(150,160,255,0.6)',
              },
              '&:hover': {
                border: '2px solid rgba(150, 160, 255, 0.8)',
                boxShadow: '0 0 60px rgba(102, 126, 234, 0.5), inset 0 0 30px rgba(102, 126, 234, 0.15)',
                transform: 'translateY(-6px)',
                background: 'linear-gradient(135deg, rgba(150, 160, 255, 0.2) 0%, rgba(150, 160, 255, 0.08) 100%)',
              },
            }}
          >
            <Stack spacing={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(150,160,255,0.2) 0%, rgba(102,126,234,0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#96a0ff',
                    boxShadow: '0 0 25px rgba(150,160,255,0.4), inset 0 0 15px rgba(150,160,255,0.15)',
                    border: '1.5px solid rgba(150,160,255,0.3)',
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 40 }} />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Total de Usuários
                </Typography>
                <Typography variant="h3" sx={{ color: '#96a0ff', fontWeight: 900, letterSpacing: '-1px', textShadow: '0 0 20px rgba(150,160,255,0.5)' }}>
                  {usersList.length}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* SEÇÃO DE GRÁFICOS PRINCIPAIS - PREMIUM LAYOUT */}
      <Grid container spacing={6} sx={{ mb: 14, width: '100%' }} justifyContent="center" alignItems="center">
        {/* Fluxo Líquido */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{
              p: 6,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(120, 119, 198, 0.06) 100%)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(102, 126, 234, 0.35)',
              borderRadius: '24px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 40px rgba(102, 126, 234, 0.2), inset 0 0 30px rgba(102, 126, 234, 0.1)',
              animation: 'fadeInUp 0.8s ease-out',
              '&:hover': {
                border: '2px solid rgba(102, 126, 234, 0.7)',
                boxShadow: '0 0 80px rgba(102, 126, 234, 0.4), inset 0 0 40px rgba(102, 126, 234, 0.15)',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#e6eef8', mb: 0.5, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', textShadow: '0 0 10px rgba(102,126,234,0.3)' }}>
                  📈 Fluxo Líquido
                </Typography>
                <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '12px' }}>
                  Últimos {period} dias
                </Typography>
              </Box>
              <ButtonGroup variant="outlined" size="small">
                {PERIOD_OPTIONS.map((p) => (
                  <Button
                    key={p}
                    variant={p === period ? 'contained' : 'outlined'}
                    onClick={() => setPeriod(p)}
                    sx={{
                      minWidth: 50,
                      color: p === period ? 'white' : 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(102, 126, 234, 0.5)',
                      background: p === period ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      transition: 'all 300ms ease',
                      boxShadow: p === period ? '0 0 20px rgba(102, 126, 234, 0.4)' : 'none',
                      '&:hover': {
                        borderColor: 'rgba(102, 126, 234, 0.8)',
                        boxShadow: '0 0 15px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    {p}d
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
            <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
            {aggregated.labels && aggregated.labels.length > 0 ? (
              <Box onClick={() => { setFocus({ type: 'area', options: areaOptions, series: [{ name: 'Net', data: aggregated.net && aggregated.net.length > 0 ? aggregated.net : [0] }] }); setFocusOpen(true); }} sx={{ cursor: 'zoom-in' }}>
                <Chart
                  options={areaOptions}
                  series={[{ name: 'Net', data: aggregated.net && aggregated.net.length > 0 ? aggregated.net : [0] }]}
                  type="area"
                  height={340}
                />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Carregando dados...
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Depósitos vs Saques */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{
              p: 6,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(120, 119, 198, 0.06) 100%)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(102, 126, 234, 0.35)',
              borderRadius: '24px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 40px rgba(102, 126, 234, 0.2), inset 0 0 30px rgba(102, 126, 234, 0.1)',
              animation: 'fadeInUp 0.9s ease-out',
              '&:hover': {
                border: '2px solid rgba(102, 126, 234, 0.7)',
                boxShadow: '0 0 80px rgba(102, 126, 234, 0.4), inset 0 0 40px rgba(102, 126, 234, 0.15)',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#e6eef8', mb: 4, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', textShadow: '0 0 10px rgba(102,126,234,0.3)' }}>
              💰 Depósitos vs Saques
            </Typography>
            <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
            {aggregated.labels && aggregated.labels.length > 0 ? (
              <Box onClick={() => { setFocus({ type: 'bar', options: barOptions, series: [
                { name: 'Depósitos', data: aggregated.deposits && aggregated.deposits.length > 0 ? aggregated.deposits : [0] },
                { name: 'Saques', data: aggregated.withdrawals && aggregated.withdrawals.length > 0 ? aggregated.withdrawals : [0] },
              ] }); setFocusOpen(true); }} sx={{ cursor: 'zoom-in' }}>
                <Chart
                  options={barOptions}
                  series={[
                    { name: 'Depósitos', data: aggregated.deposits && aggregated.deposits.length > 0 ? aggregated.deposits : [0] },
                    { name: 'Saques', data: aggregated.withdrawals && aggregated.withdrawals.length > 0 ? aggregated.withdrawals : [0] },
                  ]}
                  type="bar"
                  height={340}
                />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Carregando dados...
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Distribuição de Carteiras */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{
              p: 6,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(120, 119, 198, 0.06) 100%)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(102, 126, 234, 0.35)',
              borderRadius: '24px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 40px rgba(102, 126, 234, 0.2), inset 0 0 30px rgba(102, 126, 234, 0.1)',
              animation: 'fadeInUp 1s ease-out',
              '&:hover': {
                border: '2px solid rgba(102, 126, 234, 0.7)',
                boxShadow: '0 0 80px rgba(102, 126, 234, 0.4), inset 0 0 40px rgba(102, 126, 234, 0.15)',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#e6eef8', mb: 4, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', textShadow: '0 0 10px rgba(102,126,234,0.3)' }}>
              🥧 Distribuição de Carteiras (Top 8)
            </Typography>
            <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
            {barWalletSeries[0]?.data?.length > 0 ? (
              <Box onClick={() => {
                // Monta todos os usuários para o modal
                const allUsersSorted = [...usersList]
                  .map(u => ({ name: u.name || u.email || 'Usuário', value: Number(u.wallet || 0) }))
                  .filter(u => u.value > 0)
                  .sort((a, b) => b.value - a.value);
                setFocus({
                  type: 'bar',
                  options: {
                    ...barWalletOptions,
                    xaxis: { ...barWalletOptions.xaxis, categories: allUsersSorted.map(u => u.name) },
                  },
                  series: [{ name: 'Saldo', data: allUsersSorted.map(u => u.value) }],
                  title: 'Ranking de Carteiras (Todos)',
                });
                setFocusOpen(true);
              }} sx={{ cursor: 'zoom-in', minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Chart
                  options={barWalletOptions}
                  series={barWalletSeries}
                  type="bar"
                  height={340}
                />
                <Box sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, mt: 2 }}>
                  Clique para ver todos os usuários
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Sem dados
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Pie Chart - Investimentos por Moeda */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{
              p: 6,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(120, 119, 198, 0.06) 100%)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(102, 126, 234, 0.35)',
              borderRadius: '24px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 40px rgba(102, 126, 234, 0.2), inset 0 0 30px rgba(102, 126, 234, 0.1)',
              animation: 'fadeInUp 1.1s ease-out',
              '&:hover': {
                border: '2px solid rgba(102, 126, 234, 0.7)',
                boxShadow: '0 0 80px rgba(102, 126, 234, 0.4), inset 0 0 40px rgba(102, 126, 234, 0.15)',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#e6eef8', mb: 4, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', textShadow: '0 0 10px rgba(102,126,234,0.3)' }}>
              🪙 Investimentos por Moeda
            </Typography>
            {pieInvestmentSeries.length > 0 ? (
              <Chart
                options={pieInvestmentOptions}
                series={pieInvestmentSeries}
                type="donut"
                height={340}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Sem dados de investimentos
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Criptos Disponíveis */}
        <Grid item xs={12} sm={6} md={6}>
          <Card
            sx={{
              p: 6,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(120, 119, 198, 0.06) 100%)',
              backdropFilter: 'blur(30px)',
              border: '2px solid rgba(102, 126, 234, 0.35)',
              borderRadius: '24px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 40px rgba(102, 126, 234, 0.2), inset 0 0 30px rgba(102, 126, 234, 0.1)',
              animation: 'fadeInUp 1.2s ease-out',
              '&:hover': {
                border: '2px solid rgba(102, 126, 234, 0.7)',
                boxShadow: '0 0 80px rgba(102, 126, 234, 0.4), inset 0 0 40px rgba(102, 126, 234, 0.15)',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#e6eef8', mb: 4, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', textShadow: '0 0 10px rgba(102,126,234,0.3)' }}>
              💎 Criptos Disponíveis
            </Typography>
            <Divider sx={{ mb: 4, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
            <Box sx={{ maxHeight: 340, overflow: 'auto' }}>
              {cryptos.length > 0 ? (
                <Stack spacing={2}>
                  {cryptos.map((crypto, idx) => (
                    <Card
                      key={crypto.id || idx}
                      onClick={async () => {
                        setLoadingCrypto(true);
                        try {
                          const res = await getCryptoById(crypto.id || crypto._id);
                          setSelectedCrypto(res.data);
                        } catch (e) {
                          setSelectedCrypto(crypto); // fallback
                        }
                        setCryptoDrawerOpen(true);
                        setLoadingCrypto(false);
                      }}
                      sx={{
                        p: 2,
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1.5px solid rgba(102, 126, 234, 0.25)',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.2)',
                          borderColor: 'rgba(102, 126, 234, 0.5)',
                          boxShadow: '0 0 25px rgba(102, 126, 234, 0.2)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#e6eef8', letterSpacing: '-0.5px' }}>
                            {crypto.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {crypto.symbol}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#00ffdd', fontWeight: 800 }}>
                          R$ {Number(crypto.price).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                      <Stack spacing={1} direction="row">
                        <Paper
                          sx={{
                            flex: 1,
                            bgcolor: 'rgba(74, 222, 128, 0.15)',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            p: 1.5,
                            borderRadius: '8px',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: '10px', fontWeight: 700 }}>
                            Ativos
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#64ff96' }}>
                            {crypto.activeHolders}
                          </Typography>
                        </Paper>
                        <Paper
                          sx={{
                            flex: 1,
                            bgcolor: 'rgba(102, 126, 234, 0.15)',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            p: 1.5,
                            borderRadius: '8px',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: '10px', fontWeight: 700 }}>
                            Vencidos
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#96a0ff' }}>
                            {crypto.maturedCount}
                          </Typography>
                        </Paper>
                        <Paper
                          sx={{
                            flex: 1,
                            bgcolor: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            p: 1.5,
                            borderRadius: '8px',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', fontSize: '10px', fontWeight: 700 }}>
                            Total
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#ff5555' }}>
                            {crypto.totalHolders}
                          </Typography>
                        </Paper>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6, opacity: 0.6 }}>
                  <Typography variant="body2">Nenhuma cripto disponível</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* SEÇÃO DE PAINÉIS INFORMATIVOS - PREMIUM GRID */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="stretch"
        wrap="wrap"
        sx={{ mt: 2, mb: 6, width: '100%' }}
      >
        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} display="flex" alignItems="stretch">
          <Card
            sx={{
              p: 4,
              height: '100%',
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              background: 'linear-gradient(135deg, rgba(0, 201, 183, 0.08) 0%, rgba(0, 201, 183, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(0, 201, 183, 0.25)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 40px rgba(0, 201, 183, 0.08)',
              cursor: 'pointer',
              '&:hover': {
                border: '1.5px solid rgba(0, 201, 183, 0.5)',
                boxShadow: '0 20px 60px rgba(0, 201, 183, 0.15)',
                filter: 'brightness(1.08)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e6eef8', mb: 3, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              👥 Usuários Ativos
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(0, 201, 183, 0.1)' }} />
            <Stack spacing={2} sx={{ maxHeight: 280, overflow: 'auto' }}>
              {usersList.map((u, idx) => (
                <Box
                  key={u.id || idx}
                  onClick={e => { e.stopPropagation(); setSelectedUserId(u.id); setProfileOpen(true); }}
                  sx={{
                    p: 2,
                    background: 'rgba(0, 201, 183, 0.06)',
                    border: '1px solid rgba(0, 201, 183, 0.15)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 300ms ease',
                    '&:hover': {
                      background: 'rgba(0, 201, 183, 0.15)',
                      borderColor: 'rgba(0, 201, 183, 0.35)',
                    },
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#e6eef8', letterSpacing: '-0.5px' }}>
                      {u.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                      {u.email}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#00c9b7' }}>
                    R$ {Number(u.wallet || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} display="flex" alignItems="stretch">
          <Card
            sx={{
              p: 4,
              height: '100%',
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.08) 0%, rgba(74, 222, 128, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(74, 222, 128, 0.25)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 40px rgba(74, 222, 128, 0.08)',
              cursor: 'pointer',
              '&:hover': {
                border: '1.5px solid rgba(74, 222, 128, 0.5)',
                boxShadow: '0 20px 60px rgba(74, 222, 128, 0.15)',
              },
            }}
            onClick={() => { setFocus({ type: 'kpi', title: 'Depósitos Recentes', content: deposits.slice(0, 6).map(d => `${d.userName || d.userEmail || 'Usuário'} - R$ ${Number(d.amount || 0).toLocaleString('pt-BR')}\n${new Date(d.date || Date.now()).toLocaleDateString('pt-BR')}`).join('\n---\n') }); setFocusOpen(true); }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e6eef8', mb: 2, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              💰 Depósitos Recentes
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 2, fontWeight: 600 }}>
              Total: R$ {(deposits.reduce((s, d) => s + Number(d.amount || 0), 0)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(74, 222, 128, 0.1)' }} />
            <Stack spacing={1.5} sx={{ maxHeight: 240, overflow: 'auto' }}>
              {deposits.slice(0, 5).map((d, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, background: 'rgba(74, 222, 128, 0.05)', borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                    {d.userName || d.userEmail || 'Usuário'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4ade80', fontWeight: 800 }}>
                    +R$ {Number(d.amount || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} display="flex" alignItems="stretch">
          <Card
            sx={{
              p: 4,
              height: '100%',
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 40px rgba(239, 68, 68, 0.08)',
              cursor: 'pointer',
              '&:hover': {
                border: '1.5px solid rgba(239, 68, 68, 0.5)',
                boxShadow: '0 20px 60px rgba(239, 68, 68, 0.15)',
              },
            }}
            onClick={() => { setFocus({ type: 'kpi', title: 'Saques Recentes', content: withdrawals.slice(0, 6).map(d => `${d.userName || d.userEmail || 'Usuário'} - R$ ${Number(d.amount || 0).toLocaleString('pt-BR')}\n${new Date(d.date || Date.now()).toLocaleDateString('pt-BR')}`).join('\n---\n') }); setFocusOpen(true); }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e6eef8', mb: 2, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              📤 Saques Recentes
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 2, fontWeight: 600 }}>
              Total: R$ {(withdrawals.reduce((s, d) => s + Number(d.amount || 0), 0)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(239, 68, 68, 0.1)' }} />
            <Stack spacing={1.5} sx={{ maxHeight: 240, overflow: 'auto' }}>
              {withdrawals.slice(0, 5).map((d, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                    {d.userName || d.userEmail || 'Usuário'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 800 }}>
                    -R$ {Number(d.amount || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} display="flex" alignItems="stretch">
          <Card
            sx={{
              p: 4,
              height: '100%',
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(102, 126, 234, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(102, 126, 234, 0.25)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.08)',
              cursor: 'pointer',
              '&:hover': {
                border: '1.5px solid rgba(102, 126, 234, 0.5)',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.15)',
              },
            }}
            onClick={() => { setFocus({ type: 'kpi', title: 'Indicações', content: (referralProfits || []).slice(0, 6).map(p => `${p.name} - R$ ${Number(p.total || 0).toLocaleString('pt-BR')}`).join('\n---\n') }); setFocusOpen(true); }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e6eef8', mb: 2, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🎁 Indicações (Top)
            </Typography>
            <Divider sx={{ mb: 2, borderColor: 'rgba(102, 126, 234, 0.1)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 2, fontWeight: 600 }}>
              Comissões Earned
            </Typography>
            <Stack spacing={1.5} sx={{ maxHeight: 240, overflow: 'auto' }}>
              {(referralProfits || []).slice(0, 5).map((p, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 800 }}>
                    R$ {Number(p.total || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} display="flex" alignItems="stretch">
          <Card
            sx={{
              p: 4,
              height: '100%',
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(168, 85, 247, 0.06) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.1)',
              cursor: 'pointer',
              '&:hover': {
                border: '1.5px solid rgba(102, 126, 234, 0.5)',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
              },
            }}
            onClick={() => setFocus({ type: 'kpi', title: 'Configurações', content: `Indicação: ${referralPercentage !== null ? `${referralPercentage}%` : '—'}\nTotal de Usuários: ${usersList.length}` }) || setFocusOpen(true)}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e6eef8', mb: 3, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ⚙️ Configurações
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(102, 126, 234, 0.15)' }} />
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1, fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  % Indicação
                </Typography>
                <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 800, letterSpacing: '-1px' }}>
                  {referralPercentage !== null ? `${referralPercentage}%` : '—'}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: 'rgba(102, 126, 234, 0.15)' }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1, fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total de Usuários
                </Typography>
                <Typography variant="h4" sx={{ color: '#00c9b7', fontWeight: 800, letterSpacing: '-1px' }}>
                  {usersList.length}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} display="flex" alignItems="stretch">
          <Card
            sx={{
              p: 4,
              height: '100%',
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(102, 126, 234, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(102, 126, 234, 0.25)',
              borderRadius: '20px',
              transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.08)',
              cursor: 'pointer',
              '&:hover': {
                border: '1.5px solid rgba(102, 126, 234, 0.5)',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.15)',
              },
            }}
            onClick={() => setFocus({ type: 'kpi', title: 'Cadastros Recentes', content: registrations.slice(0, 6).map(u => `${u.name} (${u.email})${u.indicadoPorName ? `\nPor: ${u.indicadoPorName}` : ''}\n${new Date(u.date || Date.now()).toLocaleDateString('pt-BR')}`).join('\n---\n') }) || setFocusOpen(true)}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#e6eef8', mb: 3, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🆕 Cadastros Recentes
            </Typography>
            <Divider sx={{ mb: 3, borderColor: 'rgba(102, 126, 234, 0.15)' }} />
            <Stack spacing={2} sx={{ maxHeight: 260, overflow: 'auto' }}>
              {registrations.slice(0, 6).map((u, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    background: 'rgba(102, 126, 234, 0.06)',
                    border: '1px solid rgba(102, 126, 234, 0.15)',
                    borderRadius: '12px',
                    transition: 'all 300ms ease',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.15)',
                      borderColor: 'rgba(102, 126, 234, 0.35)',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#e6eef8', letterSpacing: '-0.5px' }}>
                    {u.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 0.5, fontSize: '11px' }}>
                    {u.email}
                  </Typography>
                  {u.indicadoPorName && (
                    <Typography variant="caption" sx={{ color: '#00c9b7', display: 'block', mb: 0.5, fontSize: '10px', fontWeight: 600 }}>
                      Por: <strong>{u.indicadoPorName}</strong>
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>
                    {new Date(u.date || Date.now()).toLocaleDateString('pt-BR')}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <UserProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} userId={selectedUserId} />
  <CryptoHoldersDrawer open={cryptoDrawerOpen} onClose={() => setCryptoDrawerOpen(false)} crypto={selectedCrypto} />
  {/* Pode exibir um loader se quiser: loadingCrypto */}
      <FocusModal open={focusOpen} onClose={() => setFocusOpen(false)} focus={focus} />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;