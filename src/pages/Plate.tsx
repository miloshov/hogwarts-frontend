import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { plateService } from '../services/plateService';
import { zaposleniService } from '../services/zaposleniService';
import LoadingSpinner from '../components/LoadingSpinner';

const Plate: React.FC = () => {
  // Fetch data
  const {
    data: plate = [],
    isLoading: plataLoading,
  } = useQuery({
    queryKey: ['plate'],
    queryFn: plateService.getAll,
  });

  const {
    data: zaposleni = [],
    isLoading: zaposleniLoading,
  } = useQuery({
    queryKey: ['zaposleni'],
    queryFn: zaposleniService.getAll,
  });

  const isLoading = plataLoading || zaposleniLoading;

  // Calculate statistics
  const totalPlate = plate.reduce((sum, p) => sum + p.iznos, 0);
  const averagePlata = plate.length > 0 ? totalPlate / plate.length : 0;
  const currentMonthPlate = plate.filter(p => 
    dayjs(p.datum).month() === dayjs().month() && 
    dayjs(p.datum).year() === dayjs().year()
  );

  const getZaposleniName = (zaposleniId: number) => {
    const zaposleni_obj = zaposleni.find(z => z.id === zaposleniId);
    return zaposleni_obj ? `${zaposleni_obj.ime} ${zaposleni_obj.prezime}` : 'Nepoznato';
  };

  if (isLoading) return <LoadingSpinner message="Učitavanje plata..." />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Plate
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* TODO: Implement add salary */}}
        >
          Dodaj platu
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Ukupne plate
                  </Typography>
                  <Typography variant="h5">
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(totalPlate)}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Prosečna plata
                  </Typography>
                  <Typography variant="h5">
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(averagePlata)}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Ovaj mesec
                  </Typography>
                  <Typography variant="h5">
                    {currentMonthPlate.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    isplaćenih plata
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Plate Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Zaposleni</TableCell>
              <TableCell>Iznos</TableCell>
              <TableCell>Tip</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Opis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plate.map((plata) => (
              <TableRow key={plata.id}>
                <TableCell>{getZaposleniName(plata.zaposleniId)}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(plata.iznos)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={plata.tip} 
                    size="small" 
                    color={plata.tip === 'Osnovica' ? 'primary' : 'secondary'}
                  />
                </TableCell>
                <TableCell>
                  {dayjs(plata.datum).format('DD.MM.YYYY')}
                </TableCell>
                <TableCell>{plata.opis || '-'}</TableCell>
              </TableRow>
            ))}
            {plate.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nema evidentiranih plata
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Plate;