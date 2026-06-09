import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Chip, CircularProgress, Alert,
} from '@mui/material';
import PageLayout from '../components/PageLayout';
import { listIdeas } from '../services/ideaService';

const stanceMap = {
  bullish: { label: 'Alta', color: '#10B981', bg: 'rgba(16,185,129,.15)' },
  bearish: { label: 'Baixa', color: '#EF4444', bg: 'rgba(239,68,68,.15)' },
  neutral: { label: 'Neutro', color: '#94A3B8', bg: 'rgba(148,163,184,.15)' },
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listIdeas().then((r) => setIdeas(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9', mb: 1 }}>
          Ideias & Análises
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Conteúdo <b>educacional</b> e <b>aberto a todos</b>. São opiniões/estudos — <b>não é recomendação
          de investimento</b> e ninguém controla o resultado: o que acontece é o que o mercado real fizer.
        </Alert>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : ideas.length === 0 ? (
          <Typography sx={{ color: '#94A3B8', textAlign: 'center', py: 6 }}>Nenhuma ideia publicada ainda.</Typography>
        ) : (
          ideas.map((idea) => {
            const s = stanceMap[idea.stance] || stanceMap.neutral;
            return (
              <Card key={idea._id} sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3, mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {idea.symbol && <Chip size="small" label={idea.symbol} sx={{ bgcolor: 'rgba(124,58,237,.15)', color: '#C4B5FD', fontWeight: 700 }} />}
                      <Chip size="small" label={s.label} sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      {idea.authorName} · {new Date(idea.createdAt).toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9' }}>{idea.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', whiteSpace: 'pre-wrap', mt: 0.5 }}>{idea.body}</Typography>
                </CardContent>
              </Card>
            );
          })
        )}
      </Container>
    </PageLayout>
  );
}
