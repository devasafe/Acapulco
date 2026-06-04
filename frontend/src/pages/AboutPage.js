import React from 'react';
import SiteNav from '../components/marketing/SiteNav';
import SiteFooter from '../components/marketing/SiteFooter';

const timeline = [
  ['2021', 'foundation', 'Fundação e Visão', 'Idealização da Acapulco Financial por especialistas em Asset Management e Engenharia de Software.'],
  ['2022', 'gavel', 'Estruturação Regulatória', 'Início do processo de licenciamento e implementação da segregação de ativos como pilar central.'],
  ['2023', 'verified_user', 'Auditoria de Reservas', 'Primeiro relatório de Proof of Reserves auditado por firma internacional independente.'],
  ['2024', 'leaderboard', 'Liderança de Mercado', 'Consolidação como principal gateway de ativos digitais para investidores de alto patrimônio.'],
];

const governance = [
  ['shield_person', 'Proteção LGPD', 'Protocolos rigorosos de criptografia e tratamento de dados sensíveis em total conformidade com a Lei Geral de Proteção de Dados.'],
  ['account_balance', 'Segregação Patrimonial', 'Garantia de que os ativos dos clientes nunca se confundem com o capital da corretora, protegendo seus investimentos contra qualquer passivo operacional.'],
  ['receipt_long', 'Conformidade Regulatória', 'Atuamos sob as normas vigentes, mantendo transparência e colaborando para a integridade do ecossistema.'],
];

const team = [
  ['Ricardo Valente', 'CEO & FOUNDER', 'Ex-Diretor de Risco em banco global, com mais de 20 anos de experiência em derivativos e mercados de capitais.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgzmOzTRI3Zs_cPz150rmfSg9iqrtVQcHvjVg7aaJcaDLty0LUCgK0NRJ8MgmV_2OWPGgO66wn3eQ0RhBJEgRTt-SWHKWvV5f46m3fy_hEGm048LQLcd_lRxyeq2nYCuTKnK8By3kv-wF2Ncu2TDCTFkSqgvBZYFE0voG1ZwDIxJ4yQ7dS0T2H9WSPJCuG4iGW-qJWpBNStLe1U8IT7XaRZJzmSli7Y91atwvWAhi5uycGcfHuq0qSSiubdblPwNI8bLOmWWGaDgE'],
  ['Marina Soares', 'CTO', 'Especialista em Distributed Ledger Technology (DLT) e sistemas críticos de alta disponibilidade bancária.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy_L06TaIFIPiyv9EA5ufQDtugokX4H1Q3qLetnu9RAQe4v3v_VUnsAvKcqLAivHlGxQ7q6mDHuPVAynyOTcRRZtbfoCelXlXlNWz1LoiiGoBpspS0Jf53jH-BxSMF3aioiQozXpEuG9Q_AckZrEbnik9I3jI26hQdeUPRFUNSMo3xB4GvKA-b8W3wFpOKGemJcNzrdjEwwyHqIv6MpNhQ6bLsj1kuDrWzwG5hg_7bipM4nu5rVdmuNaI6UN9jJCDojxQsLN2NUII'],
  ['André Luz', 'CHIEF COMPLIANCE OFFICER', 'Advogado especialista em regulação financeira e prevenção à lavagem de dinheiro (AML/KYC).', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbuNfA81mPnzB4D2FzCmUFB2rUhBS01bAQtRlC4TWCthmwiR2HKenhDmY_tK0aqAC65pWvZ04AY-VNAf6q9o9kRuiXwNyt16CFmnGXQgTXIJqaexVraU5mmHOD2soGHxR75yA9jzZpl_jOO7QHruAHTp2DQO93nnSthLg2fgKTJEc0M73WWNY29DU00yoxASk50_g_XVzbANi3Jdz2vWzlLtfEBt0-fHpXEY5gtscsPIKudk0SvLMtMfH7utj-_dg53zsb1ah6SsM'],
];

export default function AboutPage() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <SiteNav active="Sobre" />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden border-b border-outline-variant/20">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 mb-6 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-caps">INSTITUCIONAL</span>
              <h1 className="text-headline-xl font-headline-xl text-on-surface mb-8 leading-tight">
                Nossa missão: democratizar o acesso a ativos digitais com segurança institucional.
              </h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
                Fundada por veteranos do mercado financeiro tradicional, a Acapulco Financial nasceu para preencher a lacuna entre a agilidade da economia cripto e o rigor dos protocolos bancários globais.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -z-10 opacity-5">
            <div className="w-[800px] h-[800px] rounded-full bg-primary-container blur-3xl" />
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-4">Nossa Jornada</h2>
              <div className="w-20 h-1 bg-primary-container mx-auto" />
            </div>
            <div className="relative md:timeline-line space-y-12">
              {timeline.map(([year, icon, title, desc], i) => {
                const left = i % 2 === 0;
                return (
                  <div key={year} className="relative flex items-center md:justify-center w-full">
                    {left ? (
                      <div className="hidden md:block w-5/12 pr-12 text-right">
                        <span className="text-headline-md font-headline-md text-on-surface">{year}</span>
                      </div>
                    ) : (
                      <div className="w-full md:w-5/12 pr-8 md:pr-12 text-left md:text-right order-2 md:order-1">
                        <h3 className="text-body-lg font-semibold text-on-surface mb-1 md:hidden">{year}</h3>
                        <h3 className="text-body-lg font-semibold text-on-surface mb-2">{title}</h3>
                        <p className="text-body-sm text-on-surface-variant">{desc}</p>
                      </div>
                    )}
                    <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary-container text-white border-4 border-surface shadow-sm order-1 md:order-2">
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                    {left ? (
                      <div className="w-full md:w-5/12 pl-8 md:pl-12 order-2 md:order-3">
                        <h3 className="text-body-lg font-semibold text-on-surface mb-1 md:hidden">{year}</h3>
                        <h3 className="text-body-lg font-semibold text-on-surface mb-2">{title}</h3>
                        <p className="text-body-sm text-on-surface-variant">{desc}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block w-5/12 pl-12 order-3">
                        <span className="text-headline-md font-headline-md text-on-surface">{year}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Governança */}
        <section className="py-24 border-y border-outline-variant/20">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-6">Governança e Compliance</h2>
              <div className="space-y-6">
                {governance.map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1">{title}</h4>
                      <p className="text-body-sm text-on-surface-variant">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-container p-12 rounded-xl relative overflow-hidden group min-h-[360px]">
              <img alt="Infraestrutura segura" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHVJm51OYaiUNTj9QPzOMkoxGdWThC7MXd6xhxw9xaov1KIPcYI-mo698N_u2QW_jehENhyQK3dC3l2meznnvOyaq32i965CBo9J87T2daFtXlNWCbjq_KmG0SFo5QxGO00ckplIJ0Y8eMWsqsVV-ughGMx8q9gp4kPdAI2mDKEtyTgMZvlMqQx2ZTFa8-CD80A28gbeqdgEzOzWLPFi-_06KRN6CvL27RXd41jZeOJxltM8jhte7I8lPiCdrXbKnyiQY_CmWh02E" />
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                <div className="bg-surface-container-lowest/90 backdrop-blur shadow-xl p-8 rounded border border-outline-variant/30">
                  <span className="text-headline-xl font-bold text-primary block mb-2">99.9%</span>
                  <span className="text-label-caps text-on-surface-variant">Ativos em Cold Storage</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liderança */}
        <section className="py-24">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="mb-16">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2">Liderança Executiva</h2>
              <p className="text-on-surface-variant">Combinando décadas de experiência em mercados de capitais com inovação tecnológica.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {team.map(([name, role, bio, img]) => (
                <div key={name} className="group">
                  <div className="aspect-square bg-surface-container mb-6 overflow-hidden rounded-lg">
                    <img alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={img} />
                  </div>
                  <h4 className="text-headline-md font-headline-md text-on-surface mb-1">{name}</h4>
                  <p className="text-label-caps text-on-primary-container mb-4 font-bold">{role}</p>
                  <p className="text-body-sm text-on-surface-variant">{bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parceiros */}
        <section className="py-16 bg-surface-container-low border-y border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <span className="text-label-caps text-on-surface-variant mb-10 block">NOSSOS PARCEIROS DE INFRAESTRUTURA</span>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-70">
              {[['hub', 'CORE_LIQUIDITY'], ['lock', 'SECURE_CUSTODY'], ['cloud_done', 'DATA_SENTINEL'], ['architecture', 'BLOCK_SOLUTIONS']].map(([icon, name]) => (
                <div key={name} className="flex items-center gap-2 font-headline-md font-bold text-on-surface-variant">
                  <span className="material-symbols-outlined">{icon}</span> {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparência */}
        <section className="py-24 bg-primary-container text-white">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-headline-lg font-headline-lg mb-6">Compromisso com a Transparência</h2>
              <p className="text-body-lg text-white/70 mb-8">Nossa receita é proveniente de taxas de corretagem transparentes e serviços de custódia institucional. Não operamos contra nossos clientes nem utilizamos seus ativos para alavancagem própria.</p>
              <div className="p-6 border border-white/20 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">info</span> Riscos Envolvidos
                </h4>
                <p className="text-body-sm text-white/80 leading-relaxed">
                  O mercado de ativos digitais é volátil. Investir em criptoativos envolve riscos de perda de capital. A Acapulco Financial fornece a infraestrutura e segurança, mas não garante rentabilidade futura. Recomendamos que os investidores diversifiquem seu portfólio de acordo com seu perfil de risco.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-8 rounded-lg border border-white/10">
                  <h5 className="text-label-caps mb-4 text-white/80">REVISÕES ANUAIS</h5>
                  <span className="text-headline-xl font-bold text-secondary-fixed-dim">100%</span>
                  <p className="text-body-sm mt-2 text-white/60">Auditado por Big Four</p>
                </div>
                <div className="bg-white/5 p-8 rounded-lg border border-white/10">
                  <h5 className="text-label-caps mb-4 text-white/80">INCIDENTES</h5>
                  <span className="text-headline-xl font-bold text-secondary-fixed-dim">0</span>
                  <p className="text-body-sm mt-2 text-white/60">Histórico impecável</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
