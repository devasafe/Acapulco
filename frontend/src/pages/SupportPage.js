import React, { useState, useEffect, useCallback } from 'react';
import SiteShell from '../components/SiteShell';
import api from '../api';

const SUBJECTS = ['Suporte Técnico', 'Dúvidas sobre Investimentos', 'Compliance e Segurança', 'Outros Assuntos'];

const STATUS_META = {
  open: { label: 'Aberto', cls: 'bg-primary-container/15 text-primary-container' },
  in_progress: { label: 'Em andamento', cls: 'bg-gold/15 text-gold' },
  resolved: { label: 'Resolvido', cls: 'bg-success/15 text-success' },
  closed: { label: 'Fechado', cls: 'bg-surface-container text-on-surface-variant' },
};

const fmtDate = (d) => (d ? new Date(d).toLocaleString('pt-BR') : '—');
const inputCls = 'w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20';
const cardCls = 'bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm';

export default function SupportPage() {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/tickets/mine');
      setTickets(res.data || []);
    } catch (_) {
      // erro de carga não derruba a página; envio mostra erro próprio
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) { setError('Escreva uma mensagem.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/tickets', { subject, message: message.trim() });
      setMessage('');
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      await loadTickets();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao abrir ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteShell active="Suporte">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <h1 className="font-headline-xl text-headline-md text-on-surface mb-1">Suporte</h1>
        <p className="text-on-surface-variant text-body-sm mb-6">Abra um ticket e acompanhe o status das suas solicitações.</p>

        <form onSubmit={handleSubmit} className={`${cardCls} p-6 mb-8 space-y-4`}>
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 text-body-sm">{error}</div>
          )}
          <div className="space-y-1.5">
            <label className="font-label-caps text-label-caps text-on-surface-variant">ASSUNTO</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls}>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-caps text-label-caps text-on-surface-variant">MENSAGEM</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required placeholder="Descreva sua solicitação..." className={`${inputCls} resize-none`} />
          </div>
          <button type="submit" disabled={submitting} className={`px-8 py-3 rounded-lg font-label-caps uppercase text-white transition-all active:scale-95 disabled:opacity-50 ${sent ? 'bg-success' : 'bg-primary-container hover:opacity-90'}`}>
            {submitting ? 'Enviando...' : sent ? 'Ticket aberto' : 'Abrir ticket'}
          </button>
        </form>

        <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Meus tickets</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-9 h-9 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-on-surface-variant text-body-sm">Você ainda não abriu tickets.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => {
              const meta = STATUS_META[t.status] || STATUS_META.open;
              return (
                <div key={t._id} className={`${cardCls} p-4`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-semibold text-on-surface">{t.subject}</span>
                    <span className={`px-2 py-0.5 rounded font-label-caps uppercase text-[11px] ${meta.cls}`}>{meta.label}</span>
                  </div>
                  <p className="text-on-surface-variant text-body-sm truncate">{t.message}</p>
                  <p className="text-on-surface-variant text-[12px] mt-2">{fmtDate(t.createdAt)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
