import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { InventarService } from '../../services/inventarService';
import { InventarStats } from '../../types/inventar';

const InventarStatistike: React.FC = () => {
  // 🔍 SAFE STATE INITIALIZATION
  const [statistike, setStatistike] = useState<InventarStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatistike = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📊 Učitavam statistike inventara...');
      const data = await InventarService.getStatistike();
      
      console.log('🔍 Statistike response type:', typeof data);
      console.log('🔍 Statistike response:', data);
      
      if (data && typeof data === 'object') {
        console.log('✅ Statistike uspešno učitane');
        setStatistike(data);
      } else {
        console.error('❌ Statistike su u neočekivanom formatu:', data);
        setStatistike(null);
        setError('Statistike su u neočekivanom formatu');
      }
    } catch (err: any) {
      console.error('❌ Greška pri učitavanju statistika:', err);
      setError(err.message || 'Neočekivana greška pri učitavanju statistika');
      setStatistike(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistike();
  }, []);

  // 🔍 SAFE HELPER FUNCTIONS sa default vrednostima
  const getUkupnoStavki = (): number => {
    return statistike?.ukupnoStavki ?? 0;
  };

  const getUkupnaVrednost = (): number => {
    return statistike?.ukupnaVrednost ?? 0;
  };

  const getKategorije = (): number => {
    return statistike?.brojKategorija ?? 0;
  };

  const getStatusDistribucija = (): Array<{label: string, value: number, color: string}> => {
    if (!statistike?.statusDistribucija || typeof statistike.statusDistribucija !== 'object') {
      return [
        { label: 'Dostupno', value: 0, color: '#4caf50' },
        { label: 'Izdato', value: 0, color: '#ff9800' },
        { label: 'Pokvareno', value: 0, color: '#f44336' },
        { label: 'Servis', value: 0, color: '#2196f3' },
      ];
    }

    // 🔍 SAFE Object.entries sa fallback
    const entries = Object.entries(statistike.statusDistribucija || {});
    return entries.map(([status, count]) => ({
      label: status || 'Nepoznato',
      value: Number(count) || 0,
      color: getStatusColor(status),
    }));
  };

  const getKategorijeDistribucija = (): Array<{kategorija: string, brojStavki: number}> => {
    if (!statistike?.kategorijeDistribucija || !Array.isArray(statistike.kategorijeDistribucija)) {
      return [];
    }

    return statistike.kategorijeDistribucija.map((item: any) => ({
      kategorija: item?.kategorija || 'Nepoznato',
      brojStavki: Number(item?.brojStavki) || 0,
    }));
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'dostupno':
        return '#4caf50';
      case 'izdato':
        return '#ff9800';
      case 'pokvareno':
        return '#f44336';
      case 'servis':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'dostupno':
        return <CheckCircleIcon />;
      case 'izdato':
        return <InfoIcon />;
      case 'pokvareno':
        return <ErrorIcon />;
      case 'servis':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        gap={2}
      >
        <CircularProgress size={48} />
        <Typography variant="body1">
          Učitavam statistike inventara...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={loadStatistike}>
              Pokušaj ponovo
            </Button>
          }
        >
          <Typography variant="body2">
            <strong>Greška pri učitavanju statistika:</strong><br />
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  // No data state
  if (!statistike) {
    return (
      <Box textAlign="center" py={6}>
        <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Nema dostupnih statistika
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Možda još uvek nema podataka u inventaru
        </Typography>
        <Button variant="outlined" onClick={loadStatistike}>
          Osvezi
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Osnovne statistike */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Ukupno stavki
                  </Typography>
                  <Typography variant="h4" component="div">
                    {getUkupnoStavki().toLocaleString()}
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Ukupna vrednost
                  </Typography>
                  <Typography variant="h4" component="div">
                    {getUkupnaVrednost().toLocaleString()} RSD
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Broj kategorija
                  </Typography>
                  <Typography variant="h4" component="div">
                    {getKategorije()}
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Aktivni status
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    Online
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status distribucija */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribucija po statusu
              </Typography>
              {getStatusDistribucija().map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(item.label)}
                      <Typography variant="body2">
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getUkupnoStavki() > 0 ? (item.value / getUkupnoStavki()) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.color,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Kategorije
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Kategorija</TableCell>
                      <TableCell align="right">Broj stavki</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getKategorijeDistribucija().length > 0 ? (
                      getKategorijeDistribucija().map((kategorija, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {kategorija.kategorija}
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={kategorija.brojStavki} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          <Typography variant="body2" color="text.secondary">
                            Nema kategorija
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action buttons */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={loadStatistike}>
          Osvezi statistike
        </Button>
        <Button variant="contained" startIcon={<AssessmentIcon />}>
          Izvezi izveštaj
        </Button>
      </Box>
    </Box>
  );
};

export default InventarStatistike;