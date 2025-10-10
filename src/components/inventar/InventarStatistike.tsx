import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  MonetizationOn as MoneyIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import inventarService, { InventarStatistike } from '../../services/inventarService';

const InventarStatistikeKomponenta: React.FC = () => {
  const [statistike, setStatistike] = useState<InventarStatistike | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    loadStatistike();
  }, []);

  const loadStatistike = async () => {
    try {
      setLoading(true);
      const data = await inventarService.getStatistike();
      setStatistike(data);
      setError(null);
    } catch (err) {
      setError('Greška pri učitavanju statistika');
      console.error('Error loading statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('sr-RS')} RSD`;
  };

  const COLORS = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main
  };

  const pieColors = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.error, COLORS.info];

  // Pripremi podatke za grafike
  const stanjeData = statistike ? Object.entries(statistike.stavkePoStanju).map(([stanje, broj], index) => ({
    name: stanje,
    value: broj,
    color: pieColors[index % pieColors.length]
  })) : [];

  const kategorijaData = statistike ? Object.entries(statistike.stavkePoKategoriji).map(([kategorija, broj]) => ({
    name: kategorija,
    vrednost: broj
  })) : [];

  const lokacijaData = statistike ? Object.entries(statistike.stavkePoLokaciji).map(([lokacija, broj]) => ({
    name: lokacija,
    vrednost: broj
  })) : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !statistike) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || 'Statistike nisu dostupne'}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Statistike Inventara
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Ključni indikatori */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ 
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {statistike.ukupanBrojStavki}
                  </Typography>
                  <Typography variant="body2">
                    Ukupno stavki
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ 
            background: `linear-gradient(135deg, ${COLORS.success}, ${COLORS.info})`,
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(statistike.ukupnaVrednost)}
                  </Typography>
                  <Typography variant="body2">
                    Ukupna vrednost
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ 
            background: `linear-gradient(135deg, ${COLORS.warning}, ${COLORS.error})`,
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {Object.keys(statistike.stavkePoKategoriji).length}
                  </Typography>
                  <Typography variant="body2">
                    Kategorija
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ 
            background: `linear-gradient(135deg, ${COLORS.info}, ${COLORS.primary})`,
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {Object.keys(statistike.stavkePoLokaciji).length}
                  </Typography>
                  <Typography variant="body2">
                    Lokacija
                  </Typography>
                </Box>
                <LocationIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Distribucija po stanju */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ mr: 1 }} /> Distribucija po stanju
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stanjeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {stanjeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Stavke po kategorijama */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <CategoryIcon sx={{ mr: 1 }} /> Stavke po kategorijama
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kategorijaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vrednost" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Stavke po lokacijama */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1 }} /> Stavke po lokacijama
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lokacijaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vrednost" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Detaljni pregled */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TrendingIcon sx={{ mr: 1 }} /> Detaljni pregled
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {Object.entries(statistike.stavkePoStanju).map(([stanje, broj]) => {
                const procenat = (broj / statistike.ukupanBrojStavki) * 100;
                return (
                  <ListItem key={stanje}>
                    <Box sx={{ width: '100%' }}>
                      <ListItemText
                        primary={`${stanje}: ${broj} stavki`}
                        secondary={`${procenat.toFixed(1)}% od ukupnog broja`}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={procenat}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventarStatistikeKomponenta;