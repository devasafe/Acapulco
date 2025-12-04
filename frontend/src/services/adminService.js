import axios from '../api';

export const getReferralProfits = async (token) => {
  return axios.get('/admin/referral-profits', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getReferralPercentage = async (token) => {
  const res = await axios.get('/admin/settings/referral-percentage', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.percentage;
};

export const setReferralPercentage = async (percentage, token) => {
  await axios.post('/admin/settings/referral-percentage', { percentage }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
