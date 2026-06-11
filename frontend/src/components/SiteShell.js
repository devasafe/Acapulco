import React from 'react';
import SiteNav from './marketing/SiteNav';
import SiteFooter from './marketing/SiteFooter';

// Layout padrão das páginas de usuário (logado): navbar + conteúdo + rodapé,
// na paleta/tipografia do design system. `active` destaca o item da navbar.
export default function SiteShell({ active = '', children }) {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <SiteNav active={active} />
      <main className="pt-20 flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
