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
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  BeachAccess as VacationIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { zahteviService } from '../services/zahteviService';
import { zaposleniService } from '../services/zaposleniService';
import LoadingSpinner from '../components/LoadingSpinner';

const ZahteviZaOdmor: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch data
  const {
    data: zahtevi = [],
    isLoading: zahteviLoading,
  } = useQuery({
    queryKey: ['zahteviZaOdmor'],
    queryFn: zahteviService.getAll,
  });

  const {
    data: zaposleni = [],
    isLoading: zaposleniLoading,
  } = useQuery({
    queryKey: ['zaposleni'],
    queryFn: zaposleniService.getAll,
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: zahteviService.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahteviZaOdmor'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: zahteviService.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahteviZaOdmor'] });
    },
  });

  const isLoading = zahteviLoading || zaposleniLoading;

  const getZaposleniName = (zaposleniId: number) => {
    const zaposleni_obj = zaposleni.find(z => z.id === zaposleniId);
    return zaposleni_obj ? `${zaposleni_obj.ime} ${zaposleni_obj.prezime}` : 'Nepoznato';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Odobreno';
      case 'REJECTED':
        return 'Odbačeno';
      case 'PENDING':
      default:
        return 'Na čekanju';
    }
  };

  // Statistics
  const pendingCount = zahtevi.filter(z => z.status === 'PENDING').length;
  const approvedCount = zahtevi.filter(z => z.status === 'APPROVED').length;
  const rejectedCount = zahtevi.filter(z => z.status === 'REJECTED').length;

  const handleApprove = (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da odobrite ovaj zahtev?')) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da odbacite ovaj zahtev?')) {
      rejectMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner message="Učitavanje zahteva..." />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Zahtevi za odmor
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* TODO: Implement add request */}}
        >
          Novi zahtev
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
                    Na čekanju
                  </Typography>
                  <Typography variant="h4">
                    {pendingCount}
                  </Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 40, color: 'warning.main' }} />
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
                    Odobreno
                  </Typography>
                  <Typography variant="h4">
                    {approvedCount}
                  </Typography>
                </Box>
                <CheckIcon sx={{ fontSize: 40, color: 'success.main' }} />
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
                    Odbačeno
                  </Typography>
                  <Typography variant="h4">
                    {rejectedCount}
                  </Typography>
                </Box>
                <CloseIcon sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Requests Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Zaposleni</TableCell>
              <TableCell>Tip odmora</TableCell>
              <TableCell>Od</TableCell>
              <TableCell>Do</TableCell>
              <TableCell>Razlog</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Datum zahteva</TableCell>
              <TableCell>Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zahtevi.map((zahtev) => (
              <TableRow key={zahtev.id}>
                <TableCell>{getZaposleniName(zahtev.zaposleniId)}</TableCell>
                <TableCell>
                  <Chip label={zahtev.tipOdmora} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  {dayjs(zahtev.datumOd).format('DD.MM.YYYY')}
                </TableCell>
                <TableCell>
                  {dayjs(zahtev.datumDo).format('DD.MM.YYYY')}
                </TableCell>
                <TableCell>{zahtev.razlog}</TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusText(zahtev.status)} 
                    color={getStatusColor(zahtev.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {dayjs(zahtev.datumZahteva).format('DD.MM.YYYY')}
                </TableCell>
                <TableCell>
                  {zahtev.status === 'PENDING' && (
                    <Box>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleApprove(zahtev.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleReject(zahtev.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  )}
                  {zahtev.status !== 'PENDING' && (
                    <Typography variant="body2" color="text.secondary">
                      {zahtev.odobrioPreposleni || 'Sistem'}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {zahtevi.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Nema zahteva za odmor
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ZahteviZaOdmor;