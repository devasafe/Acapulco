import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminShell from '../components/admin/AdminShell';
import RegistrationsCard from '../components/admin/RegistrationsCard';
import api from '../api';

const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const roi = (u) => (u?.totalInvested > 0 ? ((u.profit / u.totalInvested) * 100).toFixed(1) : '0');

function KPI({ title, value, icon, tone = 'text-on-surface' }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label-caps text-on-surface-variant mb-1">{title}</p>
          <p className={`font-headline-md text-headline-md tabular-nums ${tone}`}>{value}</p>
        </div>
        <span className={`material-symbols-outlined text-[26px] ${tone} opacity-70`}>{icon}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardV2() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersResponse = await api.get('/admin/users');
      const users = usersResponse.data || [];
      setAllUsers(users);
      setSelectedUser((prev) => prev || (users.length > 0 ? users[0] : null));
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar dados. Verifique sua conexão e permissões.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totals = useMemo(() => ({
    wallets: allUsers.reduce((s, u) => s + (u.walletBalance || 0), 0),
    invested: allUsers.reduce((s, u) => s + (u.totalInvested || 0), 0),
    profit: allUsers.reduce((s, u) => s + (u.profit || 0), 0),
    withdrawn: allUsers.reduce((s, u) => s + (u.totalWithdrawn || 0), 0),
    deposited: allUsers.reduce((s, u) => s + (u.totalDeposited || 0), 0),
  }), [allUsers]);

  const walletChartData = useMemo(() => allUsers
    .filter((u) => u.walletBalance > 0)
    .sort((a, b) => b.walletBalance - a.walletBalance)
    .slice(0, 10)
    .map((u) => ({ name: u.name?.split(' ')[0] || 'User', wallet: u.walletBalance })), [allUsers]);

  const filteredUsers = useMemo(() => {
    const t = searchQuery.toLowerCase();
    return allUsers.filter((u) => u.name?.toLowerCase().includes(t) || u.email?.toLowerCase().includes(t));
  }, [allUsers, searchQuery]);

  const refreshBtn = (
    <button onClick={fetchData} disabled={loading} className="bg-primary-container text-white px-4 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">refresh</span>
      {loading ? 'Carregando...' : 'Atualizar'}
    </button>
  );

  if (loading) {
    return (
      <AdminShell title="Gerenciar usuários" subtitle="Visualize dados reais e saldos em carteira." actions={refreshBtn}>
        <div className="flex justify-center py-32">
          <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Gerenciar usuários" subtitle="Visualize dados reais de qualquer usuário e saldos em carteira." actions={refreshBtn}>
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-6 text-body-sm">{error}</div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KPI title="TOTAL EM CARTEIRAS" value={BRL(totals.wallets)} icon="account_balance_wallet" tone="text-primary-container" />
        <KPI title="TOTAL INVESTIDO" value={BRL(totals.invested)} icon="trending_up" tone="text-success" />
        <KPI title="TOTAL LUCRO" value={BRL(totals.profit)} icon="emoji_events" tone="text-gold" />
        <KPI title="USUÁRIOS" value={allUsers.length} icon="groups" tone="text-on-surface" />
        <KPI title="TOTAL SACADO" value={BRL(totals.withdrawn)} icon="arrow_downward" tone="text-danger" />
        <KPI title="TOTAL DEPOSITADO" value={BRL(totals.deposited)} icon="savings" tone="text-primary-container" />
      </div>

      {/* Gráfico carteiras */}
      {walletChartData.length > 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="font-headline-md text-[18px] mb-4">Saldo em carteira por usuário (Top 10)</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={walletChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.4} />
                <XAxis dataKey="name" stroke="var(--on-surface-variant)" fontSize={12} />
                <YAxis stroke="var(--on-surface-variant)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  cursor={{ fill: 'var(--outline-variant)', opacity: 0.2 }}
                  contentStyle={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)', borderRadius: 8, color: 'var(--on-surface)' }}
                  formatter={(value) => [BRL(value), 'Carteira']}
                />
                <Bar dataKey="wallet" fill="var(--primary-container)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gráfico novos cadastros */}
      <RegistrationsCard />

      {/* Busca + perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Lista filtrada */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="font-headline-md text-[18px] mb-4">Buscar usuário</h2>
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite o nome ou e-mail..."
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface pl-11 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20"
            />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[280px] divide-y divide-outline-variant/20">
            {filteredUsers.length === 0 ? (
              <p className="text-on-surface-variant text-body-sm text-center py-8">Nenhum usuário encontrado</p>
            ) : filteredUsers.map((u, idx) => (
              <button
                key={u._id || idx}
                onClick={() => setSelectedUser(u)}
                className={`w-full flex items-center justify-between py-3 px-2 rounded-lg text-left hover:bg-surface-container/60 transition-colors ${selectedUser?._id === u._id ? 'bg-primary-container/10' : ''}`}
              >
                <span className="font-medium truncate">{u.name || 'N/A'}</span>
                <span className="text-success font-semibold tabular-nums whitespace-nowrap ml-3">{BRL(u.walletBalance)}</span>
              </button>
            ))}
          </div>
          {filteredUsers.length > 0 && (
            <p className="text-on-surface-variant text-body-sm text-center mt-3">{filteredUsers.length} usuário(s) encontrado(s)</p>
          )}
        </div>

        {/* Perfil selecionado */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
          <h2 className="font-headline-md text-[18px] mb-4">Perfil do usuário selecionado</h2>
          {selectedUser ? (
            <div>
              <div className="pb-4 mb-4 border-b border-outline-variant/30">
                <p className="text-label-caps text-on-surface-variant">NOME</p>
                <p className="font-headline-md text-[20px]">{selectedUser.name || 'N/A'}</p>
                <p className="text-on-surface-variant font-data-mono text-body-sm mt-1">{selectedUser.email || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary-container/10 rounded-lg p-4">
                  <p className="text-label-caps text-on-surface-variant mb-1">SALDO CARTEIRA</p>
                  <p className="font-bold text-[20px] text-primary-container tabular-nums">{BRL(selectedUser.walletBalance)}</p>
                </div>
                <div className="bg-success/10 rounded-lg p-4">
                  <p className="text-label-caps text-on-surface-variant mb-1">TOTAL INVESTIDO</p>
                  <p className="font-bold text-[20px] text-success tabular-nums">{BRL(selectedUser.totalInvested)}</p>
                </div>
                <div className="bg-gold/10 rounded-lg p-4">
                  <p className="text-label-caps text-on-surface-variant mb-1">TOTAL LUCRO</p>
                  <p className="font-bold text-[20px] text-gold tabular-nums">{BRL(selectedUser.profit)}</p>
                </div>
                <div className="bg-surface-container rounded-lg p-4">
                  <p className="text-label-caps text-on-surface-variant mb-1">ROI</p>
                  <p className="font-bold text-[20px] text-on-surface tabular-nums">{roi(selectedUser)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-on-surface-variant">Selecione um usuário para ver os detalhes.</p>
          )}
        </div>
      </div>

      {/* Tabela completa */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
        <h2 className="font-headline-md text-[18px] px-6 pt-6 pb-4">Lista completa de usuários</h2>
        {allUsers.length === 0 ? (
          <p className="text-on-surface-variant text-center py-10">Nenhum usuário encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm min-w-[760px]">
              <thead>
                <tr className="bg-surface-container border-y border-outline-variant/30 text-label-caps text-on-surface-variant">
                  <th className="px-6 py-3 w-10">#</th>
                  <th className="px-6 py-3">NOME</th>
                  <th className="px-6 py-3">E-MAIL</th>
                  <th className="px-6 py-3 text-right">CARTEIRA</th>
                  <th className="px-6 py-3 text-right">DEPÓSITOS</th>
                  <th className="px-6 py-3 text-right">INVESTIDO</th>
                  <th className="px-6 py-3 text-right">LUCRO</th>
                  <th className="px-6 py-3 text-right">SAQUES</th>
                  <th className="px-6 py-3 text-center">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {allUsers.map((u, idx) => (
                  <tr
                    key={u._id || idx}
                    onClick={() => setSelectedUser(u)}
                    className={`cursor-pointer hover:bg-surface-container/50 transition-colors ${selectedUser?._id === u._id ? 'bg-primary-container/10' : ''}`}
                  >
                    <td className="px-6 py-3 text-on-surface-variant tabular-nums">{idx + 1}</td>
                    <td className="px-6 py-3 font-semibold">{u.name || 'N/A'}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{u.email || 'N/A'}</td>
                    <td className="px-6 py-3 text-right text-primary-container font-medium tabular-nums">{BRL(u.walletBalance)}</td>
                    <td className="px-6 py-3 text-right tabular-nums">{BRL(u.totalDeposited)}</td>
                    <td className="px-6 py-3 text-right text-success font-medium tabular-nums">{BRL(u.totalInvested)}</td>
                    <td className="px-6 py-3 text-right text-gold font-medium tabular-nums">{BRL(u.profit)}</td>
                    <td className="px-6 py-3 text-right text-danger font-medium tabular-nums">{BRL(u.totalWithdrawn)}</td>
                    <td className="px-6 py-3 text-center font-medium tabular-nums">{roi(u)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
