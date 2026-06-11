import React, { useEffect, useState } from 'react';
import AdminShell from '../components/admin/AdminShell';
import { getAllAssetsAdmin, addAsset, toggleAsset, removeAsset } from '../services/assetService';
import { searchSymbols } from '../services/marketService';

export default function AssetAdminPage() {
  const [assets, setAssets] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState(null); // { type: 'error' | 'success', text }

  const load = () => getAllAssetsAdmin().then((r) => setAssets(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSearch = async () => {
    setMsg(null);
    try {
      const r = await searchSymbols(query, 'crypto');
      setResults(r.data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Falha na busca de símbolos.' });
    }
  };

  const handleAdd = async (symbol, name, assetType = 'crypto') => {
    setMsg(null);
    try {
      await addAsset({ symbol, name, assetType });
      setMsg({ type: 'success', text: `${symbol} adicionado à watchlist.` });
      setResults([]);
      setQuery('');
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao adicionar.' });
    }
  };

  const handleToggle = async (id) => { await toggleAsset(id); load(); };
  const handleRemove = async (id) => { await removeAsset(id); load(); };

  const inputCls = 'bg-background border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container';
  const primaryBtn = 'bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity disabled:opacity-40';
  const ghostBtn = 'bg-surface-container-lowest text-on-surface border border-outline-variant/40 px-4 py-2 rounded-lg font-label-caps uppercase hover:border-primary-container/60 transition-colors disabled:opacity-40';

  return (
    <AdminShell
      title="Ativos (watchlist)"
      subtitle="Adicione ativos por símbolo. O sistema valida no provedor de mercado antes de salvar."
    >
      {msg && (
        <div
          className={`mb-5 rounded-lg px-4 py-3 text-body-sm border ${
            msg.type === 'error'
              ? 'bg-error/10 border-error/40 text-error'
              : 'bg-success/10 border-success/40 text-success'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Busca / adição */}
      <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 mb-6">
        <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Adicionar ativo</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">search</span>
            <input
              className={`${inputCls} w-full pl-10`}
              placeholder="Buscar símbolo (ex.: btc, eth, sol)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className={primaryBtn}>Buscar</button>
          <button
            onClick={() => handleAdd(query.toUpperCase(), query.toUpperCase())}
            className={ghostBtn}
            disabled={!query.trim()}
          >
            Adicionar direto
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {results.map((r) => (
              <button
                key={r.symbol}
                onClick={() => handleAdd(r.symbol, r.name, r.assetType)}
                className="inline-flex items-center gap-1 bg-primary-container/15 text-on-primary-container hover:bg-primary-container/30 transition-colors rounded-full px-3 py-1.5 text-body-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span className="font-label-caps">{r.symbol}</span>
                <span className="text-on-surface-variant">({r.name})</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lista */}
      <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
        <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Watchlist atual</h2>

        {assets.length === 0 ? (
          <p className="text-on-surface-variant text-body-sm">Nenhum ativo cadastrado.</p>
        ) : (
          <>
            {/* Tabela (desktop) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead>
                  <tr className="text-left border-b border-outline-variant/20">
                    {['Símbolo', 'Nome', 'Tipo', 'Status', 'Ações'].map((h) => (
                      <th key={h} className="font-label-caps text-[12px] uppercase text-on-surface-variant py-2 px-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a) => (
                    <tr key={a._id} className="border-b border-outline-variant/10 last:border-0">
                      <td className="py-2.5 px-2 font-label-caps text-on-surface">{a.symbol}</td>
                      <td className="py-2.5 px-2 text-on-surface-variant">{a.name}</td>
                      <td className="py-2.5 px-2 text-on-surface-variant">{a.assetType}</td>
                      <td className="py-2.5 px-2">
                        <button
                          onClick={() => handleToggle(a._id)}
                          title="Ativar / desativar"
                          className={`inline-flex items-center gap-1 text-[11px] uppercase px-2 py-0.5 rounded transition-opacity hover:opacity-80 ${
                            a.isActive
                              ? 'bg-success/15 text-success'
                              : 'bg-outline-variant/20 text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">{a.isActive ? 'toggle_on' : 'toggle_off'}</span>
                          {a.isActive ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="py-2.5 px-2">
                        <button
                          onClick={() => handleRemove(a._id)}
                          title="Remover"
                          className="inline-flex items-center gap-1 text-error hover:underline"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="md:hidden space-y-2">
              {assets.map((a) => (
                <div key={a._id} className="bg-background rounded-lg px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-label-caps text-on-surface">{a.symbol}</span>
                      <span className="text-on-surface-variant text-body-sm"> · {a.name}</span>
                      <span className="block text-on-surface-variant text-[12px]">{a.assetType}</span>
                    </div>
                    <button
                      onClick={() => handleToggle(a._id)}
                      title="Ativar / desativar"
                      className={`inline-flex items-center gap-1 text-[11px] uppercase px-2 py-0.5 rounded shrink-0 ${
                        a.isActive
                          ? 'bg-success/15 text-success'
                          : 'bg-outline-variant/20 text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{a.isActive ? 'toggle_on' : 'toggle_off'}</span>
                      {a.isActive ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(a._id)}
                    title="Remover"
                    className="mt-2 inline-flex items-center gap-1 text-error text-body-sm hover:underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </AdminShell>
  );
}
