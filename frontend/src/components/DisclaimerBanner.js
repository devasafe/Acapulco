import React from 'react';
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

// Banner persistente: deixa explícito que é um simulador educacional com dinheiro fictício.
export default function DisclaimerBanner() {
  return (
    <Box
      sx={{
        width: '100%',
        py: 0.75,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        background: 'linear-gradient(90deg, #1f2937 0%, #374151 100%)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.4)',
        color: '#F59E0B',
        fontSize: '0.8rem',
        textAlign: 'center',
      }}
    >
      <SchoolIcon sx={{ fontSize: 16 }} />
      <Typography variant="caption" sx={{ fontWeight: 600, color: '#FCD34D' }}>
        Simulador educacional — dinheiro 100% fictício. Não é investimento real nem recomendação financeira.
      </Typography>
    </Box>
  );
}
