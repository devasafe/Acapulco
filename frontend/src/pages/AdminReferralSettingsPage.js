import React, { useState, useEffect } from 'react';
import AdminShell from '../components/admin/AdminShell';
import { getAdminReferralSettings, updateAdminReferralSettings, getAdminReferralProfits } from '../services/referralService';

const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const AdminReferralSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referralPercentage, setReferralPercentage] = useState(10);
  const [profits, setProfits] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSettings();
    fetchProfits();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await getAdminReferralSettings(token);
      setReferralPercentage(response.data.referralPercentage);
    } catch (err) {
      setError('Erro ao carregar configurações');
    }
  };

  const fetchProfits = async () => {
    try {
      const response = await getAdminReferralProfits(token);
      setProfits(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar lucros:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      if (referralPercentage < 0 || referralPercentage > 100) {
        setError('Percentual deve estar entre 0 e 100');
        return;
      }
      await updateAdminReferralSettings(referralPercentage, token);
      setSuccess('Configurações atualizadas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const totalBonus = profits.reduce((sum, p) => sum + p.totalBonusEarned, 0);
  const avgBonus = profits.length > 0 ? totalBonus / profits.length : 0;

  if (loading) {
    return (
      <AdminShell title="Configurações de referência">
        <div className="flex justify-center py-32">
          <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Configurações de referência" subtitle="Defina o percentual de bônus pago por indicação.">
      {error && <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-4 text-body-sm">{error}</div>}
      {success && <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 mb-4 text-body-sm">{success}</div>}

      {/* Percentual */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-headline-md text-[18px] mb-4">Percentual de bônus por referência</h2>
        <div className="flex items-end gap-3 max-w-md">
          <div className="flex-1 space-y-1.5">
            <label className="text-label-caps text-on-surface-variant">PERCENTUAL (%)</label>
            <input
              type="number" min="0" max="100" step="1"
              value={referralPercentage}
              onChange={(e) => setReferralPercentage(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            />
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-primary-container text-white px-5 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
        <p className="text-body-sm text-on-surface-variant mt-3">
          Quando um usuário indicado fizer seu primeiro saque, o referenciador receberá este percentual do valor em bônus.
        </p>

        <div className="mt-5 bg-primary-container/10 rounded-lg p-4 text-body-sm">
          <p className="font-semibold mb-2">📌 Exemplo</p>
          <ul className="space-y-1 text-on-surface-variant">
            <li>• Percentual configurado: <strong className="text-on-surface">{referralPercentage}%</strong></li>
            <li>• Usuário indicado faz saque de: <strong className="text-on-surface">{BRL(1000)}</strong></li>
            <li className="text-success font-semibold pt-1">• Referenciador recebe: {BRL(1000 * referralPercentage / 100)}</li>
          </ul>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm">
          <p className="text-label-caps text-on-surface-variant mb-1">USUÁRIOS COM BÔNUS</p>
          <p className="font-headline-md text-headline-md text-primary-container tabular-nums">{profits.length}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm">
          <p className="text-label-caps text-on-surface-variant mb-1">TOTAL DISTRIBUÍDO</p>
          <p className="font-headline-md text-headline-md text-success tabular-nums">{BRL(totalBonus)}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm">
          <p className="text-label-caps text-on-surface-variant mb-1">BÔNUS MÉDIO</p>
          <p className="font-headline-md text-headline-md text-gold tabular-nums">{BRL(avgBonus)}</p>
        </div>
      </div>

      {/* Top 10 */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
        <h2 className="font-headline-md text-[18px] px-6 pt-6 pb-4">Top 10 referenciadores</h2>
        {profits.length === 0 ? (
          <p className="text-on-surface-variant text-center py-10">Nenhum bônus de referência distribuído ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="bg-surface-container border-y border-outline-variant/30 text-label-caps text-on-surface-variant">
                  <th className="px-6 py-3">NOME</th>
                  <th className="px-6 py-3">E-MAIL</th>
                  <th className="px-6 py-3">CÓDIGO</th>
                  <th className="px-6 py-3 text-right">BÔNUS TOTAL</th>
                  <th className="px-6 py-3 text-right">REFERÊNCIAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {profits.slice(0, 10).map((p) => (
                  <tr key={p.userId} className="hover:bg-surface-container/40 transition-colors">
                    <td className="px-6 py-3 font-semibold">{p.name}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{p.email}</td>
                    <td className="px-6 py-3 text-on-surface-variant font-data-mono text-body-sm">{p.referralCode}</td>
                    <td className="px-6 py-3 text-right text-success font-semibold tabular-nums">{BRL(p.totalBonusEarned)}</td>
                    <td className="px-6 py-3 text-right text-primary-container font-semibold tabular-nums">{p.bonusCount}</td>
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

export default AdminReferralSettingsPage;
