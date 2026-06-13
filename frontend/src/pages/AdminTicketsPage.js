import React, { useState, useEffect, useCallback } from 'react';
import AdminShell from '../components/admin/AdminShell';
import api from '../api';

const STATUS_META = {
  open: { label: 'Aberto', cls: 'bg-primary-container/15 text-primary-container' },
  in_progress: { label: 'Em andamento', cls: 'bg-gold/15 text-gold' },
  resolved: { label: 'Resolvido', cls: 'bg-success/15 text-success' },
  closed: { label: 'Fechado', cls: 'bg-surface-container text-on-surface-variant' },
};
const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];
const FILTERS = [{ key: '', label: 'Todos' }, ...STATUSES.map((s) => ({ key: s, label: STATUS_META[s].label }))];
const fmtDate = (d) => (d ? new Date(d).toLocaleString('pt-BR') : '—');

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.open;
  return <span className={`px-2 py-0.5 rounded font-label-caps uppercase text-[11px] ${m.cls}`}>{m.label}</span>;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/tickets', { params: filter ? { status: filter } : {} });
      setTickets(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar tickets.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const selected = tickets.find((t) => t._id === selectedId) || null;
  const applyUpdated = (updated) => setTickets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  const changeStatus = async (status) => {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await api.patch(`/admin/tickets/${selected._id}`, { status });
      applyUpdated(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao mudar status.');
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    setBusy(true);
    try {
      const res = await api.post(`/admin/tickets/${selected._id}/responses`, { message: reply.trim() });
      applyUpdated(res.data);
      setReply('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao responder.');
    } finally {
      setBusy(false);
    }
  };

  const card = 'bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm';

  return (
    <AdminShell title="Tickets de suporte" subtitle="Acompanhe, responda e atualize o status dos chamados.">
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-6 text-body-sm">{error}</div>
      )}

      <div className="inline-flex flex-wrap rounded-lg border border-outline-variant overflow-hidden mb-6">
        {FILTERS.map((f) => (
          <button key={f.key || 'all'} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-label-caps uppercase transition-colors ${filter === f.key ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container/70'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${card} p-2 max-h-[70vh] overflow-y-auto`}>
            {tickets.length === 0 ? (
              <p className="text-on-surface-variant text-body-sm text-center py-10">Nenhum ticket.</p>
            ) : tickets.map((t) => (
              <button key={t._id} onClick={() => setSelectedId(t._id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${selectedId === t._id ? 'bg-primary-container/10' : 'hover:bg-surface-container/60'}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-on-surface truncate">{t.subject}</span>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-on-surface-variant text-body-sm truncate">{t.userId?.name || 'Usuário'} · {t.userId?.email || '—'}</p>
                <p className="text-on-surface-variant text-[12px] mt-1">{fmtDate(t.createdAt)}</p>
              </button>
            ))}
          </div>

          <div className={`${card} p-6`}>
            {!selected ? (
              <p className="text-on-surface-variant text-body-sm">Selecione um ticket para ver os detalhes.</p>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="font-headline-md text-[18px] text-on-surface">{selected.subject}</h2>
                  <StatusBadge status={selected.status} />
                </div>
                <p className="text-on-surface-variant text-body-sm mb-4">{selected.userId?.name || 'Usuário'} · {selected.userId?.email || '—'} · {fmtDate(selected.createdAt)}</p>

                <div className="bg-surface-container-low rounded-lg p-4 mb-4">
                  <p className="text-on-surface whitespace-pre-wrap">{selected.message}</p>
                </div>

                {(selected.responses || []).length > 0 && (
                  <div className="space-y-2 mb-4">
                    {selected.responses.map((r, i) => (
                      <div key={i} className={`rounded-lg p-3 ${r.author === 'admin' ? 'bg-primary-container/10' : 'bg-surface-container'}`}>
                        <p className="text-label-caps uppercase text-[11px] text-on-surface-variant mb-1">{r.author === 'admin' ? 'Suporte' : 'Usuário'} · {fmtDate(r.createdAt)}</p>
                        <p className="text-on-surface whitespace-pre-wrap text-body-sm">{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder="Escreva uma resposta..." className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-container/20 mb-3" />
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={sendReply} disabled={busy || !reply.trim()} className="bg-primary-container text-white px-5 py-2 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50">Responder</button>
                  <span className="text-on-surface-variant text-body-sm ml-2">Status:</span>
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => changeStatus(s)} disabled={busy || selected.status === s}
                      className={`px-3 py-1.5 rounded-lg text-label-caps uppercase border transition-colors disabled:opacity-50 ${selected.status === s ? 'border-primary-container text-primary-container' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}>
                      {STATUS_META[s].label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
