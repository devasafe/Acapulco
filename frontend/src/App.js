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
import CryptoAdminPage from './pages/CryptoAdminPage';
import CryptoListPage from './pages/CryptoListPage';
import CryptoDetailPage from './pages/CryptoDetailPage';
import ReferralNetworkPage from './pages/ReferralNetworkPage';
import AdminReferralSettingsPage from './pages/AdminReferralSettingsPage';
import AdminReferralProfitsPage from './pages/AdminReferralProfitsPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import { getToken } from './utils/auth';

// Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3B5BDB' },
    secondary: { main: '#6B46C1' },
    background: { default: '#0F1117', paper: '#1A1F2E' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cryptos"
            element={
              <ProtectedRoute>
                <CryptoListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cryptos/:id"
            element={
              <ProtectedRoute>
                <CryptoDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/referrals"
            element={
              <ProtectedRoute>
                <ReferralNetworkPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cryptos"
            element={
              <ProtectedRoute>
                <CryptoAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/referral-settings"
            element={
              <ProtectedRoute>
                <AdminReferralSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/referral-profits"
            element={
              <ProtectedRoute>
                <AdminReferralProfitsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to={getToken() ? '/dashboard' : '/login'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
