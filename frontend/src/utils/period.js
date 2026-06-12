// Helpers de período compartilhados pelos cards admin de série temporal.

export const GRANS = [
  { key: 'day', label: 'Dia' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mês' },
];

// 'YYYY-MM-DD' -> rótulo curto conforme granularidade (parse manual evita shift de fuso).
export const fmtPeriod = (period, granularity) => {
  const [y, m, dd] = period.split('-');
  if (granularity === 'month') return `${m}/${y}`;
  return `${dd}/${m}`;
};

// Data de hoje e de N meses atrás como 'YYYY-MM-DD' (para defaults dos inputs).
export const ymd = (date) => date.toISOString().slice(0, 10);
export const monthsAgo = (n) => {
  const t = new Date();
  return ymd(new Date(t.getFullYear(), t.getMonth() - n, t.getDate()));
};
