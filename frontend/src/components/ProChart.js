import React, { useEffect, useRef, useState } from 'react';
import { init, dispose } from 'klinecharts';

// Gráfico profissional (KLineChart): zoom/pan persistente em update ao vivo,
// crosshair, volume, médias, MACD/RSI e ferramentas de desenho.
// Recebe candles do backend (com overlay de manipulação aplicado) e atualiza
// só o último candle a cada poll, preservando o zoom do usuário.

const stylesFor = (dark) => {
  const up = dark ? '#1fb57e' : '#2E7D32';
  const down = dark ? '#ef5350' : '#d32f2f';
  const axis = dark ? '#9fb0c0' : '#5b6b7a';
  const grid = dark ? 'rgba(230,237,243,0.06)' : 'rgba(11,34,57,0.06)';
  const line = dark ? 'rgba(230,237,243,0.12)' : 'rgba(11,34,57,0.12)';
  const crossBg = dark ? '#1f3343' : '#0b2239';
  return {
    grid: { horizontal: { color: grid }, vertical: { color: grid } },
    candle: {
      bar: {
        upColor: up, downColor: down, noChangeColor: axis,
        upBorderColor: up, downBorderColor: down, noChangeBorderColor: axis,
        upWickColor: up, downWickColor: down, noChangeWickColor: axis,
      },
      priceMark: { last: { line: { color: axis } } },
      tooltip: { text: { color: axis } },
    },
    xAxis: { axisLine: { color: line }, tickLine: { color: line }, tickText: { color: axis } },
    yAxis: { axisLine: { color: line }, tickLine: { color: line }, tickText: { color: axis } },
    crosshair: {
      horizontal: { line: { color: axis }, text: { backgroundColor: crossBg, color: '#fff' } },
      vertical: { line: { color: axis }, text: { backgroundColor: crossBg, color: '#fff' } },
    },
    indicator: { tooltip: { text: { color: axis } } },
  };
};

// [nome klinecharts, rótulo, sobrepõe no painel principal?]
const INDICATORS = [
  ['VOL', 'Volume', false],
  ['MA', 'MM', true],
  ['EMA', 'EMA', true],
  ['MACD', 'MACD', false],
  ['RSI', 'RSI', false],
];
const DRAWINGS = [
  ['segment', 'Tendência'],
  ['horizontalStraightLine', 'Horizontal'],
  ['fibonacciLine', 'Fibonacci'],
];

export default function ProChart({ candles }) {
  const elRef = useRef(null);
  const chartRef = useRef(null);
  const lastSpacingRef = useRef(null);
  const paneIds = useRef({});
  const [on, setOn] = useState({ VOL: true, MA: true, EMA: false, MACD: false, RSI: false });

  // Inicializa o gráfico uma vez (com volume + MM por padrão).
  useEffect(() => {
    const el = elRef.current;
    const dark = document.documentElement.classList.contains('dark');
    const chart = init(el);
    chart.setStyles(stylesFor(dark));
    chartRef.current = chart;
    // Gráfico novo está vazio: força o próximo efeito de dados a fazer applyNewData
    // (e não updateData). Sem isso, no remount do StrictMode o ref persistia e
    // caía no updateData num gráfico vazio -> um candle gigante só.
    lastSpacingRef.current = null;
    paneIds.current.VOL = chart.createIndicator('VOL', false, { id: 'pane_vol' });
    paneIds.current.MA = chart.createIndicator('MA', true, { id: 'candle_pane' });
    return () => { dispose(el); chartRef.current = null; paneIds.current = {}; };
  }, []);

  // Carrega/atualiza os dados. Detecta troca de timeframe pelo ESPAÇAMENTO real entre os
  // candles (não pelo prop interval, que muda antes dos novos dados chegarem — o que fazia
  // aplicar dados do timeframe antigo e corromper o gráfico). Mesmo espaçamento = poll ao
  // vivo -> atualiza só o último candle (mantém o zoom). Espaçamento diferente = recarrega.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !candles || !candles.length) return;
    const data = candles.map((c) => ({ timestamp: c.time, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume || 0 }));
    const spacing = data.length > 1 ? data[data.length - 1].timestamp - data[data.length - 2].timestamp : 0;
    if (lastSpacingRef.current !== spacing) {
      chart.applyNewData(data);
      lastSpacingRef.current = spacing;
    } else {
      chart.updateData(data[data.length - 1]);
    }
  }, [candles]);

  const toggle = (name, onMain) => {
    const chart = chartRef.current;
    if (!chart) return;
    // O efeito colateral fica FORA do setOn (que o StrictMode chama 2x -> duplicava o
    // indicador). paneIds (ref) é a fonte de verdade do que está ativo; cria/remove 1x.
    const isOn = !!paneIds.current[name];
    if (isOn) {
      chart.removeIndicator(paneIds.current[name], name);
      paneIds.current[name] = null;
    } else {
      paneIds.current[name] = chart.createIndicator(name, onMain, onMain ? { id: 'candle_pane' } : undefined);
    }
    setOn((prev) => ({ ...prev, [name]: !isOn }));
  };

  const pill = (active) =>
    `px-2.5 py-1 rounded-md text-[12px] font-label-caps transition-colors ${
      active ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
    }`;
  const ghost = 'px-2.5 py-1 rounded-md text-[12px] bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors';

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {INDICATORS.map(([n, label, main]) => (
          <button key={n} onClick={() => toggle(n, main)} className={pill(on[n])}>{label}</button>
        ))}
        <span className="w-px h-5 bg-outline-variant/40 mx-1" />
        {DRAWINGS.map(([name, label]) => (
          <button key={name} onClick={() => chartRef.current?.createOverlay(name)} className={ghost}>{label}</button>
        ))}
        <button onClick={() => chartRef.current?.removeOverlay()} className={ghost}>Limpar</button>
      </div>
      <div ref={elRef} style={{ height: 480, width: '100%' }} />
    </div>
  );
}
