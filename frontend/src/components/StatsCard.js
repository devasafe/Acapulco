import React from 'react';
import { Paper, Box, Typography, useTheme, useMediaQuery } from '@mui/material';

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  subtitle,
  gradient = 'blue',
  onClick,
  hoverable = true
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const gradients = {
    blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    green: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    red: 'linear-gradient(135deg, #f56565 0%, #c53030 100%)',
    purple: 'linear-gradient(135deg, #764ba2 0%, #553399 100%)',
    orange: 'linear-gradient(135deg, #ed8936 0%, #d69e2e 100%)',
  };

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.8) 0%, rgba(15, 23, 36, 0.8) 100%)',
        border: '1px solid rgba(230, 238, 248, 0.1)',
        backdropFilter: 'blur(10px)',
        transition: hoverable ? 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        cursor: hoverable && onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': hoverable ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)',
          borderColor: 'rgba(102, 126, 234, 0.3)',
        } : {},
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ color: '#a0aec0', fontWeight: 500, fontSize: '0.85rem' }}>
          {title}
        </Typography>
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '8px',
              background: gradients[gradient],
              fontSize: '1.75rem',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#e6eef8',
          mb: 0.5,
          fontSize: isMobile ? '1.5rem' : '1.75rem',
        }}
      >
        {value}
      </Typography>

      {subtitle && (
        <Typography
          variant="caption"
          sx={{
            color: '#48bb78',
            fontWeight: 500,
            fontSize: '0.8rem',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}
