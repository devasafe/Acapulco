import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { getAsset } from '../services/assetService';
import { getCandles } from '../services/marketService';
import { buy as buyTrade, sell as sellTrade, getPositions, getStats } from '../services/tradeService';
import { connectSocket } from '../services/socketService';
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
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

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

  // Candles por intervalo (re-busca ao vivo a cada 5s para o gráfico atualizar sozinho)
  const loadCandles = useCallback(() => {
    getCandles(symbol, { interval, limit: 200 })
      .then((res) => setCandles(res.data))
      .catch(() => {});
  }, [symbol, interval]);

  useEffect(() => {
    loadCandles();                              // imediato ao abrir / trocar timeframe
    const t = setInterval(loadCandles, 5000);   // atualização ao vivo a cada 5s
    return () => clearInterval(t);
  }, [loadCandles]);

  // Preço ao vivo
  useEffect(() => {
    const socket = connectSocket(getToken());
    const onPrice = (p) => {
      if (p.symbol !== symbol) return;
      setPrice(p.price);
      if (p.changePercent != null) setChange(p.changePercent);
    };
    if (socket) socket.on('price', onPrice);
    return () => { if (socket) socket.off('price', onPrice); };
  }, [symbol]);

  const dark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const up = dark ? '#1fb57e' : '#2E7D32';
  const down = dark ? '#ef5350' : '#d32f2f';
  const axis = dark ? '#9fb0c0' : '#5b6b7a';
  const gridC = dark ? 'rgba(230,237,243,0.08)' : 'rgba(11,34,57,0.08)';

  const series = [{
    data: candles.map((c) => ({ x: new Date(c.time), y: [c.open, c.high, c.low, c.close] })),
  }];

  const chartOptions = {
    chart: { type: 'candlestick', height: 440, background: 'transparent', toolbar: { show: false }, fontFamily: 'Inter, sans-serif', animations: { enabled: false } },
    xaxis: { type: 'datetime', labels: { style: { colors: axis } }, axisBorder: { color: gridC }, axisTicks: { color: gridC } },
    yaxis: { tooltip: { enabled: true }, labels: { style: { colors: axis }, formatter: (v) => `$${fmt(v, 2)}` }, opposite: true },
    grid: { borderColor: gridC, strokeDashArray: 3 },
    tooltip: { theme: dark ? 'dark' : 'light' },
    plotOptions: { candlestick: { colors: { upward: up, downward: down }, wick: { useFillColor: true } } },
  };

  const handleTrade = async (side) => {
    setMsg(null);
    const quantity = Number(qty);
    if (!quantity || quantity <= 0) {
      setMsg({ type: 'error', text: 'Informe uma quantidade válida.' });
      return;
    }
    setBusy(true);
    try {
      const fn = side === 'buy' ? buyTrade : sellTrade;
      const res = await fn({ symbol, quantity });
      const pnl = res.data.realizedPnl;
      setMsg({
        type: 'success',
        text:
          side === 'buy'
            ? `Compra executada: ${quantity} ${symbol} @ ${fmtUsd(res.data.trade.price)}`
            : `Venda executada: ${quantity} ${symbol} @ ${fmtUsd(res.data.trade.price)} (P&L ${fmtUsd(pnl)})`,
      });
      setQty('');
      await refreshPortfolio();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao executar a ordem.' });
    } finally {
      setBusy(false);
    }
  };

  const estCost = qty && price ? Number(qty) * price : 0;
  const changeUp = (change ?? 0) >= 0;

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

              {series[0].data.length > 0 ? (
                <ReactApexChart options={chartOptions} series={series} type="candlestick" height={440} />
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
                  Quantidade
                  <input
                    type="number" min="0" step="any" value={qty} onChange={(e) => setQty(e.target.value)}
                    placeholder="0.00"
                    className="bg-background border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface tabular-nums focus:outline-none focus:border-primary-container"
                  />
                </label>
                <p className="text-body-sm text-on-surface-variant mt-2">
                  Estimativa: <b className="text-on-surface tabular-nums">{fmtUsd(estCost)}</b>
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
                {position && position.quantity > 0 ? (
                  <div className="space-y-2 text-body-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Quantidade</span>
                      <b className="text-on-surface tabular-nums">{fmt(position.quantity, 8)}</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Preço médio</span>
                      <b className="text-on-surface tabular-nums">{fmtUsd(position.avgEntryPrice)}</b>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-on-surface-variant">P&L não realizado</span>
                      <span className={`px-2 py-0.5 rounded font-semibold tabular-nums ${
                        (position.unrealizedPnl ?? 0) >= 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                      }`}>
                        {fmtUsd(position.unrealizedPnl)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-body-sm text-on-surface-variant">Você ainda não tem posição neste ativo.</p>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
