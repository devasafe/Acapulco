import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';

const steps = [
  ['Abra sua conta', 'Processo 100% digital e validado em minutos.'],
  ['Transfira via Pix', 'Depósitos instantâneos e disponíveis 24 horas por dia.'],
  ['Escolha seu ativo', 'Acesse BTC, ETH e cestas de ativos diversificadas.'],
  ['Acompanhe', 'Relatórios de performance e rendimentos em tempo real.'],
];

const products = [
  ['account_balance_wallet', 'Compra e Custódia', 'Infraestrutura de nível institucional para comprar e armazenar seus ativos com segurança máxima.', 'Saiba mais', false],
  ['trending_up', 'Staking / Rendimento', 'Coloque suas criptomoedas para trabalhar e receba rendimentos passivos diretamente em sua carteira.', 'Ver taxas', true],
  ['layers', 'Carteiras Geridas', 'Estratégias automatizadas e portfólios balanceados por especialistas do mercado financeiro.', 'Explorar', false],
];

const testimonials = [
  ['"A facilidade do Pix aliada à interface profissional me deu a confiança que faltava para entrar no mercado cripto."', 'Ricardo S.', 'Investidor Conservador'],
  ['"Os relatórios de auditoria e a prova de reservas são diferenciais que não encontro em outras corretoras nacionais."', 'Mariana L.', 'Trader Profissional'],
  ['"Excelente plataforma para gerenciar o caixa da minha empresa com ativos digitais de alta liquidez."', 'André M.', 'CEO, Tech Ventures'],
];

const faqs = [
  ['A Acapulco Financial é regulada?', 'Operamos de acordo com as normas brasileiras de criptoativos e possuímos estrutura institucional para custódia e intermediação.'],
  ['Como funciona o rendimento em Staking?', 'Seus ativos são alocados em protocolos de validação de rede (Proof of Stake). O rendimento é pago pela própria rede e repassado para sua conta, descontando nossa taxa operacional mínima.'],
  ['Qual o valor mínimo para começar?', 'Você pode começar a investir com apenas R$ 50,00 através de transferências via Pix instantâneas.'],
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
                INSTITUIÇÃO FINANCEIRA REGULADA
              </span>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-6 leading-tight">
                Invista em criptomoedas com a solidez de uma instituição
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-10 max-w-xl">
                Segurança bancária, governança corporativa e transparência absoluta para o seu patrimônio digital. O futuro do investimento institucional começa aqui.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/register')} className="bg-success text-white px-8 py-4 rounded-lg font-headline-md text-[18px] hover:opacity-90 transition-all flex items-center gap-2">
                  Abrir conta <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className="border-2 border-primary-container text-on-surface px-8 py-4 rounded-lg font-headline-md text-[18px] hover:bg-surface-container transition-all">
                  Simular rendimento
                </button>
              </div>
            </div>

            {/* Mockup do painel */}
            <div className="lg:col-span-6 relative">
              <div className="glass-panel p-6 rounded-xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-[16px] text-on-surface">Evolução BTC</h4>
                      <p className="text-label-caps text-on-surface-variant">Últimos 30 dias</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-headline-md text-[18px] tabular-nums text-on-surface">R$ 342.150,00</div>
                    <div className="text-label-caps text-success">+4.2% (Hoje)</div>
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
                  {[['BTC', 'R$ 342.1k', '+2.1%', true], ['ETH', 'R$ 18.4k', '+1.5%', true], ['SOL', 'R$ 942,00', '-0.4%', false]].map(([t, p, v, up]) => (
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

        {/* Faixa de números */}
        <section className="bg-primary-container py-16">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[['R$ 2.4 Bi', 'EM CUSTÓDIA'], ['+150 mil', 'INVESTIDORES'], ['5 anos', 'DE OPERAÇÃO'], ['PwC', 'AUDITORIA ANUAL']].map(([n, l]) => (
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
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Sua jornada em quatro passos</h2>
            <p className="text-body-md text-on-surface-variant">Simples como um banco digital, potente como uma corretora global.</p>
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

        {/* Produtos */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-12">Nossas Soluções</h2>
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

        {/* Segurança */}
        <section className="py-24 bg-surface-container-lowest overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Segurança de padrão bancário</h2>
              <p className="text-body-md text-on-surface-variant mb-10">
                Não somos apenas uma plataforma de cripto. Somos uma instituição focada em compliance, seguindo rigorosamente as diretrizes da LGPD e operando com custódia segregada — seus ativos nunca se misturam aos da empresa.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[['verified_user', 'Custódia Segregada'], ['enhanced_encryption', 'SSL 256-bit'], ['policy', 'Prova de Reservas']].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center p-4 bg-surface-container-low rounded-lg text-center">
                    <span className="material-symbols-outlined text-primary mb-2">{icon}</span>
                    <span className="text-label-caps text-on-surface">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img alt="Segurança digital" className="rounded-2xl shadow-2xl w-full h-[400px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6f1_lPPJlaeoiIs6_jNu7fSWUqJS0aWjq4JjIIzasvSDEO4Q-6sk1mUWxS9ncJZCP_-Y1O6Qnrbef3jblbK8WWH4Bq3v-XRIbHd1V5sBNDtDkwHBVVJxs8Ag0SE9K1hah1v6b2UMTat4pcVd3l0YGKpCT_BRAzRrm_Em370MOc_qzy-Ypca-c-KYVVAI6hOf1sKTfgUok8fpbiUgPoCVXAPOr_DrpXLK-luqQztc4QXrs-rg80rJ6Wm376iTDtyAPkJX3rDnNgOg" />
            </div>
          </div>
        </section>

        {/* Prova social + parceiros */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Confiança de quem investe</h2>
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
              {[['payments', 'PIX'], ['local_fire_department', 'FIREBLOCKS'], ['link', 'CHAINLINK'], ['shield', 'AUDIT-PWC']].map(([icon, name]) => (
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
                <h2 className="font-headline-xl text-headline-xl text-white mb-6">Pronto para elevar o nível dos seus investimentos?</h2>
                <p className="text-body-lg text-white/80 mb-10 max-w-2xl mx-auto">
                  Abra sua conta hoje e junte-se a mais de 150 mil investidores que escolheram a solidez institucional da Acapulco Financial.
                </p>
                <button onClick={() => navigate('/register')} className="bg-success text-white px-12 py-5 rounded-xl font-headline-md text-[20px] hover:scale-105 transition-transform">
                  Começar agora gratuitamente
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
