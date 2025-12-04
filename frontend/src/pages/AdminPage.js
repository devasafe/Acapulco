import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Painel Administrativo</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: 16 }}>
          <button onClick={() => navigate('/admin-referral-profits')} style={{ width: '100%', padding: 12, fontSize: 16 }}>Lucros por Indicação</button>
        </li>
        <li style={{ marginBottom: 16 }}>
          <button onClick={() => navigate('/admin-referral-settings')} style={{ width: '100%', padding: 12, fontSize: 16 }}>Configurar Porcentagem de Indicação</button>
        </li>
        <li style={{ marginBottom: 16 }}>
          <button onClick={() => navigate('/imovel-admin')} style={{ width: '100%', padding: 12, fontSize: 16 }}>Administração de Imóveis</button>
        </li>
      </ul>
    </div>
  );
}
