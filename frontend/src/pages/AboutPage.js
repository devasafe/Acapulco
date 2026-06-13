import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';

const steps = [
  ['how_to_reg', 'Crie sua conta', 'Cadastro grátis e em minutos. Você recebe um saldo virtual para começar.'],
  ['candlestick_chart', 'Estude o gráfico', 'Veja candlesticks com dados reais de mercado, atualizando ao vivo.'],
  ['swap_horiz', 'Opere sem risco', 'Compre e venda a preço real. Seu resultado é o do mercado — com dinheiro fictício.'],
  ['insights', 'Evolua', 'Acompanhe seu P&L, ranking e aprenda com ideias e análises educacionais.'],
];

const principles = [
  ['savings', 'Dinheiro 100% fictício', 'Você nunca deposita nem perde dinheiro real. O saldo é virtual, sempre.'],
  ['show_chart', 'Dados reais de mercado', 'Cotações e gráficos vêm de fontes reais em tempo real. Só o seu dinheiro é simulado.'],
  ['handshake', 'Sem manipulação', 'Ninguém controla o resultado das suas operações — é exatamente o que o mercado fizer.'],
];

export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <SiteNav active="Sobre" />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 mb-6 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-caps">SOBRE O PROJETO</span>
              <h1 className="text-headline-xl font-headline-xl text-on-surface mb-8 leading-tight">
                Um simulador para aprender a operar no mercado — sem arriscar dinheiro de verdade.
              </h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
                O Acapulco existe para que qualquer pessoa possa praticar trading num ambiente seguro:
                gráficos e preços <b>reais</b>, carteira <b>fictícia</b>. A ideia é simples — você
                desenvolve habilidade e entende o mercado antes de (talvez) arriscar de verdade.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -z-10 opacity-5">
            <div className="w-[800px] h-[800px] rounded-full bg-primary-container blur-3xl" />
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">Como funciona</h2>
              <div className="w-20 h-1 bg-primary-container mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map(([icon, title, desc], i) => (
                <div key={title} className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-container text-white flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] mb-2">{i + 1}. {title}</h3>
                  <p className="text-body-sm text-on-surface-variant">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* É / Não é */}
        <section className="py-24 border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-success/30">
              <h3 className="text-headline-md font-bold text-success mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span> O que o Acapulco É
              </h3>
              <ul className="space-y-3 text-body-md text-on-surface-variant">
                <li>✓ Um <b>simulador educacional</b> de trading (paper trading)</li>
                <li>✓ Um lugar para <b>praticar e testar estratégias</b> sem risco</li>
                <li>✓ Gráficos e cotações com <b>dados reais</b> de mercado</li>
                <li>✓ Totalmente <b>gratuito</b> e com dinheiro <b>fictício</b></li>
              </ul>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-danger/30">
              <h3 className="text-headline-md font-bold text-danger mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">cancel</span> O que o Acapulco NÃO é
              </h3>
              <ul className="space-y-3 text-body-md text-on-surface-variant">
                <li>✗ Não é uma <b>plataforma de investimento</b> nem corretora</li>
                <li>✗ Não recebe nem custodia <b>dinheiro real</b></li>
                <li>✗ Não oferece <b>lucro garantido</b> nem "sinais privilegiados"</li>
                <li>✗ Não <b>manipula</b> resultados — o mercado real decide</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Princípios */}
        <section className="py-24">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-12">Nossos princípios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {principles.map(([icon, title, desc]) => (
                <div key={title} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant">
                  <span className="material-symbols-outlined text-primary text-[32px] mb-4">{icon}</span>
                  <h4 className="font-headline-md text-[18px] mb-2">{title}</h4>
                  <p className="text-body-sm text-on-surface-variant">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary-container text-white">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <h2 className="text-headline-lg font-headline-lg mb-4">Aprenda praticando, sem risco.</h2>
            <p className="text-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Projeto educacional de código aberto. Crie sua conta e comece a treinar com dados reais e dinheiro fictício.
            </p>
            <button onClick={() => navigate('/register')} className="bg-success text-white px-10 py-4 rounded-xl font-headline-md text-[18px] hover:scale-105 transition-transform">
              Criar conta grátis
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
