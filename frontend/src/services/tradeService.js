import api from '../api';

export const buy = ({ symbol, usd }) => api.post('/trades/buy', { symbol, usd });
export const sell = ({ symbol, usd }) => api.post('/trades/sell', { symbol, usd });
export const closePosition = ({ symbol }) => api.post('/trades/close', { symbol });
export const getPositions = () => api.get('/trades/positions');
export const getTrades = () => api.get('/trades');
export const getStats = () => api.get('/trades/stats');
