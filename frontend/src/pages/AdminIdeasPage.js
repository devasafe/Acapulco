import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, TextField, Button, MenuItem,
  Chip, Alert, Stack, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PageLayout from '../components/PageLayout';
import { listIdeas, createIdea, removeIdea } from '../services/ideaService';

export default function AdminIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({ symbol: '', title: '', body: '', stance: 'neutral' });
  const [msg, setMsg] = useState(null);

  const load = () => listIdeas().then((r) => setIdeas(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async () => {
    setMsg(null);
    try {
      await createIdea(form);
      setMsg({ type: 'success', text: 'Ideia publicada.' });
      setForm({ symbol: '', title: '', body: '', stance: 'neutral' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao publicar.' });
    }
  };

  const handleRemove = async (id) => { await removeIdea(id); load(); };

  return (
    <PageLayout>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', mb: 1 }}>
          Admin — Ideias & Análises
        </Typography>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Publique apenas conteúdo <b>educacional e transparente</b>. Tudo aparece marcado como opinião/estudo;
          o resultado é o que o mercado real fizer (sem manipulação).
        </Alert>

        {msg && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}

        <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Símbolo (opcional)" value={form.symbol} onChange={handleChange('symbol')} size="small" sx={{ flex: 1 }} />
                <TextField label="Viés" value={form.stance} onChange={handleChange('stance')} select size="small" sx={{ flex: 1 }}>
                  <MenuItem value="bullish">Alta (bullish)</MenuItem>
                  <MenuItem value="bearish">Baixa (bearish)</MenuItem>
                  <MenuItem value="neutral">Neutro</MenuItem>
                </TextField>
              </Stack>
              <TextField label="Título" value={form.title} onChange={handleChange('title')} size="small" fullWidth />
              <TextField label="Análise / conteúdo" value={form.body} onChange={handleChange('body')} multiline rows={4} fullWidth />
              <Button variant="contained" onClick={handleSubmit} sx={{ background: 'linear-gradient(135deg,#7C3AED,#6B46C1)', fontWeight: 700, alignSelf: 'flex-start' }}>
                Publicar ideia
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {ideas.map((idea) => (
          <Card key={idea._id} sx={{ background: 'rgba(26,31,46,0.7)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 3, mb: 1.5 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                  {idea.symbol && <Chip size="small" label={idea.symbol} sx={{ bgcolor: 'rgba(124,58,237,.15)', color: '#C4B5FD' }} />}
                  <Chip size="small" label={idea.stance} sx={{ bgcolor: 'rgba(148,163,184,.15)', color: '#CBD5E1' }} />
                </Box>
                <Typography sx={{ color: '#F1F5F9', fontWeight: 700 }}>{idea.title}</Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>{idea.body}</Typography>
              </Box>
              <IconButton onClick={() => handleRemove(idea._id)} sx={{ color: '#EF4444' }}><DeleteIcon /></IconButton>
            </CardContent>
          </Card>
        ))}
      </Container>
    </PageLayout>
  );
}
