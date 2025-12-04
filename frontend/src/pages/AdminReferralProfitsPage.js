import React, { useEffect, useState } from 'react';
import { getReferralProfits } from '../services/adminService';

export default function AdminReferralProfitsPage() {
  const [profits, setProfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      getReferralProfits(token)
        .then(res => {
          setProfits(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Acesso negado ou erro ao carregar dados.');
          setLoading(false);
        });
    } else {
      setError('Não autenticado. Faça login.');
      setLoading(false);
    }
  }, [token]);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Lucros por Indicação (Admin)</h2>
      {loading ? <p>Carregando...</p> : null}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {!loading && profits.length === 0 && !error ? (
        <p>Nenhum lucro de indicação registrado.</p>
      ) : null}
      {!loading && profits.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Usuário</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Lucro Total</th>
            </tr>
          </thead>
          <tbody>
            {profits.map(p => (
              <tr key={p.email}>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.name}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.email}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>R$ {p.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
