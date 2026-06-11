import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { getToken, getUser } from '../../utils/auth';

export default function SiteNav({ active = '' }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const loggedIn = !!getToken();
  const user = loggedIn ? getUser() : {};

  // Mesmos links da nav antiga
  const links = [
    { label: 'Início', to: '/' },
    { label: 'Sobre', to: '/about' },
    { label: 'Contato', to: '/contact' },
    ...(loggedIn
      ? [
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Mercados', to: '/markets' },
          { label: 'Ranking', to: '/leaderboard' },
          { label: 'Perfil', to: '/profile' },
          ...(user?.isAdmin ? [{ label: 'Painel Admin', to: '/admin' }] : []),
        ]
      : []),
  ];

  function logout() {
    try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch (e) {}
    navigate('/login');
  }

  const linkCls = (label) =>
    active === label
      ? 'text-on-surface font-semibold border-b-2 border-on-surface pb-1'
      : 'text-on-surface-variant hover:text-on-surface transition-colors';

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Link to="/" className="text-headline-md font-headline-lg font-bold tracking-tight text-on-surface">
          Acapulco <span className="text-on-surface-variant font-normal text-body-sm">· Simulador</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((l) => (
            <Link key={l.label} to={l.to} className={linkCls(l.label)}>{l.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          {loggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="w-9 h-9 rounded-full bg-primary-container text-white grid place-items-center font-bold uppercase">
                  {(user?.name || 'U').charAt(0)}
                </span>
                <span className="hidden lg:inline text-body-sm">{user?.name || 'Conta'}</span>
              </button>
              <button onClick={logout} className="text-danger font-label-caps uppercase hover:opacity-80 transition-opacity">Sair</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="text-on-surface-variant font-label-caps uppercase hover:text-on-surface transition-colors">Entrar</button>
              <button onClick={() => navigate('/register')} className="bg-primary-container text-white px-5 lg:px-6 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 transition-opacity active:scale-95">Abrir conta</button>
            </div>
          )}
          {/* Hamburguer mobile */}
          <button onClick={() => setOpen((o) => !o)} className="md:hidden w-10 h-10 grid place-items-center rounded-lg text-on-surface hover:bg-surface-container" aria-label="Menu">
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface px-margin-mobile py-4 space-y-1">
          {links.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="block px-2 py-2.5 rounded-lg text-on-surface hover:bg-surface-container">{l.label}</Link>
          ))}
          <div className="pt-3 mt-2 border-t border-outline-variant/30 flex flex-col gap-2">
            {loggedIn ? (
              <button onClick={() => { setOpen(false); logout(); }} className="text-left px-2 py-2.5 rounded-lg text-danger font-semibold hover:bg-surface-container">Sair</button>
            ) : (
              <>
                <button onClick={() => { setOpen(false); navigate('/login'); }} className="text-left px-2 py-2.5 rounded-lg text-on-surface hover:bg-surface-container">Entrar</button>
                <button onClick={() => { setOpen(false); navigate('/register'); }} className="bg-primary-container text-white px-4 py-2.5 rounded-lg font-label-caps uppercase text-center">Abrir conta</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
