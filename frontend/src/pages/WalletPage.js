import React, { useEffect, useState } from 'react';
import { getWallet } from '../services/walletService';
import { getMyInvestments } from '../services/investmentService';
import axios from '../api';

export default function WalletPage() {
  const [wallet, setWallet] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [depositValue, setDepositValue] = useState('');
  const [nextUpdate, setNextUpdate] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      Promise.all([
        getWallet(token),
        getMyInvestments(token)
      ])
        .then(([walletRes, investRes]) => {
          setWallet(walletRes.data.wallet);
          setInvestments(investRes.data);
          setLoading(false);
          // Calcular tempo restante para próxima atualização (24h)
          let minCreated = null;
          investRes.data.forEach(inv => {
            const created = new Date(inv.createdAt).getTime();
            if (minCreated === null || created < minCreated) minCreated = created;
          });
          if (minCreated) {
            const now = Date.now();
            const msSinceFirst = now - minCreated;
            const msToNext = 24 * 60 * 60 * 1000 - (msSinceFirst % (24 * 60 * 60 * 1000));
            setNextUpdate(msToNext);
          } else {
            setNextUpdate(0);
          }
        })
        .catch(() => {
          setError('Erro ao carregar dados. Faça login novamente.');
          setLoading(false);
        });
    } else {
      setError('Não autenticado. Faça login.');
      setLoading(false);
    }
  }, [token]);

  // Atualiza contador a cada segundo
  useEffect(() => {
    if (nextUpdate > 0) {
      const interval = setInterval(() => {
        setNextUpdate(prev => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [nextUpdate]);

  const handleDeposit = async () => {
    if (!depositValue || isNaN(depositValue) || Number(depositValue) <= 0) return;
    try {
      const res = await axios.post('/wallet/deposit', { amount: Number(depositValue) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWallet(res.data.wallet);
      setDepositValue('');
    } catch (err) {
      setError('Erro ao depositar.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Carteira</h2>
      {loading ? <p>Carregando...</p> : (
        <>
          <p><strong>Saldo disponível:</strong> R$ {wallet.toFixed(2)}</p>
          <p><strong>Saldo investido:</strong> R$ {investments.reduce((acc, inv) => acc + inv.amount, 0).toFixed(2)}</p>
          <p><strong>Lucro total:</strong> R$ {investments.reduce((acc, inv) => acc + inv.lucroTotal, 0).toFixed(2)}</p>
          <p><strong>Lucro (%):</strong> {(
            investments.length > 0
              ? (investments.reduce((acc, inv) => acc + inv.lucroTotal, 0) /
                investments.reduce((acc, inv) => acc + inv.amount, 0)) * 100
              : 0
          ).toFixed(2)}%</p>
        </>
      )}
      {!loading && nextUpdate > 0 && (
        <div style={{ marginBottom: 12, color: '#1976d2' }}>
          Próxima atualização do saldo em: {Math.floor(nextUpdate / 3600000)}h {Math.floor((nextUpdate % 3600000) / 60000)}m {Math.floor((nextUpdate % 60000) / 1000)}s
        </div>
      )}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <div style={{ marginTop: 24 }}>
        <input
          type="number"
          placeholder="Valor para depósito"
          value={depositValue}
          onChange={e => setDepositValue(e.target.value)}
          style={{ padding: 8, width: '70%', marginRight: 8 }}
        />
        <button onClick={handleDeposit} style={{ padding: '8px 16px' }}>Depositar</button>
      </div>
      <div style={{ marginTop: 32 }}>
        <h3>Meus Investimentos</h3>
        {investments.length === 0 ? (
          <p>Você ainda não investiu em nenhum imóvel.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Imóvel</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Valor Investido</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Rentabilidade (%)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Lucro por dia</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Lucro total</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Tempo investido</th>
              </tr>
            </thead>
            <tbody>
              {investments.map(inv => (
                <tr key={inv._id}>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{inv.imovel}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>R$ {inv.amount.toFixed(2)}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{inv.rentYield}%</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>R$ {inv.lucroPorDia.toFixed(2)}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>R$ {inv.lucroTotal.toFixed(2)}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{inv.diasInvestidos} dias</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>
                    <button style={{ padding: '4px 12px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4 }}
                      onClick={async () => {
                        const token = localStorage.getItem('token');
                        if (!window.confirm('Deseja vender este investimento?')) return;
                        try {
                          await import('../services/investmentService').then(({ sellInvestment }) => sellInvestment(inv._id, token));
                          alert('Investimento vendido!');
                          window.location.reload();
                        } catch (err) {
                          alert('Erro ao vender: ' + (err.response?.data?.error || 'Tente novamente.'));
                        }
                      }}
                    >Vender</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
