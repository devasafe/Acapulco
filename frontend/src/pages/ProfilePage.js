import React, { useState, useEffect } from 'react';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { getProfile, updateProfile, getReferrals } from '../services/apiService';
import { getToken } from '../utils/auth';

const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProfilePage() {
  const token = getToken();
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([getProfile(token), getReferrals(token)])
      .then(([p, r]) => {
        setProfile(p);
        setForm({ name: p?.name || '', email: p?.email || '', phone: p?.phone || '' });
        setReferrals(Array.isArray(r) ? r : r?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      const updated = await updateProfile(form, token);
      setProfile(updated || { ...profile, ...form });
      setEditMode(false);
      setMsg({ type: 'ok', text: 'Dados atualizados.' });
    } catch (err) {
      setMsg({ type: 'err', text: err?.response?.data?.error || 'Erro ao atualizar.' });
    } finally {
      setSaving(false);
    }
  }

  function copyReferral() {
    if (!profile?.referralCode) return;
    const url = `${window.location.origin}/register?ref=${profile.referralCode}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <SiteNav active="Perfil" />
        <div className="flex justify-center items-center py-40">
          <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
        </div>
      </div>
    );
  }

  const referralUrl = profile?.referralCode ? `${window.location.origin}/register?ref=${profile.referralCode}` : '';
  const totalBonus = referrals.reduce((acc, r) => acc + (Number(r.referralBonusEarned) || 0), 0);
  const inputCls = 'w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 disabled:opacity-70';

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <SiteNav active="Perfil" />

      <main className="pt-20 flex-1">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-8">
          {/* Cabeçalho */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-primary-container text-white grid place-items-center text-headline-lg font-bold uppercase">
              {(profile?.name || 'U').charAt(0)}
            </div>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2">
                {profile?.name || 'Investidor'}
                <span className="material-symbols-outlined text-success text-[22px]" title="Conta verificada">verified</span>
              </h1>
              <p className="text-on-surface-variant">{profile?.email}</p>
            </div>
          </div>

          {/* Dados da conta */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-[18px]">Dados da conta</h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="text-primary font-label-caps uppercase hover:opacity-80 inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">edit</span> Editar
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => { setEditMode(false); setForm({ name: profile?.name || '', email: profile?.email || '', phone: profile?.phone || '' }); }} className="text-on-surface-variant font-label-caps uppercase hover:text-on-surface">Cancelar</button>
                  <button onClick={handleSave} disabled={saving} className="bg-primary-container text-white px-4 py-1.5 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50">{saving ? 'Salvando...' : 'Salvar'}</button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">NOME COMPLETO</label>
                <input value={form.name} disabled={!editMode} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">E-MAIL</label>
                <input type="email" value={form.email} disabled={!editMode} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">TELEFONE</label>
                <input value={form.phone} disabled={!editMode} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">CÓDIGO DE INDICAÇÃO</label>
                <input value={profile?.referralCode || '—'} disabled className={`${inputCls} font-data-mono tracking-wide`} />
              </div>
            </div>
            {msg && <p className={`mt-4 text-body-sm ${msg.type === 'ok' ? 'text-success' : 'text-danger'}`}>{msg.text}</p>}
          </section>

          {/* Indicação */}
          <section className="bg-primary-container text-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="font-headline-md text-headline-md mb-2">Programa de indicação</h2>
            <p className="text-white/70 text-body-sm mb-6">Compartilhe seu link e ganhe bônus por cada pessoa que investir.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-label-caps text-white/60">INDICADOS</p>
                <p className="font-headline-md text-headline-md tabular-nums">{referrals.length}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-label-caps text-white/60">GANHOS TOTAIS</p>
                <p className="font-headline-md text-headline-md tabular-nums text-secondary-fixed-dim">{BRL(totalBonus)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-label-caps text-white/60">SEU CÓDIGO</p>
                <p className="font-headline-md text-headline-md font-data-mono tracking-wide">{profile?.referralCode || '—'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input readOnly value={referralUrl} className="flex-1 bg-white/5 border border-white/15 text-white/90 px-4 py-2.5 rounded-lg text-body-sm focus:outline-none" />
              <button onClick={copyReferral} className="bg-white text-primary-container px-5 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 inline-flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copiado!' : 'Copiar link'}
              </button>
            </div>
          </section>

          {/* Indicados */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="font-headline-md text-[18px] mb-4">Meus indicados</h2>
            {referrals.length === 0 ? (
              <p className="text-on-surface-variant text-body-sm">Você ainda não indicou ninguém. Compartilhe seu link acima.</p>
            ) : (
              <ul className="divide-y divide-outline-variant">
                {referrals.map((r, i) => (
                  <li key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-full bg-secondary-container/40 text-on-secondary-container grid place-items-center font-bold uppercase shrink-0">
                        {(r.name || r.email || '?').charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{r.name || 'Indicado'}</p>
                        <p className="text-body-sm text-on-surface-variant truncate">{r.email}</p>
                      </div>
                    </div>
                    {r.referralBonusEarned !== undefined && (
                      <span className="text-success font-semibold tabular-nums whitespace-nowrap">+{BRL(r.referralBonusEarned)}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
