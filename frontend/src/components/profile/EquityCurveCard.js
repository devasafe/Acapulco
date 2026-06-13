import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api';
import { fmtPeriod, ymd, monthsAgo } from '../../utils/period';
import PeriodControls from '../admin/PeriodControls';

const USD = (v) => `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Gráfico de evolução do patrimônio. `basePath` = '/me' ou '/admin/users/:id'.
export default function EquityCurveCard({ basePath }) {
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
        const res = await api.get(`${basePath}/equity-curve`, { params: { from, to, granularity } });
        if (!cancelled) setData(res.data || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Erro ao carregar evolução.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [basePath, from, to, granularity]);

  const chartData = useMemo(
    () => data.map((b) => ({ label: fmtPeriod(b.period, granularity), equity: b.equity })),
    [data, granularity]
  );

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-headline-md text-[18px]">Evolução do patrimônio</h2>
        <PeriodControls granularity={granularity} from={from} to={to} onGranularity={setGranularity} onFrom={setFrom} onTo={setTo} />
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
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.4} />
              <XAxis dataKey="label" stroke="var(--on-surface-variant)" fontSize={12} />
              <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 8, color: 'var(--on-surface)' }}
                formatter={(value) => [USD(value), 'Patrimônio']}
              />
              <Line type="monotone" dataKey="equity" stroke="var(--primary-container)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
