import React, { useEffect, useState } from 'react';
import {
  Container, Card, CardContent, Typography, Box, TextField, Button, Table,
  TableBody, TableCell, TableHead, TableRow, Chip, Alert, InputAdornment, Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import PageLayout from '../components/PageLayout';
import { getAllAssetsAdmin, addAsset, toggleAsset, removeAsset } from '../services/assetService';
import { searchSymbols } from '../services/marketService';

export default function AssetAdminPage() {
  const [assets, setAssets] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState(null);

  const load = () => getAllAssetsAdmin().then((r) => setAssets(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSearch = async () => {
    setMsg(null);
    try {
      const r = await searchSymbols(query, 'crypto');
      setResults(r.data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Falha na busca de símbolos.' });
    }
  };

  const handleAdd = async (symbol, name, assetType = 'crypto') => {
    setMsg(null);
    try {
      await addAsset({ symbol, name, assetType });
      setMsg({ type: 'success', text: `${symbol} adicionado à watchlist.` });
      setResults([]);
      setQuery('');
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao adicionar.' });
    }
  };

  const handleToggle = async (id) => { await toggleAsset(id); load(); };
  const handleRemove = async (id) => { await removeAsset(id); load(); };

  return (
    <PageLayout>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', mb: 1 }}>
          Admin — Ativos (watchlist)
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
          Adicione ativos por símbolo. O sistema valida no provedor de mercado antes de salvar.
        </Typography>

        {msg && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}

        {/* Busca/adição */}
        <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth size="small" placeholder="Buscar símbolo (ex.: btc, eth, sol)"
                value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ '& .MuiOutlinedInput-root': { color: '#F1F5F9' } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8' }} /></InputAdornment> }}
              />
              <Button variant="contained" onClick={handleSearch} sx={{ background: '#7C3AED', fontWeight: 700 }}>Buscar</Button>
              <Button variant="outlined" onClick={() => handleAdd(query.toUpperCase(), query.toUpperCase())} sx={{ color: '#CBD5E1', borderColor: 'rgba(148,163,184,0.3)' }}>
                Adicionar direto
              </Button>
            </Stack>

            {results.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {results.map((r) => (
                  <Chip key={r.symbol} label={`${r.symbol} (${r.name})`} onClick={() => handleAdd(r.symbol, r.name, r.assetType)}
                    sx={{ bgcolor: 'rgba(124,58,237,.15)', color: '#C4B5FD', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(124,58,237,.3)' } }} />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Lista */}
        <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', mb: 1 }}>Watchlist atual</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Símbolo', 'Nome', 'Tipo', 'Status', 'Ações'].map((h) => (
                    <TableCell key={h} sx={{ color: '#94A3B8' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell sx={{ color: '#F1F5F9', fontWeight: 700 }}>{a.symbol}</TableCell>
                    <TableCell sx={{ color: '#CBD5E1' }}>{a.name}</TableCell>
                    <TableCell sx={{ color: '#CBD5E1' }}>{a.assetType}</TableCell>
                    <TableCell>
                      <Chip size="small" label={a.isActive ? 'Ativo' : 'Inativo'} onClick={() => handleToggle(a._id)}
                        sx={{ cursor: 'pointer', bgcolor: a.isActive ? 'rgba(16,185,129,.15)' : 'rgba(148,163,184,.15)', color: a.isActive ? '#10B981' : '#94A3B8' }} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<DeleteIcon />} onClick={() => handleRemove(a._id)} sx={{ color: '#EF4444' }}>
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {assets.length === 0 && (
                  <TableRow><TableCell colSpan={5} sx={{ color: '#94A3B8', textAlign: 'center' }}>Nenhum ativo cadastrado.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Container>
    </PageLayout>
  );
}
