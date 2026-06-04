import React, { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.theme = dark ? 'dark' : 'light'; } catch (e) {}
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label="Alternar tema"
      title={dark ? 'Tema claro' : 'Tema escuro'}
      className={`w-10 h-10 grid place-items-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors ${className}`}
    >
      <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
    </button>
  );
}
