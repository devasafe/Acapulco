import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api';

const GRANS = [
  { key: 'day', label: 'Dia' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mês' },
];

// 'YYYY-MM-DD' -> rótulo curto conforme granularidade (parse manual evita shift de fuso).
const fmtPeriod = (period, granularity) => {
  const [y, m, dd] = period.split('-');
  if (granularity === 'month') return `${m}/${y}`;
  return `${dd}/${m}`;
};

// Data de hoje e de N meses atrás como 'YYYY-MM-DD' (para defaults dos inputs).
const ymd = (date) => date.toISOString().slice(0, 10);
const monthsAgo = (n) => {
  const t = new Date();
  return ymd(new Date(t.getFullYear(), t.getMonth() - n, t.getDate()));
};

// Card de gráfico de linha com novos cadastros por dia/semana/mês num range escolhido.
// Self-contained: busca em /admin/registrations (exige admin) e gerencia o próprio estado.
export default function RegistrationsCard() {
  const [granularity, setGranularity] = useState('week');
  const [from, setFrom] = useState(monthsAgo(6));
  const [to, setTo] = useState(ymd(new Date()));
  const [regData, setRegData] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadRegistrations = async () => {
      try {
        setRegLoading(true);
        setRegError(null);
        const res = await api.get('/admin/registrations', { params: { from, to, granularity } });
        if (!cancelled) setRegData(res.data || []);
      } catch (err) {
        if (!cancelled) setRegError(err.response?.data?.error || 'Erro ao carregar cadastros.');
      } finally {
        if (!cancelled) setRegLoading(false);
      }
    };
    loadRegistrations();
    return () => { cancelled = true; };
  }, [from, to, granularity]);

  const regChartData = useMemo(
    () => regData.map((b) => ({ label: fmtPeriod(b.period, granularity), count: b.count })),
    [regData, granularity]
  );
  const regTotal = useMemo(() => regData.reduce((s, b) => s + b.count, 0), [regData]);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-headline-md text-[18px]">Novos cadastros</h2>
          <p className="text-on-surface-variant text-body-sm">{regTotal} cadastro(s) no período</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden">
            {GRANS.map((g) => (
              <button
                key={g.key}
                onClick={() => setGranularity(g.key)}
                className={`px-3 py-1.5 text-label-caps uppercase transition-colors ${granularity === g.key ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container/70'}`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)}
            className="bg-surface-container-low border border-outline-variant text-on-surface px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20" />
          <span className="text-on-surface-variant">→</span>
          <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)}
            className="bg-surface-container-low border border-outline-variant text-on-surface px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20" />
        </div>
      </div>

      {regError && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-4 text-body-sm">{regError}</div>
      )}

      <div className="h-[320px]">
        {regLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={regChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.4} />
              <XAxis dataKey="label" stroke="var(--on-surface-variant)" fontSize={12} />
              <YAxis stroke="var(--on-surface-variant)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 8, color: 'var(--on-surface)' }}
                formatter={(value) => [value, 'Cadastros']}
              />
              <Line type="monotone" dataKey="count" stroke="var(--primary-container)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
