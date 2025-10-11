import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/sr';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Zaposleni from './pages/Zaposleni';
import Plate from './pages/Plate';
import ZahteviZaOdmor from './pages/ZahteviZaOdmor';
import InventarPage from './pages/InventarPage';
import Struktura from './pages/Struktura';
import MojProfil from './components/MojProfil'; // ✅ ISPRAVLJENA PUTANJA - bilo './MojProfil_Fixed'
import LoadingSpinner from './components/LoadingSpinner';

// 🎨 Kreiranje moderne teme sa elegantnim gradijentima
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8fa7f3',
      dark: '#4c63d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9575cd',
      dark: '#512e7a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
    success: {
      main: '#48bb78',
      light: '#68d391',
      dark: '#38a169',
    },
    warning: {
      main: '#ed8936',
      light: '#f6ad55',
      dark: '#dd6b20',
    },
    error: {
      main: '#f56565',
      light: '#fc8181',
      dark: '#e53e3e',
    },
    info: {
      main: '#4299e1',
      light: '#63b3ed',
      dark: '#3182ce',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 12px 24px rgba(0, 0, 0, 0.12)',
    '0px 16px 32px rgba(0, 0, 0, 0.15)',
    '0px 20px 40px rgba(0, 0, 0, 0.18)',
    '0px 24px 48px rgba(0, 0, 0, 0.2)',
    '0px 32px 64px rgba(0, 0, 0, 0.25)',
    '0px 40px 80px rgba(0, 0, 0, 0.3)',
    '0px 48px 96px rgba(0, 0, 0, 0.35)',
    '0px 56px 112px rgba(0, 0, 0, 0.4)',
    '0px 64px 128px rgba(0, 0, 0, 0.45)',
    '0px 72px 144px rgba(0, 0, 0, 0.5)',
    '0px 80px 160px rgba(0, 0, 0, 0.55)',
    '0px 88px 176px rgba(0, 0, 0, 0.6)',
    '0px 96px 192px rgba(0, 0, 0, 0.65)',
    '0px 104px 208px rgba(0, 0, 0, 0.7)',
    '0px 112px 224px rgba(0, 0, 0, 0.75)',
    '0px 120px 240px rgba(0, 0, 0, 0.8)',
    '0px 128px 256px rgba(0, 0, 0, 0.85)',
    '0px 136px 272px rgba(0, 0, 0, 0.9)',
    '0px 144px 288px rgba(0, 0, 0, 0.95)',
    '0px 152px 304px rgba(0, 0, 0, 1)',
    '0px 160px 320px rgba(0, 0, 0, 1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            linear-gradient(135deg, 
              rgba(102, 126, 234, 0.1) 0%, 
              rgba(118, 75, 162, 0.1) 100%
            ),
            linear-gradient(to bottom, #f8fafc, #e2e8f0)
          `,
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff !important',
          '& .MuiTypography-root': {
            color: '#ffffff !important',
          },
          '& .MuiIconButton-root': {
            color: '#ffffff !important',
          },
          '& .MuiButton-root': {
            color: '#ffffff !important',
          },
          '& *': {
            color: '#ffffff !important',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          '& .MuiListItemText-primary': {
            fontWeight: 600,
            color: '#2d3748',
          },
          '& .MuiListItemIcon-root': {
            color: '#667eea',
          },
          '& .MuiListItemButton-root': {
            borderRadius: '8px',
            margin: '4px 8px',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.08)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(102, 126, 234, 0.12)',
              '& .MuiListItemText-primary': {
                color: '#667eea',
                fontWeight: 700,
              },
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 48,
          '&.Mui-selected': {
            color: '#667eea',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '.MuiAppBar-root &': {
            color: '#ffffff !important',
          },
        },
      },
    },
  },
});

// 🌟 FORSIRANO BELI TEKST U APPBAR-U - GLOBALNI CSS STILOVI
const globalStyles = (
  <GlobalStyles
    styles={{
      // FORCE WHITE TEXT IN APPBAR - OVO JE NOVO DODATO!
      '.MuiAppBar-root': {
        color: '#ffffff !important',
      },
      '.MuiAppBar-root *': {
        color: '#ffffff !important',
      },
      '.MuiAppBar-root .MuiTypography-root': {
        color: '#ffffff !important',
      },
      '.MuiAppBar-root .MuiIconButton-root': {
        color: '#ffffff !important',
      },
      '.MuiAppBar-root .MuiButton-root': {
        color: '#ffffff !important',
      },
      '.MuiAppBar-root .MuiSvgIcon-root': {
        color: '#ffffff !important',
      },
      // ANIMACIJE
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      '@keyframes slideIn': {
        '0%': { opacity: 0, transform: 'translateX(-20px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },
      '@keyframes pulse': {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
      },
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(102, 126, 234, 0.3) rgba(0, 0, 0, 0.1)',
      },
      '*::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '*::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb': {
        background: 'rgba(102, 126, 234, 0.3)',
        borderRadius: '4px',
        '&:hover': {
          background: 'rgba(102, 126, 234, 0.5)',
        },
      },
      '.animate-fade-in': {
        animation: 'fadeIn 0.6s ease-out',
      },
      '.animate-slide-in': {
        animation: 'slideIn 0.4s ease-out',
      },
      '.animate-pulse': {
        animation: 'pulse 2s infinite',
      },
      body: {
        fontFamily: '"Inter", "Segoe UI", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
        letterSpacing: '0.01em',
      },
    }}
  />
);

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
          <AuthProvider>
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
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;