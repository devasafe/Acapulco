import React, { useState, useEffect, useCallback } from 'react';
import SiteShell from '../components/SiteShell';
import { getReferralStats } from '../services/referralService';

const fmtBRL = (n) => `R$ ${Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) => new Date(d).toLocaleDateString('pt-BR');

function Spinner() {
  return (
    <div className="flex justify-center items-center py-24">
      <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
    </div>
  );
}

export default function ReferralNetworkPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    referralCode: '', totalReferrals: 0, referrals: [],
    totalBonusEarned: 0, bonusCount: 0, bonusTransactions: [],
  });
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getReferralStats();
      setData(res.data);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro ao carregar dados de indicação.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const copyCode = () => {
    navigator.clipboard.writeText(data.referralCode);
    setMsg({ type: 'success', text: 'Código copiado!' });
    setTimeout(() => setMsg(null), 2500);
  };
  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Use meu código de indicação: ${data.referralCode}\nGanhe bônus no seu primeiro depósito!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const card = 'bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm p-5';

  return (
    <SiteShell active="Indicações">
      <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <h1 className="font-headline-xl text-headline-md text-on-surface mb-1">Indicações</h1>
        <p className="text-on-surface-variant text-body-sm mb-6">Indique amigos e ganhe comissão quando eles depositarem.</p>

        {msg && (
          <div className={`mb-5 rounded-lg px-4 py-3 text-body-sm border ${
            msg.type === 'error' ? 'bg-danger/10 border-danger/40 text-danger' : 'bg-success/10 border-success/40 text-success'
          }`}>
            {msg.text}
          </div>
        )}

        {loading ? <Spinner /> : (
          <>
            {/* Código de indicação */}
            <section className="bg-primary-container text-on-primary-container rounded-xl p-6 mb-6">
              <h2 className="font-label-caps uppercase text-[13px] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">share</span> Seu código de indicação
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  readOnly value={data.referralCode}
                  className="flex-1 min-w-[160px] bg-white/15 border border-white/25 rounded-lg px-3 py-2 font-data-mono tracking-wide text-on-primary-container focus:outline-none"
                />
                <button onClick={copyCode} className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 font-label-caps uppercase transition-colors inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">content_copy</span> Copiar
                </button>
                <button onClick={shareWhatsApp} className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 font-label-caps uppercase transition-colors inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">share</span> WhatsApp
                </button>
              </div>
              <p className="text-on-primary-container/80 text-body-sm mt-3">
                Compartilhe esse código. Quem se cadastrar com ele e fizer o primeiro depósito te gera comissão.
              </p>
            </section>

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              {[
                ['Total de indicações', String(data.totalReferrals), 'group', 'text-on-surface'],
                ['Comissão ganha', fmtBRL(data.totalBonusEarned), 'trending_up', 'text-success'],
                ['Depósitos bonificados', String(data.bonusCount), 'paid', 'text-on-surface'],
              ].map(([label, value, icon, cls]) => (
                <div key={label} className={card}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-on-surface-variant text-body-sm">{label}</p>
                      <p className={`font-headline-md text-[26px] tabular-nums ${cls}`}>{value}</p>
                    </div>
                    <span className="material-symbols-outlined text-[34px] text-on-surface-variant/30">{icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Meus indicados */}
            <section className={`${card} mb-6`}>
              <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Meus indicados ({data.totalReferrals})</h2>
              {data.referrals.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm py-4 text-center">
                  Você ainda não tem indicações. Compartilhe seu código pra começar a ganhar!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead>
                      <tr className="text-on-surface-variant text-left border-b border-outline-variant/30">
                        <th className="py-2 pr-3 font-label-caps">Nome</th>
                        <th className="py-2 pr-3 font-label-caps">Email</th>
                        <th className="py-2 pr-3 font-label-caps text-right">Saldo</th>
                        <th className="py-2 pr-3 font-label-caps">Cadastro</th>
                        <th className="py-2 font-label-caps">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.referrals.map((ref) => (
                        <tr key={ref._id} className="border-b border-outline-variant/15">
                          <td className="py-2 pr-3 text-on-surface">{ref.name}</td>
                          <td className="py-2 pr-3 text-on-surface-variant">{ref.email}</td>
                          <td className="py-2 pr-3 text-right text-success tabular-nums">{fmtBRL(ref.wallet)}</td>
                          <td className="py-2 pr-3 text-on-surface-variant tabular-nums">{fmtDate(ref.createdAt)}</td>
                          <td className="py-2">
                            <span className={`text-[11px] uppercase px-2 py-0.5 rounded font-label-caps ${ref.isActive ? 'bg-success/15 text-success' : 'bg-outline-variant/20 text-on-surface-variant'}`}>
                              {ref.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Histórico de comissão */}
            <section className={card}>
              <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Histórico de comissão</h2>
              {data.bonusTransactions.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm py-4 text-center">Nenhuma comissão recebida ainda.</p>
              ) : (
                <div className="space-y-2">
                  {data.bonusTransactions.map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between gap-3 bg-background rounded-lg px-3 py-2">
                      <p className="text-on-surface-variant text-body-sm min-w-0 truncate">{tx.description}</p>
                      <div className="text-right shrink-0">
                        <p className="text-success font-semibold tabular-nums">+{fmtBRL(tx.amount)}</p>
                        <p className="text-[11px] text-on-surface-variant/70 font-data-mono">{fmtDate(tx.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </SiteShell>
  );
}
