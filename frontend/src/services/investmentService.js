import axios from '../api';

export const sellInvestment = async (investmentId, token) => {
  return axios.post('/investments/sell', { investmentId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const investInImovel = async (imovelId, token) => {
  return axios.post('/investments/invest', { imovelId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getMyInvestments = async (token) => {
  return axios.get('/investments/my', {
    headers: { Authorization: `Bearer ${token}` }
  });
};
