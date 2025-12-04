import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    try {
      const res = await login(email, password);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  if (onLogin) onLogin();
  navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Entrar</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
    </div>
  );
}
