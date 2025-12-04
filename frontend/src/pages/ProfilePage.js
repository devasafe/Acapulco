import React from 'react';

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user || !user.email) {
    return <div>Usuário não logado.</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Perfil</h2>
  <p><strong>Nome:</strong> {user.name}</p>
  <p><strong>Código de indicação:</strong> {user._id}</p>
      <p><strong>Email:</strong> {user.email}</p>
  <p><strong>Admin:</strong> {user.isAdmin ? 'Sim' : 'Não'}</p>
  <p><strong>Indicado por:</strong> {user.indicadoPorName || '-'}</p>
  <p><strong>Data de cadastro:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</p>
    </div>
  );
}
