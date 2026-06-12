import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminShell from '../components/admin/AdminShell';

const SECTIONS = [
  {
    title: 'Usuários & Métricas',
    description: 'Visão geral de usuários: novos cadastros ao longo do tempo, saldos em carteira, depósitos, lucros e busca por usuário.',
    icon: 'groups',
    path: '/admin/users',
  },
  {
    title: 'Gerenciar ativos (watchlist)',
    description: 'Adicione ativos por símbolo (validados no provedor de mercado), ative/desative e remova.',
    icon: 'candlestick_chart',
    path: '/admin/assets',
  },
  {
    title: 'Ideias & Análises',
    description: 'Publique conteúdo educacional transparente (opinião/estudo) para os usuários do simulador.',
    icon: 'lightbulb',
    path: '/admin/ideas',
  },
  {
    title: 'Controle de Mercado',
    description: 'Pilote os ativos controlados: alvo gradual, pulo, tendência e presets, com estado ao vivo do motor de preço.',
    icon: 'tune',
    path: '/admin/market',
  },
];

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <AdminShell title="Visão geral" subtitle="Acesse as áreas de gestão da plataforma.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SECTIONS.map((s) => (
          <button
            key={s.path}
            onClick={() => navigate(s.path)}
            className="group text-left bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm hover:border-primary-container/60 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-container/10 text-primary-container grid place-items-center mb-4">
              <span className="material-symbols-outlined text-[26px]">{s.icon}</span>
            </div>
            <h2 className="font-headline-md text-[18px] text-on-surface mb-1.5">{s.title}</h2>
            <p className="text-body-sm text-on-surface-variant mb-4">{s.description}</p>
            <span className="text-primary font-label-caps uppercase inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Acessar <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </button>
        ))}
      </div>
    </AdminShell>
  );
}
