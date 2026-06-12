import api from '../api';

// O token é injetado automaticamente pelo interceptor em ../api.
export const getWallet = () => api.get('/wallet');
export const deposit = (amount) => api.post('/wallet/deposit', { amount });
export const withdraw = (amount) => api.post('/wallet/withdraw', { amount });
export const getWalletTransactions = () => api.get('/wallet/transactions');
