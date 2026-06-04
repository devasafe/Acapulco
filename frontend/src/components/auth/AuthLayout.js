import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../marketing/ThemeToggle';

const TRUST = [
  { icon: 'verified_user', title: 'Custódia segregada', text: 'Ativos sob custódia institucional e auditada.' },
  { icon: 'lock', title: 'Criptografia ponta a ponta', text: 'Seus dados e operações protegidos por padrão.' },
  { icon: 'trending_up', title: 'Rendimento programado', text: 'Planos transparentes com prazo e retorno definidos.' },
];

export default function AuthLayout({ title, subtitle, badge, children }) {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md flex">
      {/* Painel institucional */}
      <aside className="hidden lg:flex flex-col justify-between w-[44%] bg-primary-container text-white p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />

        <Link to="/" className="relative z-10 inline-flex items-center gap-2 font-headline-md text-[22px] font-bold">
          <span className="material-symbols-outlined">finance_mode</span> Acapulco
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="font-headline-xl text-headline-xl leading-tight mb-3">
            Invista em criptoativos com a solidez de uma instituição.
          </h2>
          <p className="text-white/70 mb-10">
            Plataforma regulada para construir patrimônio em ativos digitais com rendimento programado.
          </p>
          <ul className="space-y-5">
            {TRUST.map((t) => (
              <li key={t.icon} className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                </span>
                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-white/60 text-body-sm">{t.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/40 text-body-sm">© {new Date().getFullYear()} Acapulco. Todos os direitos reservados.</p>
      </aside>

      {/* Formulário */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 sm:px-10 py-5">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 font-headline-md text-[18px] font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary-container">finance_mode</span> Acapulco
          </Link>
          <span className="hidden lg:block" />
          <ThemeToggle />
        </header>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              {badge && <span className="font-label-caps text-label-caps text-on-primary-container mb-2 block">{badge}</span>}
              <h1 className="font-headline-xl text-headline-xl text-on-surface">{title}</h1>
              {subtitle && <p className="text-on-surface-variant mt-2">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export const authInputCls =
  'w-full bg-surface-container-low border border-outline-variant text-on-surface pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 placeholder:text-on-surface-variant/60 disabled:opacity-60';
