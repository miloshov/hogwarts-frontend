import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/sr';
import 'dayjs/locale/en';
import 'dayjs/locale/bg';
import 'dayjs/locale/uk';

// i18n import
import './i18n/i18n';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Zaposleni from './pages/Zaposleni';
import Plate from './pages/Plate';
import ZahteviZaOdmor from './pages/ZahteviZaOdmor';
import InventarPage from './pages/InventarPage';
import Struktura from './pages/Struktura';
import MojProfil from './components/MojProfil';
import LoadingSpinner from './components/LoadingSpinner';
import Podesavanja from './pages/Podesavanja';

// Kreiranje QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minuta
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/zaposleni" element={<Zaposleni />} />
                            <Route path="/plate" element={<Plate />} />
                            <Route path="/zahtevi-za-odmor" element={<ZahteviZaOdmor />} />
                            <Route path="/inventar" element={<InventarPage />} />
                            <Route path="/struktura" element={<Struktura />} />
                            <Route path="/moj-profil" element={<MojProfil />} />
                            <Route path="/podesavanja" element={<Podesavanja />} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </LocalizationProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
