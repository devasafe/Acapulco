// Base da API/assets. Em produção, defina REACT_APP_API_URL com a URL do backend
// (ex.: https://acapulco-api.onrender.com). Em desenvolvimento, cai no localhost.
export const ASSET_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const API_URL = `${ASSET_BASE}/api`;
