import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteShell from '../components/SiteShell';
import { getStats, getPositions, getTrades } from '../services/tradeService';
import { connectSocket } from '../services/socketService';
import { getToken } from '../utils/auth';

const fmtUsd = (n) =>
  n == null ? '—' : `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtUnits = (n) => (n == null ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 8 }));
const fmtPct = (n) => (n == null ? '—' : `${Number(n).toFixed(2)}%`);
const fmtDate = (d) => (d ? new Date(d).toLocaleString('pt-BR') : '—');

const cardCls = 'bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm';
const pnlCls = (v) => ((v ?? 0) >= 0 ? 'text-success' : 'text-danger');

function Spinner() {
  return (
    <div className="flex justify-center items-center py-24">
      <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
    </div>
  );
}

function Kpi({ label, value, valueCls = 'text-on-surface' }) {
  return (
    <div className={`${cardCls} p-5`}>
      <p className="font-label-caps uppercase text-body-sm text-on-surface-variant">{label}</p>
      <p className={`font-headline-md text-headline-md mt-1 tabular-nums ${valueCls}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [s, p, t] = await Promise.all([getStats(), getPositions(), getTrades()]);
      setStats(s.data);
      setPositions(p.data);
      setTrades(t.data);
    } catch (_) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const socket = connectSocket(getToken());
    const id = setInterval(load, 15000); // revaloriza periodicamente
    return () => { clearInterval(id); if (socket) socket.off('price'); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SiteShell active="Dashboard">
      <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="font-headline-xl text-headline-md text-on-surface leading-tight">Dashboard</h1>
            <p className="text-on-surface-variant text-body-sm mt-1">
              Sua carteira fictícia, valorizada com preços reais de mercado.
            </p>
          </div>
          <button
            onClick={() => navigate('/markets')}
            className="bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity active:scale-95"
          >
            Ir aos mercados
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
              <Kpi label="Patrimônio" value={fmtUsd(stats?.equity ?? stats?.totalEquity)} />
              <Kpi label="Caixa livre" value={fmtUsd(stats?.freeMargin ?? stats?.balance ?? stats?.cash)} />
              <Kpi label="Margem usada" value={fmtUsd(stats?.marginUsed)} />
              <Kpi
                label="P&L flutuante"
                value={fmtUsd(stats?.floatingPnl ?? stats?.unrealizedPnl)}
                valueCls={pnlCls(stats?.floatingPnl ?? stats?.unrealizedPnl)}
              />
              <Kpi
                label="P&L realizado"
                value={fmtUsd(stats?.realizedPnl)}
                valueCls={pnlCls(stats?.realizedPnl)}
              />
            </div>

            {/* Posições abertas */}
            <section className={`${cardCls} p-5 mb-6`}>
              <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Posições abertas</h2>
              {positions.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">
                  Nenhuma posição aberta. Vá aos mercados e comece a praticar!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead>
                      <tr className="text-left font-label-caps uppercase text-on-surface-variant border-b border-outline-variant/30">
                        <th className="py-2 pr-4 font-medium">Ativo</th>
                        <th className="py-2 pr-4 font-medium">Direção</th>
                        <th className="py-2 pr-4 font-medium text-right">Unidades</th>
                        <th className="py-2 pr-4 font-medium text-right">Preço médio</th>
                        <th className="py-2 pr-4 font-medium text-right">Preço atual</th>
                        <th className="py-2 pr-4 font-medium text-right">Investido</th>
                        <th className="py-2 font-medium text-right">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((p) => (
                        <tr
                          key={p.symbol}
                          onClick={() => navigate(`/asset/${p.symbol}`)}
                          className="border-b border-outline-variant/20 last:border-0 cursor-pointer hover:bg-surface-container/50 transition-colors"
                        >
                          <td className="py-2.5 pr-4 font-semibold text-on-surface">{p.symbol}</td>
                          <td className="py-2.5 pr-4">
                            <span className={`px-2 py-0.5 rounded font-label-caps uppercase text-[11px] ${p.direction === 'long' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                              {p.direction === 'long' ? 'Comprado' : 'Vendido'}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-right tabular-nums text-on-surface-variant">{fmtUnits(p.units)}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums text-on-surface-variant">{fmtUsd(p.avgEntryPrice)}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums text-on-surface-variant">{fmtUsd(p.currentPrice)}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums text-on-surface-variant">{fmtUsd(p.invested)}</td>
                          <td className={`py-2.5 text-right tabular-nums font-semibold ${pnlCls(p.floatingPnl)}`}>
                            {fmtUsd(p.floatingPnl)}
                            <span className="text-on-surface-variant font-normal"> ({fmtPct(p.floatingPnlPercent)})</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Histórico de operações */}
            <section className={`${cardCls} p-5`}>
              <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Histórico de operações</h2>
              {trades.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">Nenhuma operação ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead>
                      <tr className="text-left font-label-caps uppercase text-on-surface-variant border-b border-outline-variant/30">
                        <th className="py-2 pr-4 font-medium">Data</th>
                        <th className="py-2 pr-4 font-medium">Tipo</th>
                        <th className="py-2 pr-4 font-medium">Ativo</th>
                        <th className="py-2 pr-4 font-medium text-right">Unidades</th>
                        <th className="py-2 pr-4 font-medium text-right">Preço</th>
                        <th className="py-2 pr-4 font-medium text-right">Total</th>
                        <th className="py-2 font-medium text-right">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((t) => (
                        <tr
                          key={t._id}
                          onClick={() => navigate(`/asset/${t.symbol}`)}
                          className="border-b border-outline-variant/20 last:border-0 cursor-pointer hover:bg-surface-container/50 transition-colors"
                        >
                          <td className="py-2.5 pr-4 text-on-surface-variant whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                          <td className="py-2.5 pr-4">
                            <span className={`px-2 py-0.5 rounded font-label-caps uppercase text-[11px] ${t.side === 'buy' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                              {t.side === 'buy' ? 'Compra' : 'Venda'}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 font-semibold text-on-surface">{t.symbol}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums text-on-surface-variant">{fmtUnits(t.units)}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums text-on-surface-variant">{fmtUsd(t.price)}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums text-on-surface-variant">{fmtUsd(t.total ?? t.usdAmount)}</td>
                          <td className={`py-2.5 text-right tabular-nums ${t.realizedPnl != null ? pnlCls(t.realizedPnl) : 'text-on-surface-variant'}`}>
                            {t.realizedPnl != null ? fmtUsd(t.realizedPnl) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </SiteShell>
  );
}
