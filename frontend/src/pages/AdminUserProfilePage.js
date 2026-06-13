import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminShell from '../components/admin/AdminShell';
import AnalyticsKpis from '../components/profile/AnalyticsKpis';
import EquityCurveCard from '../components/profile/EquityCurveCard';
import api from '../api';

export default function AdminUserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const basePath = `/admin/users/${id}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`${basePath}/analytics`);
        if (!cancelled) setUser(res.data.user);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Erro ao carregar perfil.');
      }
    })();
    return () => { cancelled = true; };
  }, [basePath]);

  const back = (
    <button onClick={() => navigate('/admin/users')} className="bg-surface-container text-on-surface px-4 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 inline-flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">arrow_back</span> Voltar
    </button>
  );

  return (
    <AdminShell title={user ? user.name : 'Perfil do usuário'} subtitle={user ? user.email : ''} actions={back}>
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-6 text-body-sm">{error}</div>
      )}
      <AnalyticsKpis basePath={basePath} />
      <EquityCurveCard basePath={basePath} />
    </AdminShell>
  );
}
