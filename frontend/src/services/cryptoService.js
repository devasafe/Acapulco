import axios from '../api';

export const addCrypto = async (formData, token) => {
  return axios.post('/cryptos', formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getCryptos = async () => {
  return axios.get('/cryptos');
};

export const getCryptoById = async (id) => {
  return axios.get(`/cryptos/${id}`);
};

export const editCrypto = async (id, formData, token) => {
  return axios.put(`/cryptos/${id}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteCrypto = async (id, token) => {
  return axios.delete(`/cryptos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
