import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminShell from '../components/admin/AdminShell';

const SECTIONS = [
  {
    title: 'Dashboard analítico',
    description: 'Métricas consolidadas da plataforma, saldos em carteira e perfil de cada usuário.',
    icon: 'analytics',
    path: '/admin/dashboard-v2',
  },
  {
    title: 'Gerenciar criptomoedas',
    description: 'Criar, editar, ativar/desativar e remover criptoativos e seus planos de rendimento.',
    icon: 'currency_bitcoin',
    path: '/admin/cryptos',
  },
  {
    title: 'Configurar referência',
    description: 'Ajuste o percentual de bônus pago ao indicar novos investidores.',
    icon: 'settings',
    path: '/admin/referral-settings',
  },
  {
    title: 'Lucros de referência',
    description: 'Histórico detalhado dos bônus de indicação pagos e ranking de referenciadores.',
    icon: 'trending_up',
    path: '/admin/referral-profits',
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
