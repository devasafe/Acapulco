import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api';

// Card da curva de retenção (sobrevivência): % de ativados ainda ativos em D0..D90.
// Self-contained: busca em /admin/retention (exige admin).
export default function RetentionCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/admin/retention');
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Erro ao carregar retenção.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const totalUsers = data?.totalUsers || 0;
  const activatedUsers = data?.activatedUsers || 0;
  const pctAtivacao = totalUsers ? Math.round((activatedUsers / totalUsers) * 100) : 0;
  const chartData = (data?.points || []).map((p) => ({
    label: `D${p.day}`,
    retained: p.retained,
    eligible: p.eligible,
    retainedCount: p.retainedCount,
  }));

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm mb-8">
      <div className="mb-4">
        <h2 className="font-headline-md text-[18px]">Curva de retenção</h2>
        <p className="text-on-surface-variant text-body-sm">
          {activatedUsers} ativados de {totalUsers} ({pctAtivacao}% de ativação)
        </p>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-4 text-body-sm">{error}</div>
      )}

      <div className="h-[320px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
          </div>
        ) : activatedUsers === 0 ? (
          <div className="flex justify-center items-center h-full text-on-surface-variant text-body-sm">
            Sem dados de retenção ainda
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.4} />
              <XAxis dataKey="label" stroke="var(--on-surface-variant)" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="var(--on-surface-variant)" fontSize={12} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 8, color: 'var(--on-surface)' }}
                formatter={(value, name, props) => [`${value}% (${props.payload.retainedCount}/${props.payload.eligible})`, 'Retenção']}
              />
              <Line type="monotone" dataKey="retained" stroke="var(--primary-container)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
