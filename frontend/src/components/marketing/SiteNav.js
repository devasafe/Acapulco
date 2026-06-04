import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const links = [
  { label: 'Início', to: '/' },
  { label: 'Criptoativos', to: '/cryptos' },
  { label: 'Rendimentos', to: '/rendimentos' },
  { label: 'Indicação', to: '/indicacao' },
  { label: 'Sobre', to: '/about' },
  { label: 'Contato', to: '/contact' },
];

export default function SiteNav({ active = '' }) {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Link to="/" className="text-headline-md font-headline-lg font-bold tracking-tight text-on-surface">
          Acapulco Financial
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={
                active === l.label
                  ? 'text-on-surface font-semibold border-b-2 border-on-surface pb-1'
                  : 'text-on-surface-variant hover:text-on-surface transition-colors'
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:inline text-on-surface-variant font-label-caps uppercase hover:text-on-surface transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-primary-container text-white px-5 md:px-6 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity active:scale-95"
          >
            Abrir conta
          </button>
        </div>
      </div>
    </nav>
  );
}
