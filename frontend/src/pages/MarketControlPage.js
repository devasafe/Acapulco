import React, { useEffect, useState, useCallback } from 'react';
import AdminShell from '../components/admin/AdminShell';
import {
  listAllAssets, listInterventions, scheduleIntervention, cancelIntervention,
} from '../services/marketControlService';

// Painel admin de agendamento de JANELAS de intervenção.
// O ativo sempre espelha o mercado real; o admin agenda uma janela [início, fim]
// com rampa de entrada/saída suave (preço fixo ou variação %). A lista atualiza
// por poll a cada ~5s.
const TF = [
  { label: '1m', ms: 60000 }, { label: '5m', ms: 300000 },
  { label: '15m', ms: 900000 }, { label: '1h', ms: 3600000 },
];
const STATUS = { pending: 'Pendente', active: 'Ativa', done: 'Concluída', cancelled: 'Cancelada' };
const fmt = (d) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export default function MarketControlPage() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    startAt: '', endAt: '', mode: 'percent', value: '', rampCandles: '3', rampTimeframeMs: '300000',
  });
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
  // Atualiza a lista a cada 5s para acompanhar quando o scheduler ativa/conclui.
  useEffect(() => {
    if (!selected) return undefined;
    const t = setInterval(() => loadItems(selected), 5000);
    return () => clearInterval(t);
  }, [selected, loadItems]);

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    try {
      setMsg(null);
      if (!form.startAt || !form.endAt) return setMsg({ type: 'error', text: 'Defina início e fim.' });
      const s = new Date(form.startAt).getTime();
      const e = new Date(form.endAt).getTime();
      if (!(e > s)) return setMsg({ type: 'error', text: 'O fim precisa ser depois do início.' });
      const rampMs = Number(form.rampCandles) * Number(form.rampTimeframeMs);
      if (2 * rampMs > (e - s)) {
        return setMsg({ type: 'error', text: 'As rampas (entrada+saída) não cabem na janela. Reduza as velas ou aumente a janela.' });
      }
      await scheduleIntervention(selected, {
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        mode: form.mode,
        value: Number(form.value),
        rampCandles: Number(form.rampCandles),
        rampTimeframeMs: Number(form.rampTimeframeMs),
      });
      setMsg({ type: 'success', text: 'Janela agendada.' });
      setForm((f) => ({ ...f, startAt: '', endAt: '', value: '' }));
      loadItems(selected);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || err.message });
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

  const inputCls = 'bg-background border border-outline-variant rounded-lg px-3 py-2 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container';
  const primaryBtn = 'bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity disabled:opacity-40';

  return (
    <AdminShell
      title="Controle de Mercado"
      subtitle="Agende janelas de intervenção (início → fim) com rampa de entrada e saída suave. O ativo espelha o mercado real fora da janela."
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
                : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary-container/60'
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
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
            <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Agendar janela</h2>
            <div className="grid gap-3 mb-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                  Início
                  <input type="datetime-local" className={inputCls} value={form.startAt} onChange={setField('startAt')} />
                </label>
                <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                  Fim
                  <input type="datetime-local" className={inputCls} value={form.endAt} onChange={setField('endAt')} />
                </label>
              </div>
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
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                  Nº de velas da rampa
                  <input type="number" min="1" className={inputCls} placeholder="3" value={form.rampCandles} onChange={setField('rampCandles')} />
                </label>
                <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                  Timeframe da rampa
                  <select className={inputCls} value={form.rampTimeframeMs} onChange={setField('rampTimeframeMs')}>
                    {TF.map((t) => <option key={t.ms} value={t.ms}>{t.label}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <button
              onClick={submit}
              className={primaryBtn}
              disabled={!selected || form.value === '' || !form.startAt || !form.endAt}
            >
              Agendar janela
            </button>
          </section>

          {/* Lista */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
            <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Intervenções</h2>
            <div className="space-y-2">
              {items.length === 0 && <p className="text-on-surface-variant text-body-sm">Nenhuma intervenção.</p>}
              {items.map((iv) => {
                const tf = TF.find((t) => t.ms === iv.rampTimeframeMs);
                return (
                  <div key={iv._id} className="flex items-center justify-between gap-2 bg-background rounded-lg px-3 py-2">
                    <div className="text-body-sm">
                      <span className="text-on-surface font-data-mono">{fmt(iv.startAt)} → {fmt(iv.endAt)}</span>
                      <span className="text-on-surface-variant"> · {iv.mode === 'percent' ? `${iv.value > 0 ? '+' : ''}${iv.value}%` : `→ ${iv.value}`}</span>
                      <span className="text-on-surface-variant"> · rampa {iv.rampCandles}×{tf ? tf.label : `${iv.rampTimeframeMs}ms`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] uppercase px-2 py-0.5 rounded ${
                        iv.status === 'active'
                          ? 'bg-primary-container/40 text-on-surface'
                          : iv.status === 'done'
                            ? 'bg-success/20 text-success'
                            : iv.status === 'cancelled'
                              ? 'bg-outline-variant text-on-surface-variant'
                              : 'bg-primary-container/20 text-on-surface'
                      }`}>{STATUS[iv.status]}</span>
                      {(iv.status === 'pending' || iv.status === 'active') && (
                        <button onClick={() => cancel(iv._id)} className="text-error text-body-sm hover:underline">Cancelar</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
