import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api';
import { fmtPeriod, ymd, monthsAgo } from '../../utils/period';
import PeriodControls from './PeriodControls';

// Card de linha: tickets de suporte recebidos por período.
// Self-contained: busca em /admin/tickets-series (exige admin).
export default function TicketsCard() {
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
        const res = await api.get('/admin/tickets-series', { params: { from, to, granularity } });
        if (!cancelled) setData(res.data || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Erro ao carregar tickets.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [from, to, granularity]);

  const chartData = useMemo(
    () => data.map((b) => ({ label: fmtPeriod(b.period, granularity), count: b.count })),
    [data, granularity]
  );
  const total = useMemo(() => data.reduce((s, b) => s + b.count, 0), [data]);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-headline-md text-[18px]">Tickets recebidos</h2>
          <p className="text-on-surface-variant text-body-sm">{total} ticket(s) no período</p>
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
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.4} />
              <XAxis dataKey="label" stroke="var(--on-surface-variant)" fontSize={12} />
              <YAxis stroke="var(--on-surface-variant)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 8, color: 'var(--on-surface)' }}
                formatter={(value) => [value, 'Tickets']}
              />
              <Line type="monotone" dataKey="count" stroke="var(--primary-container)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
