import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Avatar,
  Paper,
  useTheme,
  alpha,
  Fade,
  Slide,
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  console.log("?? Login component rendered");
  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("?? LOGIN FORM SUBMITTED!");
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ UserName: userNameOrEmail, Password: password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri prijavljivanju');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            rgba(103, 58, 183, 0.1) 0%, 
            rgba(63, 81, 181, 0.1) 25%,
            rgba(33, 150, 243, 0.1) 50%,
            rgba(156, 39, 176, 0.1) 75%,
            rgba(233, 30, 99, 0.1) 100%
          ),
          radial-gradient(ellipse at top left, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at top right, rgba(118, 75, 162, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at bottom left, rgba(63, 81, 181, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(156, 39, 176, 0.15) 0%, transparent 50%),
          linear-gradient(to bottom, #f8fafc, #e2e8f0)
        `,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(118, 75, 162, 0.08) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          zIndex: 1,
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
      }}
    >
      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Fade in timeout={1000}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 6, 
                width: '100%',
                maxWidth: 480,
                background: alpha(theme.palette.background.paper, 0.85),
                backdropFilter: 'blur(20px)',
                borderRadius: 6,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                boxShadow: `
                  0 32px 64px -12px ${alpha(theme.palette.primary.main, 0.25)},
                  0 0 0 1px ${alpha(theme.palette.background.paper, 0.05)},
                  inset 0 1px 0 ${alpha('#ffffff', 0.1)}
                `,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, 
                    ${theme.palette.primary.main}, 
                    ${theme.palette.secondary.main}, 
                    ${theme.palette.primary.main}
                  )`,
                  borderRadius: '6px 6px 0 0',
                },
              }}
            >
              <Slide direction="down" in timeout={1200}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar 
                    sx={{ 
                      m: 2, 
                      width: 72,
                      height: 72,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                      border: '3px solid',
                      borderColor: alpha('#ffffff', 0.2),
                    }}
                  >
                    <LockIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  
                  <Typography 
                    component="h1" 
                    variant="h3" 
                    sx={{
                      fontWeight: 800,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textAlign: 'center',
                      letterSpacing: '-0.02em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      mb: 1,
                    }}
                  >
                    🏰 Hogwarts HR
                  </Typography>
                  
                  <Typography 
                    component="h2" 
                    variant="h6"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      textAlign: 'center',
                      mb: 4,
                      letterSpacing: '0.01em',
                    }}
                  >
                    Sistem za upravljanje ljudskim resursima
                  </Typography>
                  
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mt: 2, 
                        width: '100%',
                        borderRadius: 3,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="userNameOrEmail"
                      label="Korisničko ime ili email"
                      name="userNameOrEmail"
                      autoComplete="username"
                      autoFocus
                      value={userNameOrEmail}
                      onChange={(e) => setUserNameOrEmail(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          fontSize: '1.1rem',
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.background.paper, 0.95),
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                          },
                          '&.Mui-focused': {
                            backgroundColor: alpha(theme.palette.background.paper, 1),
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                          },
                        },
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Lozinka"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          fontSize: '1.1rem',
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.background.paper, 0.95),
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                          },
                          '&.Mui-focused': {
                            backgroundColor: alpha(theme.palette.background.paper, 1),
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                          },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{ 
                        mt: 4, 
                        mb: 2,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        textTransform: 'none',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.5)}`,
                          '&::before': {
                            left: '100%',
                          },
                        },
                        '&:active': {
                          transform: 'translateY(-1px)',
                        },
                        '&:disabled': {
                          background: theme.palette.grey[400],
                          transform: 'none',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {loading ? 'Prijavljivanje...' : '✨ Prijavite se'}
                    </Button>
                  </Box>
                </Box>
              </Slide>
            </Paper>
          </Fade>
          
          {/* Floating elements for extra magic */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
              animation: 'float 6s ease-in-out infinite',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '15%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
              animation: 'float 8s ease-in-out infinite reverse',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              left: '20%',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
              animation: 'float 10s ease-in-out infinite',
              zIndex: 0,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Login;