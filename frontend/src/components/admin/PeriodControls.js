import React from 'react';
import { GRANS } from '../../utils/period';

// Controles de granularidade (Dia/Semana/Mês) + range De/Até. Stateless: o card é o dono.
export default function PeriodControls({ granularity, from, to, onGranularity, onFrom, onTo }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden">
        {GRANS.map((g) => (
          <button
            key={g.key}
            onClick={() => onGranularity(g.key)}
            className={`px-3 py-1.5 text-label-caps uppercase transition-colors ${granularity === g.key ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container/70'}`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <input type="date" value={from} max={to} onChange={(e) => onFrom(e.target.value)}
        className="bg-surface-container-low border border-outline-variant text-on-surface px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20" />
      <span className="text-on-surface-variant">→</span>
      <input type="date" value={to} min={from} onChange={(e) => onTo(e.target.value)}
        className="bg-surface-container-low border border-outline-variant text-on-surface px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20" />
    </div>
  );
}
