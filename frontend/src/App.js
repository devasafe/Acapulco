import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AdminDashboardV2 from './pages/AdminDashboardV2';
import MarketsPage from './pages/MarketsPage';
import AssetPage from './pages/AssetPage';
import AssetAdminPage from './pages/AssetAdminPage';
import AdminIdeasPage from './pages/AdminIdeasPage';
import MarketControlPage from './pages/MarketControlPage';
import ReferralNetworkPage from './pages/ReferralNetworkPage';
import WalletPage from './pages/WalletPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import { getToken } from './utils/auth';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C3AED' },
    secondary: { main: '#6B46C1' },
    background: { default: '#0F1117', paper: '#1A1F2E' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Público */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/markets" element={<ProtectedRoute><MarketsPage /></ProtectedRoute>} />
          <Route path="/asset/:symbol" element={<ProtectedRoute><AssetPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><ReferralNetworkPage /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminDashboardV2 /></ProtectedRoute>} />
          <Route path="/admin/assets" element={<ProtectedRoute><AssetAdminPage /></ProtectedRoute>} />
          <Route path="/admin/ideas" element={<ProtectedRoute><AdminIdeasPage /></ProtectedRoute>} />
          <Route path="/admin/market" element={<ProtectedRoute><MarketControlPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={getToken() ? '/dashboard' : '/'} replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
