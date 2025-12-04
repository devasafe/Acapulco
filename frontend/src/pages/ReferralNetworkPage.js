import React, { useEffect, useState } from 'react';
import { getReferrals } from '../services/referralService';

export default function ReferralNetworkPage() {
  const [referrals, setReferrals] = useState([]);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      getReferrals(token)
        .then(res => {
          setError('');
          if (Array.isArray(res.data)) {
            setReferrals(res.data);
          } else if (Array.isArray(res.data.referrals)) {
            setReferrals(res.data.referrals);
          } else {
            setReferrals([]);
          }
        })
        .catch(err => {
          if (err.response && err.response.status === 401) {
            setError('Sua sessão expirou ou você não está autenticado. Faça login novamente.');
            setReferrals([]);
          } else {
            setError('Erro ao carregar indicações. Tente novamente mais tarde.');
            setReferrals([]);
          }
        });
    }
  }, [token]);

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Minha Rede de Indicação</h2>
      <p><strong>Seu código de indicação:</strong> {user._id}</p>
      {error && (
        <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
      )}
      {!error && referrals.length === 0 ? (
        <p>Você ainda não indicou ninguém.</p>
      ) : null}
      {!error && referrals.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {referrals.map(ref => (
            <li key={ref._id} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <strong>{ref.name}</strong> <br />
              Email: {ref.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
