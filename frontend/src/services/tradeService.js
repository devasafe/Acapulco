import api from '../api';

export const buy = ({ symbol, quantity }) => api.post('/trades/buy', { symbol, quantity });
export const sell = ({ symbol, quantity }) => api.post('/trades/sell', { symbol, quantity });
export const getPositions = () => api.get('/trades/positions');
export const getTrades = () => api.get('/trades');
export const getStats = () => api.get('/trades/stats');
