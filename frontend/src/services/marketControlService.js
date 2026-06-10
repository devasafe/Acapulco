import api from '../api';

// Painel admin de controle do mercado. Rotas em /admin/market (exigem admin;
// o token JWT é anexado pelo interceptor em ../api).

// Lista os ativos controlados (priceMode='controlled').
export const listControlled = () => api.get('/admin/market');

// Lista TODOS os ativos (mirror + controlled), para ativar o modo controlado.
export const listAllAssets = () => api.get('/admin/market/all');

// Estado ao vivo de um ativo (symbol, priceMode, control).
export const getState = (id) => api.get(`/admin/market/${id}/state`);

// Configura modo/parâmetros do motor.
export const configure = (id, payload) => api.put(`/admin/market/${id}`, payload);

// Pulo instantâneo: { toPrice } ou { percent }.
export const jump = (id, payload) => api.post(`/admin/market/${id}/jump`, payload);

// Alvo gradual: { targetPrice, durationMinutes, easing }.
export const setTarget = (id, payload) => api.post(`/admin/market/${id}/target`, payload);

// Tendência (drift): { dailyDriftPercent } ou { off: true }.
export const setTrend = (id, payload) => api.post(`/admin/market/${id}/trend`, payload);

// Preset rápido: { type: 'pump' | 'dump' | 'flat' }.
export const preset = (id, payload) => api.post(`/admin/market/${id}/preset`, payload);
