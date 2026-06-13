import React, { useEffect, useState } from 'react';
import AdminShell from '../components/admin/AdminShell';
import { listIdeas, createIdea, removeIdea } from '../services/ideaService';
import { getAllAssetsAdmin } from '../services/assetService';

const STANCE = {
  bullish: { label: 'Alta', cls: 'bg-success/15 text-success' },
  bearish: { label: 'Baixa', cls: 'bg-danger/15 text-danger' },
  neutral: { label: 'Neutro', cls: 'bg-outline-variant text-on-surface-variant' },
};

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');

export default function AdminIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ symbol: '', title: '', body: '', stance: 'neutral', startDate: '', endDate: '' });
  const [msg, setMsg] = useState(null);

  const load = () => listIdeas().then((r) => setIdeas(r.data)).catch(() => {});
  useEffect(() => {
    load();
    getAllAssetsAdmin().then((r) => setAssets(r.data)).catch(() => {});
  }, []);

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setMsg(null);
    if (!form.symbol) { setMsg({ type: 'error', text: 'Informe o símbolo (moeda) da dica.' }); return; }
    try {
      await createIdea(form);
      setMsg({ type: 'success', text: 'Ideia publicada.' });
      setForm({ symbol: '', title: '', body: '', stance: 'neutral', startDate: '', endDate: '' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao publicar.' });
    }
  };

  const handleRemove = async (id) => { await removeIdea(id); load(); };

  const inputCls = 'bg-background border border-outline-variant rounded-lg px-3 py-2 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container';
  const primaryBtn = 'bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity disabled:opacity-40';

  return (
    <AdminShell
      title="Ideias & Análises"
      subtitle="Publique estudos e análises das moedas. Tudo aparece marcado como opinião/estudo; o resultado é o que o mercado real fizer."
    >
      {/* Aviso educacional */}
      <div className="mb-5 rounded-lg px-4 py-3 text-body-sm border bg-primary-container/10 border-primary-container/30 text-on-surface-variant">
        Publique apenas conteúdo <b className="text-on-surface">educacional e transparente</b>. Tudo aparece marcado como
        opinião/estudo; o resultado é o que o mercado real fizer (sem manipulação).
      </div>

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

      {/* Form */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-6">
        <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Publicar ideia</h2>
        <div className="grid gap-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
              Moeda *
              <select className={inputCls} value={form.symbol} onChange={setField('symbol')}>
                <option value="">Selecione…</option>
                {assets.map((a) => (
                  <option key={a._id} value={a.symbol}>{a.symbol}{a.name ? ` — ${a.name}` : ''}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
              Viés
              <select className={inputCls} value={form.stance} onChange={setField('stance')}>
                <option value="bullish">Alta (bullish)</option>
                <option value="bearish">Baixa (bearish)</option>
                <option value="neutral">Neutro</option>
              </select>
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
              Início
              <input type="date" className={inputCls} value={form.startDate} onChange={setField('startDate')} />
            </label>
            <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
              Fim
              <input type="date" className={inputCls} value={form.endDate} onChange={setField('endDate')} />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
            Título
            <input className={inputCls} value={form.title} onChange={setField('title')} />
          </label>
          <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
            Análise / conteúdo
            <textarea rows={4} className={`${inputCls} resize-y`} value={form.body} onChange={setField('body')} />
          </label>
        </div>
        <button onClick={handleSubmit} className={primaryBtn} disabled={!form.symbol}>
          Publicar ideia
        </button>
      </section>

      {/* Lista */}
      <div className="space-y-3">
        {ideas.length === 0 && (
          <p className="text-on-surface-variant text-body-sm">Nenhuma ideia publicada.</p>
        )}
        {ideas.map((idea) => {
          const stance = STANCE[idea.stance] || STANCE.neutral;
          return (
            <div
              key={idea._id}
              className="flex items-start justify-between gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {idea.symbol && (
                    <span className="text-[11px] uppercase px-2 py-0.5 rounded font-label-caps bg-primary-container/20 text-on-surface">
                      {idea.symbol}
                    </span>
                  )}
                  <span className={`text-[11px] uppercase px-2 py-0.5 rounded font-label-caps ${stance.cls}`}>
                    {stance.label}
                  </span>
                </div>
                {idea.title && <p className="text-on-surface font-semibold">{idea.title}</p>}
                {idea.body && <p className="text-body-sm text-on-surface-variant whitespace-pre-wrap">{idea.body}</p>}
                {(idea.startDate || idea.endDate) && (
                  <p className="text-[12px] text-on-surface-variant/70 mt-1 font-data-mono">
                    Válida {fmtDate(idea.startDate)} → {fmtDate(idea.endDate)}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemove(idea._id)}
                className="shrink-0 text-error hover:opacity-80 transition-opacity"
                aria-label="Remover ideia"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
