import React, { useEffect, useState, useCallback } from 'react';
import AdminShell from '../components/admin/AdminShell';
import {
  listAllAssets, getState, configure, jump, setTarget, setTrend, preset,
} from '../services/marketControlService';

// Painel admin para pilotar ativos controlados (priceMode='controlled').
// Estado ao vivo via poll a cada 3s. Controles: alvo gradual, pulo rápido,
// tendência, presets e configuração do motor.
export default function MarketControlPage() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState(null);
  const [form, setForm] = useState({
    targetPrice: '', durationMinutes: '', easing: 'easeInOut',
    jumpPrice: '', drift: '',
    referenceSymbol: '', followStrength: '', noiseVolatility: '', initialPrice: '',
  });
  const [msg, setMsg] = useState(null); // { type: 'error' | 'success', text }

  const loadList = useCallback(async () => {
    try {
      const { data } = await listAllAssets();
      setAssets(data);
      setSelected((prev) => prev || (data[0] && data[0]._id) || null);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Falha ao carregar ativos.' });
    }
  }, []);

  const loadState = useCallback(async (id) => {
    if (!id) return;
    try {
      const { data } = await getState(id);
      setState(data);
    } catch (err) {
      // erro de poll é silencioso para não piscar a tela
    }
  }, []);

  useEffect(() => { loadList(); }, [loadList]);
  useEffect(() => { loadState(selected); }, [selected, loadState]);
  // Atualiza o estado a cada 3s para acompanhar o motor ao vivo.
  useEffect(() => {
    if (!selected) return undefined;
    const t = setInterval(() => loadState(selected), 3000);
    return () => clearInterval(t);
  }, [selected, loadState]);

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Executa uma ação, trata erro/sucesso e recarrega o estado.
  const act = async (fn, okText) => {
    if (!selected) return;
    try {
      setMsg(null);
      await fn();
      if (okText) setMsg({ type: 'success', text: okText });
      await loadState(selected);
      await loadList();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || err.message });
    }
  };

  const launchTarget = () => act(() => setTarget(selected, {
    targetPrice: Number(form.targetPrice),
    durationMinutes: Number(form.durationMinutes),
    easing: form.easing,
  }), 'Alvo gradual lançado.');

  const jumpTo = () => act(() => jump(selected, { toPrice: Number(form.jumpPrice) }), 'Preço ajustado.');
  const jumpPct = (percent) => act(() => jump(selected, { percent }));
  const applyTrend = () => act(() => setTrend(selected, { dailyDriftPercent: Number(form.drift) }), 'Tendência aplicada.');
  const trendOff = () => act(() => setTrend(selected, { off: true }), 'Tendência desligada.');
  const applyPreset = (type) => act(() => preset(selected, { type }), `Preset "${type}" aplicado.`);

  // Monta o payload de parâmetros do motor (referência/força/ruído) a partir do form.
  const engineParams = () => {
    const p = {};
    if (form.referenceSymbol !== '') p.referenceSymbol = form.referenceSymbol.toUpperCase();
    if (form.followStrength !== '') p.followStrength = Number(form.followStrength);
    if (form.noiseVolatility !== '') p.noiseVolatility = Number(form.noiseVolatility);
    return p;
  };

  // Ativa o modo controlado num ativo espelho (exige preço inicial > 0).
  const activate = () => act(
    () => configure(selected, { priceMode: 'controlled', initialPrice: Number(form.initialPrice), ...engineParams() }),
    'Modo controlado ativado.',
  );

  // Salva os parâmetros do motor (sem trocar o modo) num ativo já controlado.
  const saveConfig = () => act(() => configure(selected, engineParams()), 'Configuração salva.');

  // Devolve o ativo ao modo espelho (volta a seguir a Binance ao vivo).
  const revertToMirror = () => act(() => configure(selected, { priceMode: 'mirror' }), 'Voltou para modo espelho.');

  const c = state?.control || {};
  const target = c.target || {};
  const isControlled = state?.priceMode === 'controlled';
  const inputCls = 'bg-background border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container';
  const primaryBtn = 'bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity disabled:opacity-40';
  const ghostBtn = 'bg-surface-container border border-outline-variant/40 text-on-surface px-4 py-2 rounded-lg hover:border-primary-container/60 transition-colors';

  return (
    <AdminShell
      title="Controle de Mercado"
      subtitle="Pilote os ativos controlados: alvo gradual, pulo, tendência e presets. O motor atualiza o preço 24/7."
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
            onClick={() => { setSelected(a._id); setState(null); setForm((f) => ({ ...f, initialPrice: '' })); }}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              selected === a._id
                ? 'bg-primary-container text-on-primary-container border-primary-container'
                : 'bg-surface-container-lowest text-on-surface border-outline-variant/40 hover:border-primary-container/60'
            }`}
          >
            <span className="font-label-caps">{a.symbol}</span>
            <span
              className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                a.priceMode === 'controlled' ? 'bg-success/20 text-success' : 'bg-outline-variant/20 text-on-surface-variant'
              }`}
            >
              {a.priceMode === 'controlled' ? 'controlado' : 'espelho'}
            </span>
            {a.priceMode === 'controlled' && (
              <span className="opacity-70 font-data-mono">
                {typeof a.control?.currentPrice === 'number' ? a.control.currentPrice.toFixed(4) : '—'}
              </span>
            )}
          </button>
        ))}
        {assets.length === 0 && (
          <p className="text-on-surface-variant text-body-sm">
            Nenhum ativo na watchlist. Adicione ativos no admin de ativos primeiro.
          </p>
        )}
      </div>

      {/* Aviso quando o ativo selecionado ainda é espelho */}
      {state && !isControlled && (
        <div className="mb-6 rounded-lg px-4 py-3 text-body-sm bg-outline-variant/10 border border-outline-variant/40 text-on-surface-variant">
          <span className="text-on-surface font-label-caps">{state.symbol}</span> está em <b>modo espelho</b> (segue a Binance ao vivo).
          Os controles de pilotagem só aparecem após você <b>ativar o modo controlado</b> abaixo (defina um preço inicial &gt; 0).
        </div>
      )}

      {state && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Estado ao vivo */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
            <h2 className="font-headline-md text-[18px] text-on-surface mb-2">Estado — {state.symbol}</h2>
            <p className="text-headline-xl font-data-mono text-on-surface">
              {typeof c.currentPrice === 'number' ? c.currentPrice.toFixed(4) : '—'}
            </p>
            <div className="mt-3 space-y-1 text-body-sm text-on-surface-variant">
              <p>Modo: <span className="text-on-surface">{state.priceMode}</span></p>
              {c.referenceSymbol && <p>Referência: <span className="text-on-surface">{c.referenceSymbol}</span></p>}
              {typeof c.followStrength === 'number' && <p>Força de acompanhamento: <span className="text-on-surface">{c.followStrength}</span></p>}
              {typeof c.noiseVolatility === 'number' && <p>Ruído: <span className="text-on-surface">{c.noiseVolatility}</span></p>}
              {target.active && (
                <p className="text-on-primary-container">
                  Indo a {target.targetPrice} até {new Date(target.endAt).toLocaleTimeString()}
                </p>
              )}
              {c.trend?.active && <p className="text-on-primary-container">Tendência: {c.trend.dailyDriftPercent}%/dia</p>}
            </div>
          </section>

          {/* Controles de pilotagem — só para ativos controlados */}
          {isControlled && (
            <>
              {/* Alvo gradual (principal) */}
              <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
                <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Alvo gradual</h2>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <input className={`${inputCls} w-32`} placeholder="preço-alvo" value={form.targetPrice} onChange={setField('targetPrice')} />
                  <input className={`${inputCls} w-28`} placeholder="duração (min)" value={form.durationMinutes} onChange={setField('durationMinutes')} />
                  <select className={inputCls} value={form.easing} onChange={setField('easing')}>
                    <option value="easeInOut">suave</option>
                    <option value="linear">linear</option>
                  </select>
                </div>
                <button onClick={launchTarget} className={`${primaryBtn} w-full`}>Lançar</button>
              </section>

              {/* Pulo rápido */}
              <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
                <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Pulo rápido</h2>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <button onClick={() => jumpPct(1)} className={ghostBtn}>+1%</button>
                  <button onClick={() => jumpPct(5)} className={ghostBtn}>+5%</button>
                  <button onClick={() => jumpPct(-5)} className={ghostBtn}>-5%</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <input className={`${inputCls} w-32`} placeholder="ir pra $X" value={form.jumpPrice} onChange={setField('jumpPrice')} />
                  <button onClick={jumpTo} className={primaryBtn}>Ir</button>
                </div>
              </section>

              {/* Tendência + presets */}
              <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
                <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Tendência & presets</h2>
                <div className="flex gap-2 mb-4 flex-wrap">
                  <input className={`${inputCls} w-32`} placeholder="% drift/dia" value={form.drift} onChange={setField('drift')} />
                  <button onClick={applyTrend} className={primaryBtn}>Aplicar</button>
                  <button onClick={trendOff} className={ghostBtn}>Desligar</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => applyPreset('pump')} className="bg-success/20 text-success border border-success/40 px-4 py-2 rounded-lg flex-1 hover:bg-success/30 transition-colors">Pump</button>
                  <button onClick={() => applyPreset('dump')} className="bg-danger/20 text-danger border border-danger/40 px-4 py-2 rounded-lg flex-1 hover:bg-danger/30 transition-colors">Dump</button>
                  <button onClick={() => applyPreset('flat')} className={`${ghostBtn} flex-1`}>Lateral</button>
                </div>
              </section>
            </>
          )}

          {/* Configuração / ativação do motor */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 md:col-span-2">
            <h2 className="font-headline-md text-[18px] text-on-surface mb-1">
              {isControlled ? 'Configuração do motor' : 'Ativar modo controlado'}
            </h2>
            <p className="text-body-sm text-on-surface-variant mb-4">
              {isControlled
                ? 'Ajuste referência, força de acompanhamento e ruído. As mudanças entram no próximo tique.'
                : 'Passe este ativo para o motor próprio. Defina um preço inicial (>0); opcionalmente, a referência que ele acompanha.'}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
              <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                Referência (ex.: BTCUSDT)
                <input className={inputCls} placeholder="BTCUSDT" value={form.referenceSymbol} onChange={setField('referenceSymbol')} />
              </label>
              <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                Força (0–1)
                <input className={inputCls} placeholder="0.6" value={form.followStrength} onChange={setField('followStrength')} />
              </label>
              <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                Ruído (ex.: 0.002)
                <input className={inputCls} placeholder="0.002" value={form.noiseVolatility} onChange={setField('noiseVolatility')} />
              </label>
              {!isControlled && (
                <label className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                  Preço inicial (&gt; 0)
                  <input className={inputCls} placeholder="100" value={form.initialPrice} onChange={setField('initialPrice')} />
                </label>
              )}
            </div>
            {isControlled ? (
              <div className="flex gap-2 flex-wrap">
                <button onClick={saveConfig} className={primaryBtn}>Salvar configuração</button>
                <button onClick={revertToMirror} className={ghostBtn}>Voltar para espelho</button>
              </div>
            ) : (
              <button onClick={activate} className={primaryBtn} disabled={!(Number(form.initialPrice) > 0)}>
                Ativar modo controlado
              </button>
            )}
          </section>
        </div>
      )}
    </AdminShell>
  );
}
