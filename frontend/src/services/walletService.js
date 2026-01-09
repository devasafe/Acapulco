import axios from '../api';

export const getWallet = async (token) => {
	return axios.get('/wallet', {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const deposit = async (amount, token) => {
	return axios.post('/wallet/deposit', { amount }, {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const withdraw = async (amount, token) => {
	return axios.post('/wallet/withdraw', { amount }, {
		headers: { Authorization: `Bearer ${token}` }
	});
};
