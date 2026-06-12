import React, { useState, useEffect, useMemo } from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api';

const DAYS_OPTIONS = [7, 30, 90];

// Card de pirâmide (funil): proporção de membros novos (cadastro recente) vs antigos.
// Self-contained: busca em /admin/members-split (exige admin) e gerencia o próprio estado.
export default function MembersPyramidCard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/admin/members-split', { params: { days } });
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Erro ao carregar membros.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [days]);

  const total = data?.total || 0;
  const newCount = data?.newCount || 0;
  const oldCount = data?.oldCount || 0;
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  // Maior segmento no topo → silhueta de pirâmide no FunnelChart.
  const funnelData = useMemo(() => (
    [
      { name: 'Antigos', value: oldCount, fill: 'var(--primary-container)' },
      { name: 'Novos', value: newCount, fill: 'var(--gold)' },
    ].sort((a, b) => b.value - a.value)
  ), [oldCount, newCount]);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-headline-md text-[18px]">Membros novos vs antigos</h2>
          <p className="text-on-surface-variant text-body-sm">
            <span className="text-gold">{newCount} novos ({pct(newCount)}%)</span>
            {' · '}
            <span className="text-primary-container">{oldCount} antigos ({pct(oldCount)}%)</span>
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden">
          {DAYS_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-label-caps uppercase transition-colors ${days === d ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container/70'}`}
            >
              {d} dias
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-4 text-body-sm">{error}</div>
      )}

      <div className="h-[320px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
          </div>
        ) : total === 0 ? (
          <div className="flex justify-center items-center h-full text-on-surface-variant text-body-sm">
            Nenhum membro cadastrado
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                contentStyle={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 8, color: 'var(--on-surface)' }}
                formatter={(value, name) => [`${value} (${pct(value)}%)`, name]}
              />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill="var(--on-surface)" stroke="none" dataKey="name" />
                <LabelList position="left" fill="var(--on-surface-variant)" stroke="none" dataKey="value" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
