import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import ImovelList from './components/ImovelList';
import { useNavigate } from 'react-router-dom';
import ImovelDetailPage from './pages/ImovelDetailPage';
import WalletPage from './pages/WalletPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import ReferralNetworkPage from './pages/ReferralNetworkPage';
import ImovelAdminPage from './pages/ImovelAdminPage';
import ProfilePage from './pages/ProfilePage';
import AdminReferralProfitsPage from './pages/AdminReferralProfitsPage';
import AdminReferralSettingsPage from './pages/AdminReferralSettingsPage';

function App() {
  // Exemplo de imóveis para visualização
  const imoveisExemplo = [
    { id: 1, nome: 'Imóvel 1', localizacao: 'Barra da Tijuca', valor: 50 },
    { id: 2, nome: 'Imóvel 2', localizacao: 'Copacabana', valor: 100 },
    { id: 3, nome: 'Imóvel 3', localizacao: 'Ipanema', valor: 200 },
  ];

  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('token'));
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };
  React.useEffect(() => {
    const onLogin = () => setIsLoggedIn(true);
    window.addEventListener('userLoggedIn', onLogin);
    return () => window.removeEventListener('userLoggedIn', onLogin);
  }, []);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = window.ReactRouterNavigate || (() => {});
  const handleImovelClick = (imovel) => {
    window.location.href = `/imovel-detail/${imovel._id}`;
  };
  return (
    <Router>
      <nav style={{ padding: '16px', background: '#1976d2', color: '#fff', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#fff', marginRight: 16 }}>Login</Link>
        <Link to="/register" style={{ color: '#fff', marginRight: 16 }}>Cadastro</Link>
        <Link to="/dashboard" style={{ color: '#fff', marginRight: 16 }}>Dashboard</Link>
        <Link to="/imoveis" style={{ color: '#fff', marginRight: 16 }}>Imóveis</Link>
        <Link to="/wallet" style={{ color: '#fff', marginRight: 16 }}>Carteira</Link>
        <Link to="/transactions" style={{ color: '#fff', marginRight: 16 }}>Histórico</Link>
        <Link to="/referrals" style={{ color: '#fff', marginRight: 16 }}>Indicações</Link>
        <Link to="/profile" style={{ color: '#fff', marginRight: 16 }}>Perfil</Link>
        {user.isAdmin && (
          <Link to="/admin" style={{ color: '#fff', marginRight: 16 }}>Painel Admin</Link>
        )}
        {isLoggedIn && (
          <button onClick={handleLogout} style={{ marginLeft: 16, background: '#fff', color: '#1976d2', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={() => {
          setIsLoggedIn(true);
          window.dispatchEvent(new Event('userLoggedIn'));
        }} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
  <Route path="/imoveis" element={<ImovelList onImovelClick={handleImovelClick} />} />
  <Route path="/imovel-detail/:id" element={<ImovelDetailPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/transactions" element={<TransactionHistoryPage />} />
        <Route path="/referrals" element={<ReferralNetworkPage />} />
        <Route path="/imovel-admin" element={<ImovelAdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-referral-profits" element={
          <ProtectedRoute adminOnly>
            <AdminReferralProfitsPage />
          </ProtectedRoute>
        } />
          <Route path="/admin-referral-settings" element={
            <ProtectedRoute adminOnly>
              <AdminReferralSettingsPage />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
