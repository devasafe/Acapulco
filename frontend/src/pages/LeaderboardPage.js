import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, CircularProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PageLayout from '../components/PageLayout';
import { getLeaderboard } from '../services/leaderboardService';

const fmtUsd = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const medal = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`);

export default function LeaderboardPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then((r) => setRows(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EmojiEventsIcon sx={{ color: '#F59E0B' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#F1F5F9' }}>Ranking</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
          Quem está performando melhor no simulador — patrimônio fictício valorizado com preços reais.
        </Typography>

        <Card sx={{ background: 'rgba(26,31,46,0.85)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 3 }}>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['#', 'Trader', 'Patrimônio', 'Retorno'].map((h) => (
                      <TableCell key={h} sx={{ color: '#94A3B8' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ color: '#F1F5F9', fontWeight: 700 }}>{medal(i)}</TableCell>
                      <TableCell sx={{ color: '#F1F5F9' }}>{r.name}</TableCell>
                      <TableCell sx={{ color: '#CBD5E1' }}>{fmtUsd(r.equity)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={`${(r.returnPercent ?? 0).toFixed(2)}%`}
                          sx={{ bgcolor: (r.returnPercent ?? 0) >= 0 ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: (r.returnPercent ?? 0) >= 0 ? '#10B981' : '#EF4444', fontWeight: 700 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow><TableCell colSpan={4} sx={{ color: '#94A3B8', textAlign: 'center' }}>Sem traders ainda.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Container>
    </PageLayout>
  );
}
