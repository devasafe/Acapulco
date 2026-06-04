import React from 'react';
import { Link } from 'react-router-dom';

const cols = [
  { title: 'Plataforma', items: [['Criptoativos', '/cryptos'], ['Rendimentos', '/rendimentos'], ['Carteiras', '/cryptos']] },
  { title: 'Institucional', items: [['Sobre', '/about'], ['Carreiras', '#'], ['Contato', '/contact']] },
  { title: 'Segurança', items: [['Proof of Reserves', '#'], ['Custódia Segregada', '#']] },
  { title: 'Legal', items: [['Aviso de Risco', '#'], ['Privacidade', '#']] },
];

export default function SiteFooter() {
  return (
    <footer className="bg-primary-container w-full py-16 px-margin-mobile md:px-margin-desktop border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-gutter max-w-container-max mx-auto">
        <div className="lg:col-span-2">
          <div className="text-headline-md font-headline-md text-white mb-6">Acapulco Financial</div>
          <p className="text-white/70 text-body-sm max-w-xs mb-8">
            Liderando a convergência entre o mercado financeiro tradicional e a nova economia digital.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-white font-semibold mb-6">{c.title}</h4>
            <ul className="space-y-4">
              {c.items.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-white/70 hover:text-white text-body-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-white/15 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/50 text-body-sm">© 2024 Acapulco Financial. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
        <p className="text-white/50 text-body-sm">Investir em criptoativos envolve riscos.</p>
      </div>
    </footer>
  );
}
