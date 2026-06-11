import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SiteNav from '../components/marketing/SiteNav';
import ProChart from '../components/ProChart';
import SiteFooter from '../components/marketing/SiteFooter';
import { getAsset } from '../services/assetService';
import { getCandles } from '../services/marketService';
import { buy as buyTrade, sell as sellTrade, closePosition, getPositions, getStats } from '../services/tradeService';
import { connectSocket } from '../services/socketService';
import { listIdeas } from '../services/ideaService';
import { getToken } from '../utils/auth';

const fmt = (n, d = 2) =>
  n == null ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: d });
const fmtUsd = (n) => (n == null ? '—' : `$${fmt(n, 2)}`);

// label exibido -> intervalo enviado à API (Binance). 1S = semana (1w), 1M = mês.
const INTERVALS = [
  { label: '1m', v: '1m' }, { label: '5m', v: '5m' }, { label: '15m', v: '15m' },
  { label: '1h', v: '1h' }, { label: '4h', v: '4h' }, { label: '1D', v: '1d' },
  { label: '1S', v: '1w' }, { label: '1M', v: '1M' },
];

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '');
const STANCE = {
  bullish: { label: 'Alta', cls: 'bg-success/15 text-success' },
  bearish: { label: 'Baixa', cls: 'bg-danger/15 text-danger' },
  neutral: { label: 'Neutro', cls: 'bg-outline-variant/20 text-on-surface-variant' },
};

function Shell({ children }) {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <SiteNav active="Mercados" />
      <main className="pt-20 flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-24">
      <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
    </div>
  );
}

export default function AssetPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [candles, setCandles] = useState([]);
  const [interval, setIntervalVal] = useState('1h');
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [position, setPosition] = useState(null);
  const [cash, setCash] = useState(null);
  const [usd, setUsd] = useState('100');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [ideas, setIdeas] = useState([]);

  const refreshPortfolio = useCallback(async () => {
    try {
      const [pos, stats] = await Promise.all([getPositions(), getStats()]);
      setPosition(pos.data.find((p) => p.symbol === symbol) || null);
      setCash(stats.data.cash);
    } catch (_) {}
  }, [symbol]);

  // Carrega detalhe + portfólio
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAsset(symbol)
      .then((res) => {
        if (!mounted) return;
        setAsset(res.data);
        if (res.data.quote) { setPrice(res.data.quote.price); setChange(res.data.quote.changePercent); }
      })
      .catch(() => setMsg({ type: 'error', text: 'Ativo não encontrado na watchlist.' }))
      .finally(() => mounted && setLoading(false));
    refreshPortfolio();
    return () => { mounted = false; };
  }, [symbol, refreshPortfolio]);

  // Candles por intervalo (re-busca ao vivo a cada 5s para o gráfico atualizar sozinho).
  // O preço do topo vem do MESMO dado (close do último candle) — fonte única de verdade,
  // então o número de cima é sempre idêntico ao do gráfico.
  const loadCandles = useCallback(() => {
    getCandles(symbol, { interval, limit: 200 })
      .then((res) => {
        setCandles(res.data);
        if (res.data.length) setPrice(res.data[res.data.length - 1].close);
      })
      .catch(() => {});
  }, [symbol, interval]);

  useEffect(() => {
    loadCandles();                              // imediato ao abrir / trocar timeframe
    const t = setInterval(loadCandles, 5000);   // atualização ao vivo a cada 5s
    return () => clearInterval(t);
  }, [loadCandles]);

  // Ideias/dicas ativas desta moeda (janela de exibição)
  useEffect(() => {
    listIdeas({ symbol, active: 1 }).then((r) => setIdeas(r.data)).catch(() => {});
  }, [symbol]);

  // Preço ao vivo
  useEffect(() => {
    const socket = connectSocket(getToken());
    const onPrice = (p) => {
      if (p.symbol !== symbol) return;
      // O preço do topo NÃO vem daqui (vem do close do último candle, p/ bater com o
      // gráfico). Do socket usamos só a variação 24h.
      if (p.changePercent != null) setChange(p.changePercent);
    };
    if (socket) socket.on('price', onPrice);
    return () => { if (socket) socket.off('price', onPrice); };
  }, [symbol]);

  const handleTrade = async (side) => {
    setMsg(null);
    const amount = Number(usd);
    if (!amount || amount < 1) { setMsg({ type: 'error', text: 'Valor mínimo $1.' }); return; }
    setBusy(true);
    try {
      const fn = side === 'buy' ? buyTrade : sellTrade;
      const res = await fn({ symbol, usd: amount });
      setMsg({ type: 'success', text: `${side === 'buy' ? 'Compra' : 'Venda'} de ${fmtUsd(amount)} @ ${fmtUsd(res.data.trade.price)}` });
      await refreshPortfolio();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao executar a ordem.' });
    } finally { setBusy(false); }
  };

  const handleClose = async () => {
    setMsg(null);
    setBusy(true);
    try {
      const res = await closePosition({ symbol });
      setMsg({ type: 'success', text: `Posição fechada (P&L ${fmtUsd(res.data.realizedPnl)})` });
      await refreshPortfolio();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao fechar.' });
    } finally { setBusy(false); }
  };

  const estUnits = usd && price ? Number(usd) / price : 0; // 1 unidade = 1 unidade do ativo
  const changeUp = (change ?? 0) >= 0;

  // P&L flutuante recalculado AO VIVO a partir do preço atual (atualiza a cada 5s, sem F5).
  const invested = position ? (position.invested ?? position.reserved ?? Math.abs(position.netUnits || 0) * (position.avgEntryPrice || 0)) : 0;
  const livePnl = position && price != null ? (price - position.avgEntryPrice) * position.netUnits : null;
  const livePnlPct = livePnl != null && invested > 0 ? (livePnl / invested) * 100 : null;

  const cardCls = 'bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm';
  const pillBase = 'px-3 py-1.5 rounded-lg text-body-sm font-label-caps transition-colors';

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <button
          onClick={() => navigate('/markets')}
          className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface mb-6 font-label-caps uppercase"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Voltar aos mercados
        </button>

        {loading ? (
          <Spinner />
        ) : (
          <>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Gráfico */}
            <section className={`${cardCls} p-5 lg:col-span-2`}>
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h1 className="font-headline-xl text-headline-md text-on-surface leading-tight">{symbol}</h1>
                  <p className="text-on-surface-variant text-body-sm">{asset?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-headline-md text-headline-md text-on-surface tabular-nums">{fmtUsd(price)}</p>
                  {change != null && (
                    <span className={`text-body-sm font-semibold tabular-nums ${changeUp ? 'text-success' : 'text-danger'}`}>
                      {changeUp ? '▲' : '▼'} {fmt(Math.abs(change), 2)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 mb-4 flex-wrap">
                {INTERVALS.map((iv) => (
                  <button
                    key={iv.v}
                    onClick={() => setIntervalVal(iv.v)}
                    className={`${pillBase} ${
                      interval === iv.v
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {iv.label}
                  </button>
                ))}
              </div>

              {candles.length > 0 ? (
                <ProChart candles={candles} />
              ) : (
                <Spinner />
              )}
            </section>

            {/* Trade + posição */}
            <div className="space-y-6">
              <section className={`${cardCls} p-5`}>
                <h2 className="font-headline-md text-[18px] text-on-surface mb-1">Negociar <span className="text-on-surface-variant text-body-sm font-normal">(fictício)</span></h2>
                <p className="text-body-sm text-on-surface-variant">
                  Caixa disponível: <b className="text-success tabular-nums">{fmtUsd(cash)}</b>
                </p>

                {msg && (
                  <div className={`my-4 rounded-lg px-4 py-3 text-body-sm border ${
                    msg.type === 'error' ? 'bg-danger/10 border-danger/40 text-danger' : 'bg-success/10 border-success/40 text-success'
                  }`}>
                    {msg.text}
                  </div>
                )}

                <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant mt-4">
                  Valor (USD)
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface-variant">$</span>
                    <input
                      type="number" min="1" step="1" value={usd} onChange={(e) => setUsd(e.target.value)}
                      className="flex-1 w-full bg-background border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface tabular-nums focus:outline-none focus:border-primary-container"
                    />
                  </div>
                </label>
                <div className="flex gap-1.5 mt-2">
                  {[10, 50, 100, 500].map((v) => (
                    <button key={v} type="button" onClick={() => setUsd(String(v))}
                      className="px-2.5 py-1 rounded-md text-body-sm bg-surface-container text-on-surface-variant hover:text-on-surface">
                      ${v}
                    </button>
                  ))}
                </div>
                <p className="text-body-sm text-on-surface-variant mt-2">
                  ≈ <b className="text-on-surface tabular-nums">{estUnits ? estUnits.toFixed(6) : '0'}</b> unidades
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    disabled={busy} onClick={() => handleTrade('buy')}
                    className="flex-1 bg-success text-white py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    Comprar
                  </button>
                  <button
                    disabled={busy} onClick={() => handleTrade('sell')}
                    className="flex-1 bg-danger text-white py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    Vender
                  </button>
                </div>
              </section>

              <section className={`${cardCls} p-5`}>
                <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Sua posição</h2>
                {position && Math.abs(position.netUnits ?? 0) > 0 ? (
                  <div className="space-y-2 text-body-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant">Direção</span>
                      <span className={`px-2 py-0.5 rounded font-label-caps uppercase ${position.netUnits > 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                        {position.netUnits > 0 ? 'Comprado' : 'Vendido'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Valor investido</span>
                      <b className="text-on-surface tabular-nums">{fmtUsd(invested)}</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Unidades</span>
                      <b className="text-on-surface tabular-nums">{Math.abs(position.netUnits).toFixed(6)}</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Preço de entrada</span>
                      <b className="text-on-surface tabular-nums">{fmtUsd(position.avgEntryPrice)}</b>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-on-surface-variant">P&L flutuante</span>
                      <span className={`px-2 py-0.5 rounded font-semibold tabular-nums ${(livePnl ?? 0) >= 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                        {fmtUsd(livePnl)}{livePnlPct != null ? ` (${livePnlPct.toFixed(2)}%)` : ''}
                      </span>
                    </div>
                    <button
                      disabled={busy} onClick={handleClose}
                      className="w-full mt-3 bg-surface-container border border-outline-variant/40 text-on-surface py-2.5 rounded-lg font-label-caps uppercase hover:border-primary-container/60 disabled:opacity-40 transition-colors"
                    >
                      Fechar posição
                    </button>
                  </div>
                ) : (
                  <p className="text-body-sm text-on-surface-variant">Você ainda não tem posição neste ativo.</p>
                )}
              </section>
            </div>
          </div>

          {ideas.length > 0 && (
            <section className={`${cardCls} p-5 mt-6`}>
              <h2 className="font-headline-md text-[18px] text-on-surface mb-4">Ideias &amp; Análises</h2>
              <div className="space-y-4">
                {ideas.map((idea) => (
                  <article key={idea._id} className="border border-outline-variant/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[11px] uppercase px-2 py-0.5 rounded font-label-caps ${STANCE[idea.stance]?.cls || STANCE.neutral.cls}`}>
                        {STANCE[idea.stance]?.label || idea.stance}
                      </span>
                      <h3 className="font-headline-md text-[15px] text-on-surface">{idea.title}</h3>
                    </div>
                    <p className="text-body-sm text-on-surface-variant whitespace-pre-line">{idea.body}</p>
                    {(idea.startDate || idea.endDate) && (
                      <p className="text-[11px] text-on-surface-variant/70 mt-2">
                        Válida{idea.startDate ? ` de ${fmtDate(idea.startDate)}` : ''}{idea.endDate ? ` até ${fmtDate(idea.endDate)}` : ''}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
          </>
        )}
      </div>
    </Shell>
  );
}
