import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api';
import { fmtPeriod, ymd, monthsAgo } from '../../utils/period';
import PeriodControls from './PeriodControls';

const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Card de barras agrupadas: entradas (deposit) vs saídas (withdrawal) por período, em BRL.
// Self-contained: busca em /admin/cashflow (exige admin) e gerencia o próprio estado.
export default function CashflowCard() {
  const [granularity, setGranularity] = useState('week');
  const [from, setFrom] = useState(monthsAgo(6));
  const [to, setTo] = useState(ymd(new Date()));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/admin/cashflow', { params: { from, to, granularity } });
        if (!cancelled) setData(res.data || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Erro ao carregar fluxo de caixa.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [from, to, granularity]);

  const chartData = useMemo(
    () => data.map((b) => ({ label: fmtPeriod(b.period, granularity), deposits: b.deposits, withdrawals: b.withdrawals })),
    [data, granularity]
  );
  const totals = useMemo(() => ({
    in: data.reduce((s, b) => s + (b.deposits || 0), 0),
    out: data.reduce((s, b) => s + (b.withdrawals || 0), 0),
  }), [data]);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-headline-md text-[18px]">Entradas e saídas</h2>
          <p className="text-on-surface-variant text-body-sm">
            <span className="text-success">Entradas {BRL(totals.in)}</span>
            {' · '}
            <span className="text-danger">Saídas {BRL(totals.out)}</span>
          </p>
        </div>
        <PeriodControls
          granularity={granularity}
          from={from}
          to={to}
          onGranularity={setGranularity}
          onFrom={setFrom}
          onTo={setTo}
        />
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-4 text-body-sm">{error}</div>
      )}

      <div className="h-[320px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.4} />
              <XAxis dataKey="label" stroke="var(--on-surface-variant)" fontSize={12} />
              <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                cursor={{ fill: 'var(--outline-variant)', opacity: 0.2 }}
                contentStyle={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 8, color: 'var(--on-surface)' }}
                formatter={(value, name) => [BRL(value), name === 'deposits' ? 'Entradas' : 'Saídas']}
              />
              <Legend formatter={(value) => (value === 'deposits' ? 'Entradas' : 'Saídas')} />
              <Bar dataKey="deposits" fill="var(--success)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="withdrawals" fill="var(--danger)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
