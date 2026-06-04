import React, { useState, useEffect, useMemo } from 'react';
import AdminShell from '../components/admin/AdminShell';
import { getAdminReferralProfits, getAdminReferralBonusDetails } from '../services/referralService';

const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const AdminReferralProfitsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profits, setProfits] = useState([]);
  const [bonusDetails, setBonusDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profitsRes, detailsRes] = await Promise.all([
        getAdminReferralProfits(token),
        getAdminReferralBonusDetails(token),
      ]);
      setProfits(profitsRes.data || []);
      setBonusDetails(detailsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return bonusDetails.filter((d) =>
      d.referrer.name.toLowerCase().includes(t) ||
      d.referrer.email.toLowerCase().includes(t) ||
      d.referred.name.toLowerCase().includes(t) ||
      d.referred.email.toLowerCase().includes(t)
    );
  }, [bonusDetails, searchTerm]);

  const totalBonus = profits.reduce((sum, p) => sum + p.totalBonusEarned, 0);
  const avgBonus = profits.length > 0 ? totalBonus / profits.length : 0;

  if (loading) {
    return (
      <AdminShell title="Lucros de referência">
        <div className="flex justify-center py-32">
          <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Lucros de referência" subtitle="Histórico detalhado dos bônus de indicação pagos.">
      {error && <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-4 text-body-sm">{error}</div>}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-label-caps text-on-surface-variant mb-1">REFERENCIADORES</p>
            <p className="font-headline-md text-headline-md text-primary-container tabular-nums">{profits.length}</p>
          </div>
          <span className="material-symbols-outlined text-[34px] text-primary-container/30">groups</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-label-caps text-on-surface-variant mb-1">TOTAL DISTRIBUÍDO</p>
            <p className="font-headline-md text-headline-md text-success tabular-nums">{BRL(totalBonus)}</p>
          </div>
          <span className="material-symbols-outlined text-[34px] text-success/30">trending_up</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-label-caps text-on-surface-variant mb-1">BÔNUS MÉDIO</p>
            <p className="font-headline-md text-headline-md text-gold tabular-nums">{BRL(avgBonus)}</p>
          </div>
          <span className="material-symbols-outlined text-[34px] text-gold/30">savings</span>
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 pt-6 pb-4">
          <h2 className="font-headline-md text-[18px]">Histórico de bônus pagos ({filtered.length})</h2>
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface pl-11 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-on-surface-variant text-center py-10">
            {bonusDetails.length === 0 ? 'Nenhum bônus de referência distribuído ainda.' : 'Nenhum resultado encontrado.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[820px]">
              <thead>
                <tr className="bg-surface-container border-y border-outline-variant/30 text-label-caps text-on-surface-variant">
                  <th className="px-6 py-3">QUEM RECEBEU</th>
                  <th className="px-6 py-3">E-MAIL</th>
                  <th className="px-6 py-3">CONTA CRIADA</th>
                  <th className="px-6 py-3">E-MAIL DA CONTA</th>
                  <th className="px-6 py-3 text-right">VALOR</th>
                  <th className="px-6 py-3 text-right">DATA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filtered.map((d) => (
                  <tr key={d.transactionId} className="hover:bg-surface-container/40 transition-colors">
                    <td className="px-6 py-3 font-semibold">
                      <span className="flex items-center gap-2">
                        {d.referrer.name}
                        <span className="text-[11px] font-data-mono text-on-surface-variant border border-outline-variant rounded px-1.5 py-0.5">{d.referrer.referralCode}</span>
                      </span>
                    </td>
                    <td className="px-6 py-3 text-on-surface-variant">{d.referrer.email}</td>
                    <td className="px-6 py-3 font-semibold">{d.referred.name}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{d.referred.email}</td>
                    <td className="px-6 py-3 text-right text-success font-semibold tabular-nums">{BRL(d.bonusAmount)}</td>
                    <td className="px-6 py-3 text-right text-on-surface-variant tabular-nums">{new Date(d.bonusDate).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
};

export default AdminReferralProfitsPage;
