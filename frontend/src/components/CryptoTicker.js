import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const tickerStyles = `
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .ticker-content {
    display: flex;
    gap: 1.5rem;
    animation: scroll 60s linear infinite;
    padding-right: 1.5rem;
  }

  .ticker-container:hover .ticker-content {
    animation-play-state: paused;
  }

  .ticker-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    white-space: nowrap;
    cursor: pointer;
  }

  .ticker-item:hover {
    background: rgba(124, 58, 237, 0.1);
  }
`;

export default function CryptoTicker() {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    // Dados de exemplo - você pode conectar com uma API real
    const mockData = [
      { symbol: 'BTC', name: 'Bitcoin', price: 45230.50, change: 2.45 },
      { symbol: 'ETH', name: 'Ethereum', price: 2456.80, change: -1.23 },
      { symbol: 'BNB', name: 'Binance Coin', price: 612.34, change: 3.12 },
      { symbol: 'XRP', name: 'Ripple', price: 2.48, change: 5.67 },
      { symbol: 'ADA', name: 'Cardano', price: 0.98, change: -2.34 },
      { symbol: 'SOL', name: 'Solana', price: 198.45, change: 4.56 },
      { symbol: 'DOGE', name: 'Dogecoin', price: 0.38, change: 1.89 },
      { symbol: 'MATIC', name: 'Polygon', price: 0.87, change: -0.45 },
      { symbol: 'LINK', name: 'Chainlink', price: 28.90, change: 2.12 },
      { symbol: 'ATOM', name: 'Cosmos', price: 11.23, change: -1.56 },
    ];
    // Duplicar os dados para criar efeito infinito
    setCryptos([...mockData, ...mockData]);
  }, []);

  const getCryptoItem = (crypto) => {
    const isPositive = crypto.change >= 0;
    const changeColor = isPositive ? '#10B981' : '#EF4444';

    return (
      <Box
        key={`${crypto.symbol}-${Math.random()}`}
        className="ticker-item"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            color: '#FFFFFF',
            minWidth: '70px',
            fontSize: '0.9rem',
          }}
        >
          {crypto.symbol}
        </Typography>

        <Typography
          sx={{
            color: '#94A3B8',
            fontSize: '0.85rem',
            minWidth: '100px',
          }}
        >
          ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: changeColor,
            fontWeight: 700,
            fontSize: '0.9rem',
            minWidth: '80px',
          }}
        >
          {isPositive ? (
            <TrendingUpIcon sx={{ fontSize: '1rem' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: '1rem' }} />
          )}
          <Typography
            sx={{
              color: changeColor,
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            {isPositive ? '+' : ''}{crypto.change.toFixed(2)}%
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <style>{tickerStyles}</style>
      <Box
        className="ticker-container"
        sx={{
          background: '#000000',
          borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
          py: 0,
          px: 2,
          overflow: 'hidden',
        }}
      >
        <Box className="ticker-content">
          {cryptos.map((crypto, index) => (
            <React.Fragment key={index}>
              {getCryptoItem(crypto)}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </>
  );
}
