import axios from '../api';

export const getReferrals = async (token) => {
	return axios.get('/referrals', {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const getReferralInfo = async (token) => {
	return axios.get('/user/profile', {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const getReferralStats = async (token) => {
	return axios.get('/user/referral-stats', {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const getAdminReferralSettings = async (token) => {
	return axios.get('/admin/referral-settings', {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const updateAdminReferralSettings = async (referralPercentage, token) => {
	return axios.put('/admin/referral-settings', { referralPercentage }, {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const getAdminReferralProfits = async (token) => {
	return axios.get('/admin/referral-profits', {
		headers: { Authorization: `Bearer ${token}` }
	});
};

export const getAdminReferralBonusDetails = async (token) => {
	return axios.get('/admin/referral-bonus-details', {
		headers: { Authorization: `Bearer ${token}` }
	});
};
