import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [codigoIndicacao, setCodigoIndicacao] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    try {
      await register(name, email, password, codigoIndicacao);
      setSuccess('Cadastro realizado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
      setCodigoIndicacao('');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
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
        <input
          type="text"
          placeholder="Código de indicação (opcional)"
          value={codigoIndicacao}
          onChange={e => setCodigoIndicacao(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Cadastrar</button>
      </form>
      {success && <p style={{ color: 'green', marginTop: 12 }}>{success}</p>}
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
    </div>
  );
}
