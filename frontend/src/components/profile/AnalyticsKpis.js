import React, { useState, useEffect } from 'react';
import api from '../../api';

const USD = (v) => `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pnlCls = (v) => ((v ?? 0) >= 0 ? 'text-success' : 'text-danger');

function Kpi({ label, value, valueCls = 'text-on-surface' }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm">
      <p className="font-label-caps uppercase text-body-sm text-on-surface-variant">{label}</p>
      <p className={`font-headline-md text-headline-md mt-1 tabular-nums ${valueCls}`}>{value}</p>
    </div>
  );
}

// KPIs de evolução do usuário. `basePath` = '/me' ou '/admin/users/:id'.
export default function AnalyticsKpis({ basePath }) {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`${basePath}/analytics`);
        if (!cancelled) setD(res.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Erro ao carregar analytics.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [basePath]);

  if (loading) return (<div className="flex justify-center py-10"><div className="w-9 h-9 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" /></div>);
  if (error) return (<div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-6 text-body-sm">{error}</div>);
  if (!d) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Kpi label="P&L realizado" value={USD(d.realizedPnl)} valueCls={pnlCls(d.realizedPnl)} />
      <Kpi label="Retorno (ROI)" value={`${d.roi}%`} valueCls={pnlCls(d.roi)} />
      <Kpi label="Taxa de acerto" value={`${d.winRate}%`} />
      <Kpi label="Operações" value={d.nTrades} />
      <Kpi label="Volume negociado" value={USD(d.volume)} />
      <Kpi label="P&L flutuante" value={USD(d.floatingPnl)} valueCls={pnlCls(d.floatingPnl)} />
      <Kpi label="Melhor operação" value={USD(d.bestTrade)} valueCls="text-success" />
      <Kpi label="Pior operação" value={USD(d.worstTrade)} valueCls="text-danger" />
    </div>
  );
}
