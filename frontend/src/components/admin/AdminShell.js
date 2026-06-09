import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SiteNav from '../marketing/SiteNav';
import SiteFooter from '../marketing/SiteFooter';

const TABS = [
  { key: 'hub', label: 'Visão geral', icon: 'grid_view', path: '/admin' },
  { key: 'assets', label: 'Ativos (watchlist)', icon: 'candlestick_chart', path: '/admin/assets' },
  { key: 'ideas', label: 'Ideias & Análises', icon: 'lightbulb', path: '/admin/ideas' },
];

export default function AdminShell({ title, subtitle, actions, children }) {
  const { pathname } = useLocation();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <SiteNav active="Painel Admin" />

      <main className="pt-20 flex-1">
        {/* Cabeçalho */}
        <section className="border-b border-outline-variant/20 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-10 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="font-label-caps text-label-caps text-on-primary-container mb-2 block">PAINEL ADMINISTRATIVO</span>
                <h1 className="font-headline-xl text-headline-xl text-on-surface">{title}</h1>
                {subtitle && <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">{subtitle}</p>}
              </div>
              {actions && <div className="shrink-0">{actions}</div>}
            </div>

            {/* Abas */}
            <nav className="flex gap-1 mt-8 -mb-px overflow-x-auto">
              {TABS.map((t) => {
                const active = pathname === t.path;
                return (
                  <Link
                    key={t.key}
                    to={t.path}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap font-label-caps text-[13px] transition-colors ${
                      active
                        ? 'border-primary-container text-on-surface'
                        : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
