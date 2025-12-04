import axios from '../api';

export const getTransactionHistory = async (token) => {
	return axios.get('/transactions', {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const getTransactions = async () => Promise.resolve({ data: { transactions: [] } });
