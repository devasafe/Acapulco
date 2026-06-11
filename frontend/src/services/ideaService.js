import api from '../api';

// params opcionais: { symbol, active: 1 } (página da moeda) ou nada (admin: tudo).
export const listIdeas = (params) => api.get('/ideas', { params });
export const createIdea = ({ symbol, title, body, stance, startDate, endDate }) =>
  api.post('/ideas', { symbol, title, body, stance, startDate, endDate });
export const removeIdea = (id) => api.delete(`/ideas/${id}`);
