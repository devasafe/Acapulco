import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AuthLayout, { authInputCls } from '../components/auth/AuthLayout';
import axios from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCodeInput: referralCode || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password) { setError('Preencha todos os campos'); return; }
    if (formData.password !== formData.confirmPassword) { setError('As senhas não coincidem'); return; }
    if (!agreeTerms) { setError('Você deve aceitar os termos'); return; }

    setLoading(true);
    try {
      const finalReferralCode = formData.referralCodeInput || referralCode;
      const endpoint = finalReferralCode ? '/auth/register-with-referral' : '/auth/register';
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: finalReferralCode,
      };
      const response = await axios.post(endpoint, payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout badge="NOVA CONTA" title="Criar conta" subtitle="Junte-se à Acapulco e comece a investir.">
      {referralCode && (
        <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-2.5 text-body-sm mb-5 inline-flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">redeem</span> Você foi convidado por um usuário
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 text-body-sm">{error}</div>
        )}

        <div className="space-y-1.5">
          <label className="text-label-caps text-on-surface-variant">NOME COMPLETO</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
            <input name="name" value={formData.name} onChange={handleChange} disabled={loading} placeholder="Seu nome" className={authInputCls} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-label-caps text-on-surface-variant">E-MAIL</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
            <input name="email" type="email" value={formData.email} onChange={handleChange} disabled={loading} placeholder="voce@email.com" className={authInputCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-label-caps text-on-surface-variant">SENHA</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
              <input name="password" type="password" value={formData.password} onChange={handleChange} disabled={loading} placeholder="••••••••" className={authInputCls} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-label-caps text-on-surface-variant">CONFIRMAR SENHA</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} disabled={loading} placeholder="••••••••" className={authInputCls} />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-label-caps text-on-surface-variant">CÓDIGO DE REFERÊNCIA (OPCIONAL)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">link</span>
            <input name="referralCodeInput" value={formData.referralCodeInput} onChange={handleChange} disabled={loading} placeholder="Cole o código do seu indicador" className={authInputCls} />
          </div>
          <p className="text-body-sm text-on-surface-variant">Se você foi indicado por alguém, informe o código aqui.</p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4 accent-primary-container" />
          <span className="text-body-sm text-on-surface-variant">Aceito os termos de serviço</span>
        </label>

        <button type="submit" disabled={loading} className="w-full bg-primary-container text-white py-3 rounded-lg font-label-caps uppercase hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2 transition-opacity">
          {loading && <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p className="text-center text-body-sm text-on-surface-variant">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary font-semibold hover:opacity-80">Faça login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
