import api from '../api';

export const getQuote = (symbol, assetType = 'crypto') =>
  api.get(`/market/quote/${symbol}`, { params: { assetType } });

export const getCandles = (symbol, { interval = '1h', limit = 200, assetType = 'crypto' } = {}) =>
  api.get(`/market/candles/${symbol}`, { params: { interval, limit, assetType } });

export const searchSymbols = (q, assetType = 'crypto') =>
  api.get('/market/search', { params: { q, assetType } });
