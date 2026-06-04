import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { getMyInvestments, getDashboardStats, withdrawInvestment } from '../services/apiService';
import { deposit, withdraw } from '../services/walletService';
import { getToken, getUser } from '../utils/auth';

const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const DONUT = ['#4B7BB0', '#1FB57E', '#6E97BE', '#C8A24B', '#9DB4CC', '#E5705C', '#3d6183'];

const NEGATIVE_TYPES = ['withdrawal', 'withdraw', 'investment', 'invest', 'purchase', 'saque'];
function txSign(type) {
  const t = (type || '').toLowerCase();
  return NEGATIVE_TYPES.some((n) => t.includes(n)) ? -1 : 1;
}
function txMeta(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('deposit')) return { label: 'Depósito', icon: 'south_west', positive: true };
  if (t.includes('withdraw') || t.includes('saque')) return { label: 'Saque', icon: 'north_east', positive: false };
  if (t.includes('invest')) return { label: 'Investimento', icon: 'trending_up', positive: false };
  if (t.includes('profit') || t.includes('yield') || t.includes('rend')) return { label: 'Rendimento', icon: 'payments', positive: true };
  if (t.includes('referr') || t.includes('bonus')) return { label: 'Bônus de indicação', icon: 'group', positive: true };
  return { label: type || 'Transação', icon: 'receipt_long', positive: true };
}

function buildEvolution(transactions) {
  const txs = [...(transactions || [])]
    .filter((t) => t.createdAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  let acc = 0;
  return txs.map((t, idx) => {
    acc += txSign(t.type) * Math.abs(Number(t.amount) || 0);
    return {
      idx,
      date: new Date(t.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      value: Math.round(acc),
    };
  });
}

// Tempo restante / progresso de um investimento
function remainingOf(inv) {
  if (!inv.createdAt || !inv.investmentPlan) return { left: 0, pct: 100, days: 0, hours: 0, minutes: 0, done: true };
  const start = new Date(inv.createdAt).getTime();
  const total = (Number(inv.investmentPlan) || 0) * 86400000;
  const left = Math.max(0, start + total - Date.now());
  const pct = total > 0 ? Math.min(100, Math.round(((total - left) / total) * 100)) : 100;
  return {
    left,
    pct,
    days: Math.floor(left / 86400000),
    hours: Math.floor((left % 86400000) / 3600000),
    minutes: Math.floor((left % 3600000) / 60000),
    done: left === 0,
  };
}

function buildDistribution(investments) {
  const map = {};
  (investments || [])
    .filter((inv) => (inv.status || 'active') === 'active')
    .forEach((inv) => {
      const name = inv.cryptoName || 'Ativo';
      map[name] = (map[name] || 0) + (Number(inv.amount) || 0);
    });
  return Object.entries(map).map(([name, value]) => ({ name, value })).filter((d) => d.value > 0);
}

export default function DashboardPage() {
  const token = getToken();
  const navigate = useNavigate();
  const user = getUser();

  const [stats, setStats] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletBusy, setWalletBusy] = useState(false);
  const [walletMsg, setWalletMsg] = useState(null); // { type:'ok'|'err', text }
  const [, setTick] = useState(0);
  const [visibleInvestments, setVisibleInvestments] = useState(4);

  const load = useCallback(async () => {
    try {
      const [statsRes, invRes] = await Promise.all([getDashboardStats(token), getMyInvestments(token)]);
      setStats(statsRes || {});
      setInvestments(Array.isArray(invRes) ? invRes : invRes?.data || []);
    } catch (e) {
      setStats({});
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (token) load(); }, [token, load]);

  // Atualiza os countdowns de tempos em tempos
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 30000); return () => clearInterval(id); }, []);

  async function redeem(id) {
    if (!window.confirm('Deseja resgatar este investimento? O valor investido + lucro irá para o seu saldo.')) return;
    try {
      await withdrawInvestment({ investmentId: id }, token);
      await load();
    } catch (e) {
      alert(e?.response?.data?.error || 'Não foi possível resgatar.');
    }
  }

  async function handleWallet(kind) {
    const amount = Number(kind === 'deposit' ? depositAmount : withdrawAmount);
    if (!amount || amount <= 0) return;
    setWalletBusy(true);
    setWalletMsg(null);
    try {
      if (kind === 'deposit') { await deposit(amount, token); setDepositAmount(''); }
      else { await withdraw(amount, token); setWithdrawAmount(''); }
      setWalletMsg({ type: 'ok', text: kind === 'deposit' ? 'Depósito realizado.' : 'Saque solicitado.' });
      await load();
    } catch (e) {
      setWalletMsg({ type: 'err', text: e?.response?.data?.message || 'Não foi possível concluir a operação.' });
    } finally {
      setWalletBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <SiteNav active="Dashboard" />
        <div className="flex justify-center items-center py-40">
          <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
        </div>
      </div>
    );
  }

  const s = stats || {};
  const wallet = Number(s.wallet) || 0;
  const invested = Number(s.totalInvested) || 0;
  const realized = Number(s.totalRealizedProfit) || 0;
  const expected = Number(s.totalExpectedProfit) || 0;
  const referral = Number(s.totalReferralBonus) || 0;
  const patrimonio = wallet + invested;

  const evolution = buildEvolution(s.recentTransactions);
  const distribution = buildDistribution(investments);

  const kpis = [
    ['Saldo disponível', BRL(wallet), 'account_balance_wallet'],
    ['Total investido', BRL(invested), 'savings'],
    ['Rendimento realizado', BRL(realized), 'trending_up', 'text-success'],
    ['Rendimento previsto', BRL(expected), 'schedule'],
  ];

  const inputCls = 'w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20';

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <SiteNav active="Dashboard" />

      <main className="pt-20 flex-1">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-8">
          {/* Cabeçalho + patrimônio */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-on-surface-variant text-body-sm">Olá{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</p>
              <p className="text-label-caps text-on-surface-variant mt-3">PATRIMÔNIO TOTAL</p>
              <p className="font-headline-xl text-headline-xl text-on-surface tabular-nums">{BRL(patrimonio)}</p>
              {realized > 0 && <p className="text-success text-body-sm mt-1">+{BRL(realized)} em rendimentos acumulados</p>}
            </div>
            <button onClick={() => navigate('/cryptos')} className="bg-success text-white px-6 py-3 rounded-lg font-headline-md text-body-md hover:opacity-90 transition-opacity flex items-center gap-2 self-start">
              <span className="material-symbols-outlined">add</span> Investir agora
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(([label, value, icon, valueCls]) => (
              <div key={label} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-label-caps text-on-surface-variant">{label.toUpperCase()}</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>
                </div>
                <p className={`font-headline-md text-headline-md tabular-nums ${valueCls || 'text-on-surface'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Evolução */}
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <h3 className="font-headline-md text-[18px] mb-6">Evolução do patrimônio</h3>
              {evolution.length > 1 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={evolution} margin={{ left: -10, right: 8, top: 4 }}>
                    <defs>
                      <linearGradient id="evo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4B7BB0" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#4B7BB0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="idx" type="number" domain={['dataMin', 'dataMax']} allowDecimals={false} tickFormatter={(i) => evolution[i]?.date || ''} tick={{ fill: '#93A4B3', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#93A4B3', fontSize: 12 }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [BRL(v), 'Saldo']} labelFormatter={(i) => evolution[i]?.date || ''} contentStyle={{ borderRadius: 8, border: '1px solid #94a3b855', background: 'var(--surface-container-lowest)', color: 'var(--on-surface)' }} />
                    <Area type="monotone" dataKey="value" stroke="#4B7BB0" strokeWidth={2} fill="url(#evo)" dot={{ r: 3, fill: '#4B7BB0', stroke: 'var(--surface-container-lowest)', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[260px] grid place-items-center text-on-surface-variant text-body-sm">Sem histórico suficiente para exibir o gráfico.</div>
              )}
            </div>

            {/* Distribuição */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <h3 className="font-headline-md text-[18px] mb-2">Distribuição da carteira</h3>
              {distribution.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2} stroke="none">
                        {distribution.map((d, i) => <Cell key={d.name} fill={DONUT[i % DONUT.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => BRL(v)} contentStyle={{ borderRadius: 8, border: '1px solid #94a3b855' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {distribution.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-body-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT[i % DONUT.length] }} />
                          {d.name}
                        </span>
                        <span className="tabular-nums text-on-surface-variant">{BRL(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[200px] grid place-items-center text-on-surface-variant text-body-sm text-center">Você ainda não tem investimentos.</div>
              )}
            </div>
          </div>

          {/* Depósito / Saque */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-md text-[18px] mb-1">Carteira</h3>
            <p className="text-on-surface-variant text-body-sm mb-6">Saldo disponível: <span className="font-semibold text-on-surface tabular-nums">{BRL(wallet)}</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">DEPOSITAR (PIX)</label>
                <div className="flex gap-2">
                  <input type="number" min={0} value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="R$ 0,00" className={inputCls} />
                  <button disabled={walletBusy} onClick={() => handleWallet('deposit')} className="bg-success text-white px-5 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50 whitespace-nowrap">Depositar</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">SACAR</label>
                <div className="flex gap-2">
                  <input type="number" min={0} value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="R$ 0,00" className={inputCls} />
                  <button disabled={walletBusy} onClick={() => handleWallet('withdraw')} className="bg-primary-container text-white px-5 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50 whitespace-nowrap">Sacar</button>
                </div>
              </div>
            </div>
            {walletMsg && (
              <p className={`mt-4 text-body-sm ${walletMsg.type === 'ok' ? 'text-success' : 'text-danger'}`}>{walletMsg.text}</p>
            )}
          </div>

          {/* Posições + atividade */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Posições — minhas criptos com resgate */}
            <div className="lg:col-span-2">
              <h3 className="font-headline-md text-[18px] mb-4">Minhas criptomoedas</h3>
              {investments.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 text-center shadow-sm">
                  <p className="text-on-surface-variant text-body-sm">Você ainda não comprou nenhuma criptomoeda. <button onClick={() => navigate('/cryptos')} className="text-primary font-semibold">Comprar agora</button>.</p>
                </div>
              ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investments.slice(0, visibleInvestments).map((inv) => {
                    const r = remainingOf(inv);
                    const isActive = (inv.status || 'active') === 'active';
                    const canRedeem = isActive && r.done;
                    const total = (Number(inv.amount) || 0) + (Number(inv.expectedProfit) || 0);
                    return (
                      <div key={inv._id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-headline-md text-[18px] text-on-surface">{inv.cryptoName || 'Ativo'}</p>
                            <p className="text-body-sm text-on-surface-variant">Plano de {inv.investmentPlan} dias · +{Number(inv.yieldPercentage) || 0}%</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isActive ? (canRedeem ? 'bg-success/15 text-success' : 'bg-secondary-container/40 text-on-secondary-container') : 'bg-surface-container text-on-surface-variant'}`}>
                            {!isActive ? 'Resgatado' : canRedeem ? 'Disponível' : 'Em andamento'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <div>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Investido</p>
                            <p className="font-semibold tabular-nums text-body-sm">{BRL(inv.amount)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Lucro</p>
                            <p className="font-semibold tabular-nums text-body-sm text-success">+{BRL(inv.expectedProfit)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Total</p>
                            <p className="font-semibold tabular-nums text-body-sm">{BRL(total)}</p>
                          </div>
                        </div>

                        {isActive && (
                          <div className="mb-4">
                            <div className="flex justify-between text-[11px] text-on-surface-variant mb-1">
                              <span>{r.done ? 'Período concluído' : `Faltam ${r.days}d ${r.hours}h ${r.minutes}m`}</span>
                              <span className="tabular-nums">{r.pct}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, backgroundColor: r.done ? 'var(--success)' : 'var(--surface-tint)' }} />
                            </div>
                          </div>
                        )}

                        <div className="mt-auto pt-1">
                          {!isActive ? (
                            <button disabled className="w-full py-2.5 rounded-lg bg-surface-container text-on-surface-variant font-label-caps uppercase cursor-default">Resgatado</button>
                          ) : canRedeem ? (
                            <button onClick={() => redeem(inv._id)} className="w-full py-2.5 rounded-lg bg-success text-white font-label-caps uppercase hover:opacity-90 active:scale-95 transition">Resgatar {BRL(total)}</button>
                          ) : (
                            <button disabled className="w-full py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-caps uppercase cursor-default">
                              Resgata em {r.days}d {r.hours}h
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {investments.length > visibleInvestments && (
                  <div className="mt-5 text-center">
                    <button onClick={() => setVisibleInvestments((n) => n + 4)} className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-caps uppercase hover:bg-surface-container transition-colors inline-flex items-center gap-2">
                      Ver mais ({investments.length - visibleInvestments}) <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </button>
                  </div>
                )}
                </>
              )}
            </div>

            {/* Atividade recente */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <h3 className="font-headline-md text-[18px] mb-4">Atividade recente</h3>
              {(s.recentTransactions || []).length === 0 ? (
                <p className="text-on-surface-variant text-body-sm">Nenhuma movimentação ainda.</p>
              ) : (
                <ul className="space-y-4">
                  {(s.recentTransactions || []).slice(0, 7).map((tx, i) => {
                    const m = txMeta(tx.type);
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-full grid place-items-center ${m.positive ? 'bg-success/15 text-success' : 'bg-surface-container text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{m.label}</p>
                          <p className="text-[11px] text-on-surface-variant">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('pt-BR') : ''}</p>
                        </div>
                        <span className={`tabular-nums text-body-sm font-medium ${m.positive ? 'text-success' : 'text-on-surface'}`}>
                          {m.positive ? '+' : '−'}{BRL(Math.abs(Number(tx.amount) || 0))}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
