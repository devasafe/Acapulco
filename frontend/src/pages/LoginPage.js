import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout, { authInputCls } from '../components/auth/AuthLayout';
import axios from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout badge="ACESSO À CONTA" title="Entrar" subtitle="Acesse sua carteira e acompanhe seus investimentos.">
      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 text-body-sm">{error}</div>
        )}

        <div className="space-y-1.5">
          <label className="text-label-caps text-on-surface-variant">E-MAIL</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="voce@email.com" className={authInputCls} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-label-caps text-on-surface-variant">SENHA</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} placeholder="••••••••" className={authInputCls} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-primary-container text-white py-3 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2 transition-opacity">
          {loading && <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-body-sm text-on-surface-variant">
          Não tem conta?{' '}
          <Link to="/register" className="text-primary font-semibold hover:opacity-80">Cadastre-se</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
