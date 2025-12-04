import axios from '../api';

export const getImoveis = () => axios.get('/imoveis');
export const invest = async () => Promise.resolve();
export const addImovel = (imovel, token) => axios.post('/imoveis', imovel, {
	headers: {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'multipart/form-data'
	}
});

export const editImovel = (id, imovel, token) => axios.put(`/imoveis/${id}`, imovel, {
	headers: {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'multipart/form-data'
	}
});

export const deleteImovel = (id, token) => axios.delete(`/imoveis/${id}`, {
	headers: { Authorization: `Bearer ${token}` }
});
