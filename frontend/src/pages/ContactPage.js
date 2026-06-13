import React, { useState } from 'react';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';

const channels = [
  ['mail', 'E-MAIL', 'suporte@acapulco.com.br'],
  ['chat', 'WHATSAPP BUSINESS', '+55 11 99999-0000'],
  ['call', 'TELEFONE CENTRAL', '0800 777 5555'],
];

const operational = [
  ['schedule', 'HORÁRIO', 'Segunda a Sexta, 09h às 18h'],
  ['speed', 'TEMPO DE RESPOSTA', 'Máximo de 4 horas para tickets'],
  ['location_on', 'SEDE ADMINISTRATIVA', 'Av. Faria Lima, 3500 - São Paulo/SP'],
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputCls = 'w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all';

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    e.target.reset();
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen overflow-x-hidden">
      <SiteNav active="Contato" />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 md:py-32 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <span className="font-label-caps text-label-caps text-on-primary-container mb-4 block">CONTATO</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface max-w-3xl mx-auto mb-6">
              Estamos aqui para ajudar você a investir com tranquilidade
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Nossa equipe de especialistas está pronta para oferecer suporte institucional e esclarecer qualquer dúvida sobre sua jornada financeira.
            </p>
          </div>
        </section>

        {/* Form + canais */}
        <section className="py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-xl border border-outline-variant shadow-sm">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">Envie uma mensagem</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">NOME COMPLETO</label>
                    <input className={inputCls} placeholder="Como deseja ser chamado?" required type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">E-MAIL</label>
                    <input className={inputCls} placeholder="seu@email.com" required type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">ASSUNTO</label>
                  <select className={inputCls}>
                    <option>Suporte Técnico</option>
                    <option>Dúvidas sobre Investimentos</option>
                    <option>Compliance e Segurança</option>
                    <option>Outros Assuntos</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">MENSAGEM</label>
                  <textarea className={`${inputCls} resize-none`} placeholder="Descreva sua solicitação em detalhes..." required rows={5} />
                </div>
                <button type="submit" className={`w-full md:w-auto px-10 py-4 rounded-lg font-headline-md text-body-md text-white transition-all active:scale-95 shadow-md ${sent ? 'bg-success' : 'bg-primary-container hover:opacity-90'}`}>
                  {sent ? 'Enviado com sucesso' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>

            {/* Canais */}
            <div className="lg:col-span-5 space-y-10">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mb-6">Canais de Atendimento</h3>
                <div className="space-y-4">
                  {channels.map(([icon, label, value]) => (
                    <div key={label} className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container transition-colors">
                      <div className="bg-secondary-container/40 p-3 rounded-full text-on-secondary-container">
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant">{label}</p>
                        <p className="font-body-lg font-medium text-on-surface">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-outline-variant" />

              <div className="bg-primary-container text-white p-8 rounded-xl">
                <h4 className="font-headline-md text-headline-md mb-6">Detalhes Operacionais</h4>
                <ul className="space-y-6">
                  {operational.map(([icon, label, value]) => (
                    <li key={label} className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-secondary-fixed-dim">{icon}</span>
                      <div>
                        <p className="font-label-caps text-label-caps text-white/70">{label}</p>
                        <p className="font-body-md">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mapa */}
        <section className="h-[400px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
          <img alt="Localização Acapulco Financial" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6awH52vPeO03DrYeyq_az4AB4ylwOPLRLtckhOXrJbs6HgfPHCXWw1DhZbQM5CayUhKyzA1IJg-zgHEeQ8LJDC5LND_ZUYecTo5Udnvbs182Ya_a6gYbZun_5pl1AtjkwaiZ0osgH3MOh5rBvKPmYtZbRDTS1oAdxkflO7vkp_dw8xtf-DgIAJLqhjB_JxWQ1hKvsjEqVqUJ21y0TGj8oj-N45LFNff1BkLvIQUjCu4WJgb87c4UVGw4-SobiiCG6XUkm3xts0b8" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-xl flex items-center gap-4 border border-outline-variant">
              <div className="bg-primary-container w-10 h-10 rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined">apartment</span>
              </div>
              <div>
                <p className="font-headline-md text-body-md text-on-surface">Matriz Acapulco</p>
                <p className="text-body-sm text-on-surface-variant">Vila Olímpia, SP</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
