import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteShell from '../components/SiteShell';
import { getAssets } from '../services/assetService';
import { connectSocket } from '../services/socketService';
import { getToken } from '../utils/auth';

const fmtPrice = (n) =>
  n == null ? '—' : `$${Number(n).toLocaleString('en-US', { maximumFractionDigits: 8 })}`;

function Spinner() {
  return (
    <div className="flex justify-center items-center py-24">
      <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
    </div>
  );
}

export default function MarketsPage() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let mounted = true;
    getAssets()
      .then((res) => { if (mounted) setAssets(res.data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });

    // Preços ao vivo via socket
    const socket = connectSocket(getToken());
    const onPrice = ({ symbol, price, changePercent }) => {
      setAssets((prev) =>
        prev.map((a) => (a.symbol === symbol ? { ...a, price, changePercent } : a))
      );
    };
    if (socket) socket.on('price', onPrice);

    return () => {
      mounted = false;
      if (socket) socket.off('price', onPrice);
    };
  }, []);

  const visible = assets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      (a.name || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <SiteShell active="Mercados">
      <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="mb-6">
          <h1 className="font-headline-xl text-headline-md text-on-surface leading-tight">Mercados</h1>
          <p className="text-on-surface-variant text-body-sm mt-1">
            Preços reais de mercado, atualizando ao vivo. Pratique com dinheiro fictício.
          </p>
        </div>

        <label className="relative block mb-6">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Filtrar por símbolo ou nome..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-background border border-outline-variant rounded-lg pl-10 pr-3 py-2.5 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container"
          />
        </label>

        {loading ? (
          <Spinner />
        ) : visible.length === 0 ? (
          <p className="text-on-surface-variant text-center py-16 font-body-sm">
            Nenhum ativo na watchlist. (O admin pode adicionar ativos por símbolo no painel.)
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((a) => {
              const up = (a.changePercent ?? 0) >= 0;
              return (
                <button
                  key={a.symbol}
                  type="button"
                  onClick={() => navigate(`/asset/${a.symbol}`)}
                  className="text-left bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-5 transition-all hover:-translate-y-1 hover:border-primary-container/60 focus:outline-none focus:border-primary-container"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-headline-md text-[18px] text-on-surface truncate">{a.symbol}</h2>
                      <p className="text-on-surface-variant font-body-sm truncate">{a.name}</p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold tabular-nums text-body-sm ${
                        up ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {up ? 'trending_up' : 'trending_down'}
                      </span>
                      {a.changePercent == null ? '—' : `${a.changePercent.toFixed(2)}%`}
                    </span>
                  </div>

                  <p className="font-headline-md text-headline-md text-on-surface tabular-nums mt-4">
                    {fmtPrice(a.price)}
                  </p>

                  <span className="mt-4 w-full inline-flex justify-center items-center bg-primary-container text-on-primary-container py-2.5 rounded-lg font-label-caps uppercase">
                    Negociar
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
