import api from '../api';

export const getAssets = () => api.get('/assets');
export const getAsset = (symbol) => api.get(`/assets/${symbol}`);

// Admin
export const getAllAssetsAdmin = () => api.get('/assets/admin/all');
export const addAsset = ({ symbol, name, assetType = 'crypto' }) =>
  api.post('/assets', { symbol, name, assetType });
export const toggleAsset = (id) => api.patch(`/assets/${id}/toggle`);
export const removeAsset = (id) => api.delete(`/assets/${id}`);
