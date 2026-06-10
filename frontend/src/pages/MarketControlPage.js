import React, { useEffect, useState, useCallback } from 'react';
import AdminShell from '../components/admin/AdminShell';
import {
  listAllAssets, listInterventions, scheduleIntervention, cancelIntervention,
} from '../services/marketControlService';

// Painel admin de agendamento de intervenções pontuais.
// O ativo sempre espelha o mercado real; o admin agenda movimentos por data/hora
// (preço fixo ou variação %). A lista atualiza por poll a cada ~5s.
const fmt = (d) => new Date(d).toLocaleString('pt-BR');
const STATUS = { pending: 'Pendente', applied: 'Aplicada', cancelled: 'Cancelada' };

export default function MarketControlPage() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ scheduledAt: '', mode: 'percent', value: '' });
  const [msg, setMsg] = useState(null); // { type: 'error' | 'success', text }

  const loadAssets = useCallback(async () => {
    try {
      const { data } = await listAllAssets();
      setAssets(data);
      setSelected((p) => p || (data[0] && data[0]._id) || null);
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Falha ao carregar ativos.' });
    }
  }, []);

  const loadItems = useCallback(async (id) => {
    if (!id) return;
    try {
      const { data } = await listInterventions(id);
      setItems(data);
    } catch (_) {
      // erro de poll é silencioso para não piscar a tela
    }
  }, []);

  useEffect(() => { loadAssets(); }, [loadAssets]);
  useEffect(() => { loadItems(selected); }, [selected, loadItems]);
  // Atualiza a lista a cada 5s para acompanhar quando o scheduler aplica.
  useEffect(() => {
    if (!selected) return undefined;
    const t = setInterval(() => loadItems(selected), 5000);
    return () => clearInterval(t);
  }, [selected, loadItems]);

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    try {
      setMsg(null);
      if (!form.scheduledAt) {
        setMsg({ type: 'error', text: 'Escolha data e hora.' });
        return;
      }
      await scheduleIntervention(selected, {
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        mode: form.mode,
        value: Number(form.value),
      });
      setMsg({ type: 'success', text: 'Intervenção agendada.' });
      setForm({ scheduledAt: '', mode: form.mode, value: '' });
      loadItems(selected);
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || e.message });
    }
  };

  const cancel = async (ivId) => {
    try {
      await cancelIntervention(ivId);
      loadItems(selected);
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || e.message });
    }
  };

  const inputCls = 'bg-background border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container';
  const primaryBtn = 'bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity disabled:opacity-40';

  return (
    <AdminShell
      title="Controle de Mercado"
      subtitle="Agende movimentos pontuais (data/hora → preço fixo ou %). O ativo espelha o mercado real e só muda no momento agendado."
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

      {/* Seletor de ativos */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {assets.map((a) => (
          <button
            key={a._id}
            onClick={() => setSelected(a._id)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selected === a._id
                ? 'bg-primary-container text-on-primary-container border-primary-container'
                : 'bg-surface-container-lowest text-on-surface border-outline-variant/40 hover:border-primary-container/60'
            }`}
          >
            <span className="font-label-caps">{a.symbol}</span>
          </button>
        ))}
        {assets.length === 0 && (
          <p className="text-on-surface-variant text-body-sm">
            Nenhum ativo. Adicione na aba de ativos.
          </p>
        )}
      </div>

      {selected && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Agendar */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
            <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Agendar intervenção</h2>
            <div className="grid gap-3 mb-3">
              <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                Data e hora
                <input type="datetime-local" className={inputCls} value={form.scheduledAt} onChange={setField('scheduledAt')} />
              </label>
              <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                Tipo
                <select className={inputCls} value={form.mode} onChange={setField('mode')}>
                  <option value="percent">Variação %</option>
                  <option value="absolute">Preço fixo</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                {form.mode === 'percent' ? 'Variação (ex.: 10 = +10%, -5 = -5%)' : 'Preço-alvo'}
                <input className={inputCls} placeholder={form.mode === 'percent' ? '10' : '66.37'} value={form.value} onChange={setField('value')} />
              </label>
            </div>
            <button onClick={submit} className={primaryBtn} disabled={!selected || form.value === ''}>Agendar</button>
          </section>

          {/* Lista */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
            <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Intervenções</h2>
            <div className="space-y-2">
              {items.length === 0 && <p className="text-on-surface-variant text-body-sm">Nenhuma intervenção.</p>}
              {items.map((iv) => (
                <div key={iv._id} className="flex items-center justify-between gap-2 bg-background rounded-lg px-3 py-2">
                  <div className="text-body-sm">
                    <span className="text-on-surface font-data-mono">{fmt(iv.scheduledAt)}</span>
                    <span className="text-on-surface-variant"> · {iv.mode === 'percent' ? `${iv.value > 0 ? '+' : ''}${iv.value}%` : `→ ${iv.value}`}</span>
                    {iv.status === 'applied' && iv.resultPrice != null && <span className="text-on-surface-variant"> (saiu {Number(iv.resultPrice).toFixed(2)})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] uppercase px-2 py-0.5 rounded ${iv.status === 'applied' ? 'bg-success/20 text-success' : iv.status === 'cancelled' ? 'bg-outline-variant/20 text-on-surface-variant' : 'bg-primary-container/30 text-on-surface'}`}>{STATUS[iv.status]}</span>
                    {iv.status === 'pending' && <button onClick={() => cancel(iv._id)} className="text-error text-body-sm hover:underline">Cancelar</button>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
