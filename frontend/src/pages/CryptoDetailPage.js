import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';
import CryptoChart from '../components/CryptoChart';
import { getCryptoById } from '../services/cryptoService';
import { investInCrypto } from '../services/investmentService';
import { getWallet } from '../services/walletService';

const ASSET_BASE = 'http://localhost:5000';
const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function imageUrl(image) {
  if (!image || !image.trim()) return null;
  if (/^https?:\/\//.test(image)) return image;
  return `${ASSET_BASE}${image.startsWith('/') ? image : '/' + image}`;
}

function formatTimeUnit(days) {
  const d = Number(days);
  if (!d) return '';
  if (d === 30) return '30 dias';
  if (d === 90) return '3 meses';
  if (d === 180) return '6 meses';
  if (d === 365) return '1 ano';
  return `${d} dias`;
}

function Shell({ children }) {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <SiteNav active="Criptomoedas" />
      <main className="pt-20 flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export default function CryptoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crypto, setCrypto] = useState(null);
  const [investmentPlan, setInvestmentPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      getCryptoById(id),
      token ? getWallet(token) : Promise.resolve({ data: { wallet: 0 } }),
    ])
      .then(([cryptoRes, walletRes]) => {
        setCrypto(cryptoRes.data);
        setWallet(walletRes.data.wallet || 0);
        if (cryptoRes.data.plans && cryptoRes.data.plans.length > 0) {
          setInvestmentPlan(String(cryptoRes.data.plans[0].period));
        }
      })
      .catch(() => setError('Erro ao carregar dados'))
      .finally(() => setLoading(false));
  }, [id]);

  const priceNum = Number(crypto?.price) || 0;

  const handleInvest = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setError('Faça login para investir.'); return; }
    try {
      setInvesting(true);
      await investInCrypto(crypto._id, priceNum, Number(investmentPlan), token);
      alert('Investimento realizado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao realizar investimento.');
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <Shell>
        <div className="flex justify-center items-center py-40">
          <div className="w-10 h-10 rounded-full border-4 border-outline-variant border-t-primary-container animate-spin" />
        </div>
      </Shell>
    );
  }

  if (!crypto) {
    return (
      <Shell>
        <div className="max-w-2xl mx-auto px-margin-mobile py-20 text-center">
          <p className="text-on-surface-variant mb-4">Criptomoeda não encontrada.</p>
          <button onClick={() => navigate('/cryptos')} className="bg-primary-container text-white px-5 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90">Voltar ao catálogo</button>
        </div>
      </Shell>
    );
  }

  const selectedPlanObj = (crypto.plans || []).find((p) => String(p.period) === investmentPlan) || null;
  const selectedYield = selectedPlanObj ? Number(selectedPlanObj.yieldPercentage) || 0 : 0;
  const expectedProfit = (priceNum * selectedYield) / 100 || 0;
  const totalReturn = priceNum + expectedProfit;
  const heroImg = imageUrl(crypto.image);
  const insufficient = wallet < priceNum;

  return (
    <Shell>
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        {/* Voltar */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface mb-6 font-label-caps uppercase">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Voltar
        </button>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-6 text-body-sm">{error}</div>
        )}

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden border border-outline-variant/40 shadow-sm mb-6 h-[300px] flex items-center justify-center bg-primary-container">
          {heroImg && (
            <img src={heroImg} alt={crypto.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/90 to-primary-container/70" />
          <div className="relative z-10 text-center px-6">
            <h1 className="font-headline-xl text-headline-xl text-white drop-shadow-lg">{crypto.name}</h1>
            <p className="text-white/80 font-label-caps tracking-[3px] uppercase mt-1">{crypto.symbol}</p>
            <div className="inline-block mt-6 bg-white/10 border border-white/25 backdrop-blur-sm rounded-xl px-6 py-3">
              <p className="text-label-caps text-white/60 mb-0.5">VALOR DO INVESTIMENTO</p>
              <p className="font-headline-md text-headline-md text-white tabular-nums">{BRL(crypto.price)}</p>
            </div>
          </div>
        </div>

        {/* Descrição */}
        {crypto.description && (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 mb-6 shadow-sm">
            <p className="text-on-surface-variant leading-relaxed text-center">{crypto.description}</p>
          </div>
        )}

        {/* Gráfico */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 mb-6 shadow-sm">
          <CryptoChart symbol={crypto.symbol} />
        </div>

        {/* Planos */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-headline-md text-[16px] mb-4">Selecione o plano</h2>
          <div className="space-y-2">
            {(crypto.plans || []).map((plan, idx) => {
              const active = investmentPlan === String(plan.period);
              return (
                <button
                  key={idx}
                  onClick={() => setInvestmentPlan(String(plan.period))}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                    active ? 'border-primary-container bg-primary-container/10' : 'border-outline-variant/50 hover:border-primary-container/60'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 ${active ? 'border-primary-container' : 'border-outline-variant'}`}>
                    {active && <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />}
                  </span>
                  <span className="flex-1 font-medium">{formatTimeUnit(plan.period)}</span>
                  <span className="text-success font-semibold tabular-nums">+{plan.yieldPercentage}%</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-primary-container/5 border border-primary-container/20 rounded-xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Investimento</span>
              <span className="text-primary-container font-semibold tabular-nums">{BRL(priceNum)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Rendimento ({selectedYield}%)</span>
              <span className="text-success font-semibold tabular-nums">+{BRL(expectedProfit)}</span>
            </div>
            <div className="border-t border-primary-container/20 pt-3 flex justify-between items-center">
              <span className="font-semibold">Total em {formatTimeUnit(investmentPlan)}</span>
              <span className="font-headline-md text-[20px] text-primary-container font-bold tabular-nums">{BRL(totalReturn)}</span>
            </div>
          </div>
        </div>

        {/* Saldo insuficiente */}
        {insufficient && (
          <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 mb-4">
            <p className="text-danger font-semibold text-body-sm">
              Saldo insuficiente! Você tem {BRL(wallet)} e precisa de {BRL(priceNum)}.
            </p>
            <button onClick={() => navigate('/wallet')} className="text-danger underline text-body-sm mt-1 font-label-caps uppercase">Depositar agora</button>
          </div>
        )}

        {/* Botão investir */}
        <button
          onClick={handleInvest}
          disabled={investing || insufficient}
          className="w-full bg-success text-white py-3.5 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 transition-opacity"
        >
          {investing ? (
            <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
          )}
          {investing ? 'Processando...' : insufficient ? 'Saldo insuficiente' : 'Investir'}
        </button>
      </div>
    </Shell>
  );
}
