import axios from '../api';

export const getWallet = async (token) => {
	return axios.get('/wallet', {
		headers: { Authorization: `Bearer ${token}` }
	});
};
