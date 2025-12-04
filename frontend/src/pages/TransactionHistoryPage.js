import React, { useEffect, useState } from 'react';
import { getTransactionHistory } from '../services/transactionService';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      getTransactionHistory(token)
        .then(res => {
          setTransactions(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Erro ao carregar histórico. Faça login novamente.');
          setLoading(false);
        });
    } else {
      setError('Não autenticado. Faça login.');
      setLoading(false);
    }
  }, [token]);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Histórico de Movimentações</h2>
      {loading ? <p>Carregando...</p> : null}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {!loading && transactions.length === 0 && !error ? (
        <p>Não há movimentações registradas.</p>
      ) : null}
      {!loading && transactions.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Tipo</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Valor</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id}>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{tx.type}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>R$ {tx.amount.toFixed(2)}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
