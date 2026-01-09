import axios from '../api';

// ==================== INVESTMENT SERVICE ====================
export const getMyInvestments = async (token) => {
  const response = await axios.get('/investments', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createInvestment = async (payload, token) => {
  const response = await axios.post('/investments', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const withdrawInvestment = async (payload, token) => {
  const response = await axios.post('/investments/withdraw', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getDashboardStats = async (token) => {
  const response = await axios.get('/users/dashboard-stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==================== WALLET SERVICE ====================
export const getWallet = async (token) => {
  const response = await axios.get('/wallet', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deposit = async (payload, token) => {
  const response = await axios.post('/wallet/deposit', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const withdraw = async (payload, token) => {
  const response = await axios.post('/wallet/withdraw', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==================== TRANSACTION SERVICE ====================
export const getTransactions = async (token) => {
  const response = await axios.get('/users/dashboard-stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.recentTransactions || [];
};

// ==================== AUTH SERVICE ====================
export const login = async (email, password) => {
  const response = await axios.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (payload) => {
  const response = await axios.post('/auth/register', payload);
  return response.data;
};

export const registerWithReferral = async (payload) => {
  const response = await axios.post('/auth/register-with-referral', payload);
  return response.data;
};

// ==================== USER SERVICE ====================
export const getProfile = async (token) => {
  const response = await axios.get('/users/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateProfile = async (payload, token) => {
  const response = await axios.put('/users/profile', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getReferrals = async (token) => {
  const response = await axios.get('/users/referrals', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==================== CRYPTO SERVICE ====================
export const getAllCryptos = async (token) => {
  const response = await axios.get('/cryptos', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAllCryptosAdmin = async (token) => {
  const response = await axios.get('/cryptos/admin/all', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getCryptoById = async (id, token) => {
  const response = await axios.get(`/cryptos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createCrypto = async (payload, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  // Se payload é FormData, deixar axios definir content-type automaticamente
  if (payload instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  
  const response = await axios.post('/cryptos', payload, config);
  return response.data;
};

export const updateCrypto = async (id, payload, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  // Se payload é FormData, deixar axios definir content-type automaticamente
  if (payload instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  
  const response = await axios.put(`/cryptos/${id}`, payload, config);
  return response.data;
};

export const deleteCrypto = async (id, token) => {
  const response = await axios.delete(`/cryptos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const toggleCryptoStatus = async (id, token) => {
  const response = await axios.patch(`/cryptos/${id}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ==================== ADMIN SERVICE ====================
export const getAdminStats = async (token) => {
  const response = await axios.get('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAllUsers = async (token) => {
  const response = await axios.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getReferralSettings = async (token) => {
  const response = await axios.get('/admin/referral-settings', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateReferralSettings = async (payload, token) => {
  const response = await axios.put('/admin/referral-settings', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getReferralProfits = async (token) => {
  const response = await axios.get('/api/admin/referral-profits', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
