import React, { useEffect, useState } from 'react';
import ImovelList from '../components/ImovelList';
import WalletActions from '../components/WalletActions';
import WalletChart from '../components/WalletChart';
import ReferralList from '../components/ReferralList';
import TransactionList from '../components/TransactionList';
import { getImoveis, invest } from '../services/imovelService';
import { getWallet } from '../services/walletService';
import { getTransactions } from '../services/transactionService';
import { getReferrals } from '../services/referralService';

export default function DashboardPage({ user }) {
  user = user || { id: 1 }; // valor padrão para evitar erro

  const [imoveis, setImoveis] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    getImoveis().then(res => setImoveis(res.data));
    getTransactions(user.id).then(res => setTransactions(res.data.transactions));
    const token = localStorage.getItem('token');
    if (token) {
      getWallet(token)
        .then(res => setWallet(res.data.wallet))
        .catch(() => setWallet(0));
      getReferrals(token)
        .then(res => {
          if (Array.isArray(res.data)) {
            setReferrals(res.data);
          } else if (Array.isArray(res.data.referrals)) {
            setReferrals(res.data.referrals);
          } else {
            setReferrals([]);
          }
        })
        .catch(() => setReferrals([]));
    } else {
      setWallet(0);
      setReferrals([]);
    }
  }, [user.id]);

  const updateWalletAndTx = () => {
    getWallet(user.id).then(res => setWallet(res.data.wallet));
    getTransactions(user.id).then(res => setTransactions(res.data.transactions));
  };

  const handleInvest = async (imovel) => {
    const amount = window.prompt(`Quanto deseja investir em ${imovel.name}?`, imovel.value);
    if (amount) {
      try {
        await invest({ userId: user.id, imovelId: imovel._id, amount: Number(amount) });
        alert('Investimento realizado!');
        updateWalletAndTx();
      } catch (err) {
        alert(err.response?.data?.message || 'Erro ao investir');
      }
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <ImovelList imoveis={imoveis} onInvest={handleInvest} />
      <WalletActions userId={user?.id || 1} onUpdate={updateWalletAndTx} />
      <WalletChart transactions={transactions} />
      <ReferralList referrals={referrals} />
      <TransactionList transactions={transactions} />
    </div>
  );
}
