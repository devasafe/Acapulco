import api from '../api';

export const listIdeas = () => api.get('/ideas');
export const createIdea = ({ symbol, title, body, stance }) =>
  api.post('/ideas', { symbol, title, body, stance });
export const removeIdea = (id) => api.delete(`/ideas/${id}`);
