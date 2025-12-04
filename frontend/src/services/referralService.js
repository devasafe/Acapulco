import axios from '../api';

export const getReferrals = async (token) => {
	return axios.get('/referrals', {
		headers: { Authorization: `Bearer ${token}` }
	});
};
