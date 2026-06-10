import api from '../api';

// Painel admin de agendamento de intervenções. Rotas em /admin/market (exigem admin;
// o token JWT é anexado pelo interceptor em ../api).

// Lista todos os ativos (para escolher no painel).
export const listAllAssets = () => api.get('/admin/market/all');

// Lista as intervenções de um ativo.
export const listInterventions = (id) => api.get(`/admin/market/${id}/interventions`);

// Agenda uma intervenção: { scheduledAt (ISO), mode: 'absolute' | 'percent', value }.
export const scheduleIntervention = (id, payload) => api.post(`/admin/market/${id}/interventions`, payload);

// Cancela uma intervenção pendente.
export const cancelIntervention = (ivId) => api.delete(`/admin/market/interventions/${ivId}`);
