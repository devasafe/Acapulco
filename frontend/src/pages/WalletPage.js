import React, { useEffect, useState, useCallback } from 'react';
import SiteShell from '../components/SiteShell';
import { getWallet, deposit, withdraw, getWalletTransactions } from '../services/walletService';

const fmtUsd = (n) =>
  n == null ? '—' : `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const TX = {
  deposit: { label: 'Depósito', sign: 1 },
  withdrawal: { label: 'Saque', sign: -1 },
  referral_bonus: { label: 'Bônus de indicação', sign: 1 },
};

export default function WalletPage() {
  const [balance, setBalance] = useState(null);
  const [txs, setTxs] = useState([]);
  const [depositAmt, setDepositAmt] = useState('');
  const [withdrawAmt, setWithdrawAmt] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    try {
      const [w, t] = await Promise.all([getWallet(), getWalletTransactions()]);
      setBalance(w.data.wallet);
      setTxs(t.data);
    } catch (_) {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const run = async (fn, okText) => {
    try {
      setMsg(null);
      setBusy(true);
      await fn();
      setMsg({ type: 'success', text: okText });
      await load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Erro na operação.' });
    } finally {
      setBusy(false);
    }
  };

  const doDeposit = () => {
    const v = Number(depositAmt);
    if (!(v > 0)) { setMsg({ type: 'error', text: 'Informe um valor válido.' }); return; }
    run(() => deposit(v), `Depósito de ${fmtUsd(v)} realizado.`).then(() => setDepositAmt(''));
  };
  const doWithdraw = () => {
    const v = Number(withdrawAmt);
    if (!(v > 0)) { setMsg({ type: 'error', text: 'Informe um valor válido.' }); return; }
    run(() => withdraw(v), `Saque de ${fmtUsd(v)} realizado.`).then(() => setWithdrawAmt(''));
  };

  const card = 'bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-5';
  const inputCls = 'flex-1 w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-on-surface tabular-nums focus:outline-none focus:border-primary-container';

  return (
    <SiteShell active="Carteira">
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <h1 className="font-headline-xl text-headline-md text-on-surface mb-1">Carteira</h1>
        <p className="text-on-surface-variant text-body-sm mb-6">Deposite ou saque o saldo (fictício) usado para operar.</p>

        {msg && (
          <div className={`mb-5 rounded-lg px-4 py-3 text-body-sm border ${
            msg.type === 'error' ? 'bg-danger/10 border-danger/40 text-danger' : 'bg-success/10 border-success/40 text-success'
          }`}>
            {msg.text}
          </div>
        )}

        {/* Saldo */}
        <section className={`${card} mb-6`}>
          <p className="text-on-surface-variant text-body-sm">Saldo disponível</p>
          <p className="font-headline-md text-headline-xl text-on-surface tabular-nums">{fmtUsd(balance)}</p>
        </section>

        {/* Depositar / Sacar */}
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <section className={card}>
            <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Depositar</h2>
            <div className="flex gap-2">
              <input
                type="number" min="0" step="0.01" value={depositAmt} onChange={(e) => setDepositAmt(e.target.value)}
                placeholder="0.00" className={inputCls}
              />
              <button onClick={doDeposit} disabled={busy}
                className="bg-success text-white px-4 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-40 transition-opacity">
                Depositar
              </button>
            </div>
          </section>

          <section className={card}>
            <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Sacar</h2>
            <div className="flex gap-2">
              <input
                type="number" min="0" step="0.01" value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)}
                placeholder="0.00" className={inputCls}
              />
              <button onClick={doWithdraw} disabled={busy}
                className="bg-danger text-white px-4 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-40 transition-opacity">
                Sacar
              </button>
            </div>
          </section>
        </div>

        {/* Extrato */}
        <section className={card}>
          <h2 className="font-headline-md text-[18px] text-on-surface mb-3">Extrato</h2>
          {txs.length === 0 ? (
            <p className="text-on-surface-variant text-body-sm">Nenhuma transação ainda.</p>
          ) : (
            <div className="space-y-2">
              {txs.map((t) => {
                const meta = TX[t.type] || { label: t.type, sign: 1 };
                const positive = meta.sign > 0;
                return (
                  <div key={t._id} className="flex items-center justify-between gap-3 bg-background rounded-lg px-3 py-2">
                    <div className="min-w-0">
                      <span className={`text-[11px] uppercase px-2 py-0.5 rounded font-label-caps ${positive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                        {meta.label}
                      </span>
                      {t.description && <p className="text-on-surface-variant text-body-sm mt-1 truncate">{t.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-semibold tabular-nums ${positive ? 'text-success' : 'text-danger'}`}>
                        {positive ? '+' : '−'}{fmtUsd(Math.abs(t.amount))}
                      </p>
                      <p className="text-[11px] text-on-surface-variant/70 font-data-mono">{fmtDate(t.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </SiteShell>
  );
}
