import axios from '../api';

const API_URL = '/auth';

export const register = async (name, email, password, indicadoPor) => {
  return axios.post(`${API_URL}/register`, { name, email, password, indicadoPor });
};

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
