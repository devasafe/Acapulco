import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { getAllCryptos } from '../services/apiService';
import { getToken } from '../utils/auth';

import { ASSET_BASE } from '../config';
const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function imageUrl(image) {
  if (!image || !image.trim()) return null;
  if (/^https?:\/\//.test(image)) return image;
  return `${ASSET_BASE}${image.startsWith('/') ? image : '/' + image}`;
}

function bestPlan(plans) {
  if (!Array.isArray(plans) || plans.length === 0) return null;
  return plans.reduce((a, b) => (b.yieldPercentage > a.yieldPercentage ? b : a), plans[0]);
}

function CoinIcon({ crypto }) {
  const url = imageUrl(crypto.image);
  if (url) {
    return <img src={url} alt={crypto.symbol} className="w-9 h-9 rounded-full object-cover bg-surface-container" />;
  }
  return (
    <div className="w-9 h-9 rounded-full bg-secondary-container/40 text-on-secondary-container grid place-items-center font-bold text-[12px]">
      {(crypto.symbol || crypto.name || '?').slice(0, 3).toUpperCase()}
    </div>
  );
}

export default function CryptoListPage() {
  const token = getToken();
  const navigate = useNavigate();
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('yield');

  const loadCryptos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllCryptos(token);
      setCryptos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erro ao carregar criptoativos. Tente novamente.');
      setCryptos([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadCryptos(); }, [loadCryptos]);

  const list = useMemo(() => {
    let r = cryptos.filter((c) => c.isActive !== false);
    if (q.trim()) {
      const term = q.toLowerCase();
      r = r.filter((c) => `${c.name} ${c.symbol}`.toLowerCase().includes(term));
    }
    r = [...r].sort((a, b) => {
      if (sort === 'price') return (a.price || 0) - (b.price || 0);
      if (sort === 'name') return String(a.name).localeCompare(String(b.name));
      return (bestPlan(b.plans)?.yieldPercentage || 0) - (bestPlan(a.plans)?.yieldPercentage || 0);
    });
    return r;
  }, [cryptos, q, sort]);

  const inputCls = 'bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all';

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <SiteNav active="Criptomoedas" />

      <main className="pt-20 flex-1">
        {/* Cabeçalho */}
        <section className="border-b border-outline-variant bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
            <span className="font-label-caps text-label-caps text-on-primary-container mb-3 block">CATÁLOGO</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-3">Criptoativos disponíveis</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Ativos selecionados com rendimento programado. Escolha um ativo para ver os planos e investir via Pix.
            </p>
          </div>
        </section>

        {/* Filtros */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou símbolo..." className={`${inputCls} w-full pl-11`} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-label-caps text-on-surface-variant hidden sm:inline">ORDENAR</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
              <option value="yield">Maior rendimento</option>
              <option value="price">Menor preço</option>
              <option value="name">Nome (A–Z)</option>
            </select>
          </div>
        </section>

        {/* Conteúdo */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-20">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center">
              <p className="text-on-surface-variant mb-4">{error}</p>
              <button onClick={loadCryptos} className="bg-primary-container text-white px-5 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90">Tentar novamente</button>
            </div>
          ) : list.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center">
              <p className="text-on-surface-variant">Nenhum criptoativo encontrado.</p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              {/* Tabela desktop */}
              <table className="w-full text-left hidden md:table">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant text-label-caps text-on-surface-variant">
                    <th className="px-6 py-4 w-10">#</th>
                    <th className="px-6 py-4">ATIVO</th>
                    <th className="px-6 py-4 text-right">PREÇO</th>
                    <th className="px-6 py-4 text-right">RENDIMENTO</th>
                    <th className="px-6 py-4 text-right">PRAZO</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {list.map((c, i) => {
                    const plan = bestPlan(c.plans);
                    return (
                      <tr key={c._id} className="hover:bg-surface-container/50 transition-colors">
                        <td className="px-6 py-4 text-on-surface-variant tabular-nums">{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <CoinIcon crypto={c} />
                            <div>
                              <p className="font-semibold text-on-surface">{c.name}</p>
                              <p className="text-body-sm text-on-surface-variant uppercase">{c.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums font-medium">{BRL(c.price)}</td>
                        <td className="px-6 py-4 text-right">
                          {plan ? <span className="text-success font-semibold tabular-nums">+{plan.yieldPercentage}%</span> : <span className="text-on-surface-variant">—</span>}
                        </td>
                        <td className="px-6 py-4 text-right text-on-surface-variant tabular-nums">{plan ? `${plan.period} dias` : '—'}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => navigate(`/cryptos/${c._id}`)} className="bg-primary-container text-white px-5 py-2 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity active:scale-95">
                            Investir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Cards mobile */}
              <div className="md:hidden divide-y divide-outline-variant">
                {list.map((c) => {
                  const plan = bestPlan(c.plans);
                  return (
                    <div key={c._id} className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CoinIcon crypto={c} />
                          <div>
                            <p className="font-semibold text-on-surface">{c.name}</p>
                            <p className="text-body-sm text-on-surface-variant uppercase">{c.symbol}</p>
                          </div>
                        </div>
                        {plan && <span className="text-success font-semibold tabular-nums">+{plan.yieldPercentage}%</span>}
                      </div>
                      <div className="flex items-center justify-between text-body-sm mb-4">
                        <div>
                          <p className="text-label-caps text-on-surface-variant">PREÇO</p>
                          <p className="font-medium tabular-nums">{BRL(c.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-label-caps text-on-surface-variant">PRAZO</p>
                          <p className="font-medium tabular-nums">{plan ? `${plan.period} dias` : '—'}</p>
                        </div>
                      </div>
                      <button onClick={() => navigate(`/cryptos/${c._id}`)} className="w-full bg-primary-container text-white py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90">
                        Investir
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
