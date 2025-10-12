import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Snackbar,
  Slider,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { podesavanjaService, PodesavanjaDto, PromenaLozinkeDto } from '../services/podesavanjaService';

const Podesavanja: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  // State za podešavanja
  const [podesavanja, setPodesavanja] = useState<PodesavanjaDto>({
    tema: 'light',
    jezik: 'sr',
    emailNotifikacije: true,
    deadlineNotifikacije: true,
    stavkiPoStranici: 10,
    autoSave: true,
    timeZone: 'Europe/Belgrade',
  });

  // State za promenu lozinke
  const [lozinkaData, setLozinkaData] = useState<PromenaLozinkeDto>({
    staraLozinka: '',
    novaLozinka: '',
    potvrdaLozinke: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    stara: false,
    nova: false,
    potvrda: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Query za dohvatanje podešavanja
  const { data, isLoading } = useQuery({
    queryKey: ['podesavanja'],
    queryFn: podesavanjaService.getPodesavanja,
  });

  // Ažuriraj local state kada se učitaju podaci
  useEffect(() => {
    if (data) {
      setPodesavanja({
        tema: data.tema,
        jezik: data.jezik,
        emailNotifikacije: data.emailNotifikacije,
        deadlineNotifikacije: data.deadlineNotifikacije,
        stavkiPoStranici: data.stavkiPoStranici,
        autoSave: data.autoSave,
        timeZone: data.timeZone,
      });
    }
  }, [data]);

  // Mutation za ažuriranje podešavanja
  const updateMutation = useMutation({
    mutationFn: podesavanjaService.updatePodesavanja,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podesavanja'] });
      showSnackbar('Podešavanja su uspešno sačuvana', 'success');
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Greška pri čuvanju podešavanja', 'error');
    },
  });

  // Mutation za promenu lozinke
  const lozinkaMutation = useMutation({
    mutationFn: podesavanjaService.promeniLozinku,
    onSuccess: () => {
      setLozinkaData({ staraLozinka: '', novaLozinka: '', potvrdaLozinke: '' });
      showSnackbar('Lozinka je uspešno promenjena', 'success');
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Greška pri promeni lozinke', 'error');
    },
  });

  // Mutation za reset podešavanja
  const resetMutation = useMutation({
    mutationFn: podesavanjaService.resetPodesavanja,
    onSuccess: (data) => {
      setPodesavanja({
        tema: data.tema,
        jezik: data.jezik,
        emailNotifikacije: data.emailNotifikacije,
        deadlineNotifikacije: data.deadlineNotifikacije,
        stavkiPoStranici: data.stavkiPoStranici,
        autoSave: data.autoSave,
        timeZone: data.timeZone,
      });
      queryClient.invalidateQueries({ queryKey: ['podesavanja'] });
      showSnackbar('Podešavanja su resetovana na početne vrednosti', 'success');
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Greška pri resetovanju podešavanja', 'error');
    },
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePodesavanjaChange = (field: keyof PodesavanjaDto, value: any) => {
    setPodesavanja(prev => ({ ...prev, [field]: value }));
  };

  const handleLozinkaChange = (field: keyof PromenaLozinkeDto, value: string) => {
    setLozinkaData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePodesavanja = () => {
    updateMutation.mutate(podesavanja);
  };

  const handlePromeniLozinku = () => {
    if (lozinkaData.novaLozinka !== lozinkaData.potvrdaLozinke) {
      showSnackbar('Nova lozinka i potvrda se ne poklapaju', 'error');
      return;
    }
    if (lozinkaData.novaLozinka.length < 6) {
      showSnackbar('Nova lozinka mora imati najmanje 6 karaktera', 'error');
      return;
    }
    lozinkaMutation.mutate(lozinkaData);
  };

  const handleReset = () => {
    if (window.confirm('Da li ste sigurni da želite da resetujete sva podešavanja na početne vrednosti?')) {
      resetMutation.mutate();
    }
  };

  const togglePasswordVisibility = (field: 'stara' | 'nova' | 'potvrda') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h6">Učitavanje podešavanja...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <SettingsIcon sx={{ fontSize: 'inherit', color: theme.palette.primary.main }} />
          Podešavanja
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Prilagodite aplikaciju svojim potrebama
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Promena lozinke */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardHeader
              title="🔐 Bezbednost"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                '& .MuiCardHeader-title': { fontWeight: 'bold' }
              }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Stara lozinka"
                    type={showPasswords.stara ? 'text' : 'password'}
                    value={lozinkaData.staraLozinka}
                    onChange={(e) => handleLozinkaChange('staraLozinka', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => togglePasswordVisibility('stara')}>
                          {showPasswords.stara ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nova lozinka"
                    type={showPasswords.nova ? 'text' : 'password'}
                    value={lozinkaData.novaLozinka}
                    onChange={(e) => handleLozinkaChange('novaLozinka', e.target.value)}
                    helperText="Minimum 6 karaktera"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => togglePasswordVisibility('nova')}>
                          {showPasswords.nova ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Potvrda nove lozinke"
                    type={showPasswords.potvrda ? 'text' : 'password'}
                    value={lozinkaData.potvrdaLozinke}
                    onChange={(e) => handleLozinkaChange('potvrdaLozinke', e.target.value)}
                    error={lozinkaData.novaLozinka !== lozinkaData.potvrdaLozinke && lozinkaData.potvrdaLozinke !== ''}
                    helperText={
                      lozinkaData.novaLozinka !== lozinkaData.potvrdaLozinke && lozinkaData.potvrdaLozinke !== ''
                        ? 'Lozinke se ne poklapaju'
                        : ''
                    }
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => togglePasswordVisibility('potvrda')}>
                          {showPasswords.potvrda ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handlePromeniLozinku}
                    disabled={
                      lozinkaMutation.isPending || 
                      !lozinkaData.staraLozinka || 
                      !lozinkaData.novaLozinka || 
                      lozinkaData.novaLozinka !== lozinkaData.potvrdaLozinke
                    }
                    startIcon={<SecurityIcon />}
                  >
                    {lozinkaMutation.isPending ? 'Menjam...' : 'Promeni lozinku'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Aplikacijska podešavanja */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.1)}`,
            }}
          >
            <CardHeader
              title="🎨 Aplikacija"
              sx={{ 
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                '& .MuiCardHeader-title': { fontWeight: 'bold' }
              }}
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Tema */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Tema</InputLabel>
                    <Select
                      value={podesavanja.tema}
                      label="Tema"
                      onChange={(e) => handlePodesavanjaChange('tema', e.target.value)}
                    >
                      <MenuItem value="light">🌞 Svetla</MenuItem>
                      <MenuItem value="dark">🌙 Tamna</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Jezik */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Jezik</InputLabel>
                    <Select
                      value={podesavanja.jezik}
                      label="Jezik"
                      onChange={(e) => handlePodesavanjaChange('jezik', e.target.value)}
                    >
                      <MenuItem value="sr">🇷🇸 Srpski</MenuItem>
                      <MenuItem value="en">🇺🇸 Engleski</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Stavki po stranici */}
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Stavki po stranici: <Chip label={podesavanja.stavkiPoStranici} size="small" color="primary" />
                  </Typography>
                  <Slider
                    value={podesavanja.stavkiPoStranici}
                    onChange={(_, value) => handlePodesavanjaChange('stavkiPoStranici', value)}
                    min={5}
                    max={50}
                    step={5}
                    marks={[
                      { value: 5, label: '5' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                    ]}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifikacije i ostale opcije */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: `0 8px 32px ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            <CardHeader
              title="🔔 Notifikacije i opcije"
              sx={{ 
                bgcolor: alpha(theme.palette.info.main, 0.05),
                '& .MuiCardHeader-title': { fontWeight: 'bold' }
              }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={podesavanja.emailNotifikacije}
                        onChange={(e) => handlePodesavanjaChange('emailNotifikacije', e.target.checked)}
                      />
                    }
                    label="Email notifikacije"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={podesavanja.deadlineNotifikacije}
                        onChange={(e) => handlePodesavanjaChange('deadlineNotifikacije', e.target.checked)}
                      />
                    }
                    label="Deadline upozorenja"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={podesavanja.autoSave}
                        onChange={(e) => handlePodesavanjaChange('autoSave', e.target.checked)}
                      />
                    }
                    label="Automatsko čuvanje"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Vremenska zona</InputLabel>
                    <Select
                      value={podesavanja.timeZone}
                      label="Vremenska zona"
                      onChange={(e) => handlePodesavanjaChange('timeZone', e.target.value)}
                    >
                      <MenuItem value="Europe/Belgrade">🇷🇸 Belgrade</MenuItem>
                      <MenuItem value="Europe/London">🇬🇧 London</MenuItem>
                      <MenuItem value="Europe/Sofia">🇧🇬 Sofia</MenuItem>
                      <MenuItem value="Europe/Kiev">🇺🇦 Kiev</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Dugmići za akcije */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSavePodesavanja}
                disabled={updateMutation.isPending}
                startIcon={<SaveIcon />}
                sx={{ minWidth: 200 }}
              >
                {updateMutation.isPending ? 'Čuvam...' : 'Sačuvaj podešavanja'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="warning"
                onClick={handleReset}
                disabled={resetMutation.isPending}
                startIcon={<ResetIcon />}
                sx={{ minWidth: 200 }}
              >
                {resetMutation.isPending ? 'Resetujem...' : 'Resetuj na početno'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar za notifikacije */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Podesavanja;
