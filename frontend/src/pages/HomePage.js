import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';

const steps = [
  ['Crie sua conta grátis', 'Cadastro 100% digital, em minutos. Sem cartão, sem depósito.'],
  ['Ganhe saldo fictício', 'Você começa com dinheiro virtual para praticar sem nenhum risco.'],
  ['Opere com dados reais', 'Compre e venda BTC, ETH e mais, com preços reais de mercado ao vivo.'],
  ['Acompanhe sua evolução', 'Veja seu P&L, posições e sua colocação no ranking em tempo real.'],
];

const products = [
  ['candlestick_chart', 'Gráficos reais', 'Candlesticks com dados de mercado ao vivo, como na bolsa — para você treinar leitura de gráfico.', 'Ver mercados', false],
  ['savings', 'Carteira fictícia', 'Pratique compra e venda com dinheiro virtual. Seu lucro/prejuízo segue o mercado real, sem arriscar um centavo.', 'Como funciona', true],
  ['emoji_events', 'Ranking & Ideias', 'Compare seu desempenho no ranking e aprenda com ideias e análises educacionais.', 'Explorar', false],
];

const testimonials = [
  ['"Finalmente entendi como ler um gráfico praticando sem medo de perder dinheiro."', 'Ricardo S.', 'Estudante de finanças'],
  ['"Uso pra testar estratégias antes de arriscar de verdade. Os dados reais ajudam muito."', 'Mariana L.', 'Iniciante em trading'],
  ['"Ótimo para ensinar meus alunos sobre o mercado sem expô-los a risco financeiro."', 'André M.', 'Professor'],
];

const faqs = [
  ['É dinheiro de verdade?', 'Não. O Acapulco é um simulador educacional — todo o saldo é fictício. Você nunca deposita nem perde dinheiro real.'],
  ['Os preços são reais?', 'Sim. Os gráficos e cotações vêm de dados reais de mercado em tempo real. Só o seu dinheiro é fictício.'],
  ['Vocês dão sinais ou garantem lucro?', 'Não. Não existe lucro garantido nem "informação privilegiada", e ninguém controla o resultado. O que acontece nas suas operações é exatamente o que o mercado real fizer. Publicamos apenas ideias educacionais, claramente marcadas como opinião.'],
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen overflow-x-hidden">
      <SiteNav active="Início" />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-40">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-label-caps font-semibold mb-6">
                SIMULADOR EDUCACIONAL DE TRADING
              </span>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-6 leading-tight">
                Aprenda a operar no mercado — sem arriscar dinheiro de verdade
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-10 max-w-xl">
                Pratique compra e venda de criptoativos com gráficos e preços reais, usando uma carteira
                100% fictícia. Erre, aprenda e evolua sem nenhum risco financeiro.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/register')} className="bg-success text-white px-8 py-4 rounded-lg font-headline-md text-[18px] hover:opacity-90 transition-all flex items-center gap-2">
                  Criar conta grátis <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button onClick={() => navigate('/about')} className="border-2 border-primary-container text-on-surface px-8 py-4 rounded-lg font-headline-md text-[18px] hover:bg-surface-container transition-all">
                  Como funciona
                </button>
              </div>
            </div>

            {/* Mockup do painel (ilustrativo) */}
            <div className="lg:col-span-6 relative">
              <div className="glass-panel p-6 rounded-xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-[16px] text-on-surface">BTC/USDT (exemplo)</h4>
                      <p className="text-label-caps text-on-surface-variant">Carteira fictícia · dados reais</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-headline-md text-[18px] tabular-nums text-on-surface">$ 100.000,00</div>
                    <div className="text-label-caps text-success">saldo fictício</div>
                  </div>
                </div>

                <div className="h-48 w-full mb-6">
                  <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--surface-tint)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--surface-tint)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 80 Q 50 70, 100 85 T 200 40 T 300 60 T 400 10" fill="none" stroke="var(--surface-tint)" strokeWidth="3" />
                    <path d="M0 80 Q 50 70, 100 85 T 200 40 T 300 60 T 400 10 V 100 H 0 Z" fill="url(#grad1)" />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/30 pt-6">
                  {[['BTC', '$61.8k', '+2.1%', true], ['ETH', '$2.4k', '+1.5%', true], ['SOL', '$142', '-0.4%', false]].map(([t, p, v, up]) => (
                    <div key={t} className="text-center">
                      <p className="text-label-caps text-on-surface-variant mb-1">{t}</p>
                      <p className="text-body-sm font-bold tabular-nums">{p}</p>
                      <span className={`text-[10px] ${up ? 'text-success' : 'text-danger'}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -z-10 -bottom-12 -right-12 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* Faixa de números (honesta) */}
        <section className="bg-primary-container py-16">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[['100%', 'DINHEIRO FICTÍCIO'], ['Tempo real', 'DADOS DE MERCADO'], ['R$ 0', 'DE RISCO'], ['Grátis', 'PARA SEMPRE']].map(([n, l]) => (
                <div key={l}>
                  <div className="text-headline-lg font-bold text-white tabular-nums mb-1">{n}</div>
                  <div className="text-label-caps text-white/70">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Comece a praticar em quatro passos</h2>
            <p className="text-body-md text-on-surface-variant">Simples de usar, com a experiência real de uma mesa de operações.</p>
          </div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map(([t, d], i) => (
              <div key={t} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface font-bold text-headline-md mb-6">{i + 1}</div>
                <h3 className="font-headline-md text-[18px] mb-2">{t}</h3>
                <p className="text-body-sm text-on-surface-variant">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recursos */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-12">O que você encontra aqui</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {products.map(([icon, title, desc, cta, highlight]) => (
                <div key={title} className={`bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 hover:shadow-lg transition-all group ${highlight ? 'border-t-2 border-t-primary-container' : ''}`}>
                  <span className="material-symbols-outlined text-primary text-[32px] mb-6">{icon}</span>
                  <h3 className="font-headline-md text-[20px] mb-4">{title}</h3>
                  <p className="text-body-sm text-on-surface-variant mb-6 leading-relaxed">{desc}</p>
                  <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                    {cta} <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por que um simulador */}
        <section className="py-24 bg-surface-container-lowest overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Por que praticar num simulador?</h2>
              <p className="text-body-md text-on-surface-variant mb-10">
                Operar de verdade envolve risco real de perder dinheiro. Aqui você desenvolve habilidade,
                testa estratégias e entende o mercado num ambiente seguro — com dados reais, mas sem expor
                seu patrimônio. Quando se sentir pronto, a decisão é sua.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[['school', 'Aprenda sem risco'], ['candlestick_chart', 'Dados reais'], ['psychology', 'Teste estratégias']].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center p-4 bg-surface-container-low rounded-lg text-center">
                    <span className="material-symbols-outlined text-primary mb-2">{icon}</span>
                    <span className="text-label-caps text-on-surface">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img alt="Estudo de gráficos de mercado" className="rounded-2xl shadow-2xl w-full h-[400px] object-cover" src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80" />
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Quem está aprendendo com a gente</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {testimonials.map(([quote, name, role]) => (
                <div key={name} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/20">
                  <div className="flex items-center gap-1 mb-4" style={{ color: '#FFB300' }}>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-body-md text-on-surface italic mb-6">{quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container" />
                    <div>
                      <p className="text-body-sm font-bold">{name}</p>
                      <p className="text-label-caps text-on-surface-variant">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              {[['candlestick_chart', 'DADOS REAIS'], ['school', 'EDUCACIONAL'], ['lock', 'SEM DEPÓSITO'], ['savings', '100% FICTÍCIO']].map(([icon, name]) => (
                <div key={name} className="flex items-center gap-2 font-bold text-headline-md text-on-surface-variant">
                  <span className="material-symbols-outlined">{icon}</span> {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-12">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {faqs.map(([q, a]) => (
                <details key={q} className="group border-b border-outline-variant/30 pb-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-headline-md text-[18px] py-2 text-on-surface">
                    {q}
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="text-body-md text-on-surface-variant pt-4">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-24 bg-background">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="bg-primary-container rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="font-headline-xl text-headline-xl text-white mb-6">Pronto para começar a praticar?</h2>
                <p className="text-body-lg text-white/80 mb-10 max-w-2xl mx-auto">
                  Crie sua conta gratuita e comece a operar com dados reais e dinheiro fictício. Sem risco, sem pegadinha.
                </p>
                <button onClick={() => navigate('/register')} className="bg-success text-white px-12 py-5 rounded-xl font-headline-md text-[20px] hover:scale-105 transition-transform">
                  Criar conta grátis
                </button>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
