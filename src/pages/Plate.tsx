import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { plataService } from '../services/plataService';
import { zaposleniService } from '../services/zaposleniService';
import { Plata, PlataDto, Zaposleni } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface PlataFormData {
  zaposleniId: number;
  osnovna: number;
  bonusi: number;
  otkazi: number;
  period: string;
  napomene: string;
}

const Plate: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingPlata, setEditingPlata] = useState<Plata | null>(null);
  const [viewingPlata, setViewingPlata] = useState<Plata | null>(null);
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<PlataFormData>();

  const { data: plate, isLoading } = useQuery({
    queryKey: ['plate'],
    queryFn: plataService.getAll,
  });

  const { data: zaposleni } = useQuery({
    queryKey: ['zaposleni'],
    queryFn: zaposleniService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: plataService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plate'] });
      setOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PlataDto }) =>
      plataService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plate'] });
      setOpen(false);
      setEditingPlata(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: plataService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plate'] });
    },
  });

  const handleCreate = () => {
    setEditingPlata(null);
    reset({
      zaposleniId: 0,
      osnovna: 0,
      bonusi: 0,
      otkazi: 0,
      period: '',
      napomene: '',
    });
    setOpen(true);
  };

  const handleEdit = (plata: Plata) => {
    setEditingPlata(plata);
    reset({
      zaposleniId: plata.zaposleniId,
      osnovna: plata.osnovna,
      bonusi: plata.bonusi,
      otkazi: plata.otkazi,
      period: plata.period,
      napomene: plata.napomene || '',
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu platu?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (plata: Plata) => {
    setViewingPlata(plata);
  };

  const onSubmit = (data: PlataFormData) => {
    const plataData: PlataDto = {
      zaposleniId: data.zaposleniId,
      osnovna: Number(data.osnovna),
      bonusi: Number(data.bonusi),
      otkazi: Number(data.otkazi),
      period: data.period,
      napomene: data.napomene || undefined,
    };

    if (editingPlata) {
      updateMutation.mutate({ id: editingPlata.id, data: plataData });
    } else {
      createMutation.mutate(plataData);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const ukupnePlate = plate?.reduce((sum, p) => sum + p.neto, 0) || 0;
  const prosecnaPlata = plate?.length ? ukupnePlate / plate.length : 0;
  const najvisaPlata = plate?.length ? Math.max(...plate.map(p => p.neto)) : 0;
  const najnizaPlata = plate?.length ? Math.min(...plate.map(p => p.neto)) : 0;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Plate</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Dodaj platu
        </Button>
      </Box>

      {/* Statistike */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ukupne plate
              </Typography>
              <Typography variant="h5">
                {ukupnePlate.toLocaleString()} RSD
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Prosečna plata
              </Typography>
              <Typography variant="h5">
                {Math.round(prosecnaPlata).toLocaleString()} RSD
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Najviša plata
              </Typography>
              <Typography variant="h5">
                {najvisaPlata.toLocaleString()} RSD
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Najniža plata
              </Typography>
              <Typography variant="h5">
                {najnizaPlata.toLocaleString()} RSD
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Zaposleni</TableCell>
              <TableCell>Period</TableCell>
              <TableCell align="right">Osnovna</TableCell>
              <TableCell align="right">Bonusi</TableCell>
              <TableCell align="right">Otkazi</TableCell>
              <TableCell align="right">Neto</TableCell>
              <TableCell>Datum kreiranja</TableCell>
              <TableCell align="center">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plate?.map((plata) => (
              <TableRow key={plata.id}>
                <TableCell>
                  {plata.zaposleni ? `${plata.zaposleni.ime} ${plata.zaposleni.prezime}` : 'Nepoznato'}
                </TableCell>
                <TableCell>{plata.period}</TableCell>
                <TableCell align="right">{plata.osnovna.toLocaleString()}</TableCell>
                <TableCell align="right">{plata.bonusi.toLocaleString()}</TableCell>
                <TableCell align="right">{plata.otkazi.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {plata.neto.toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(plata.datumKreiranja).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleView(plata)} color="info">
                    <ViewIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(plata)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(plata.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog za kreiranje/editovanje */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPlata ? 'Edituj platu' : 'Dodaj novu platu'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="zaposleniId"
                  control={control}
                  defaultValue={0}
                  rules={{ required: 'Zaposleni je obavezan', min: { value: 1, message: 'Molimo izaberite zaposlenog' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Zaposleni"
                      fullWidth
                      margin="normal"
                      error={!!errors.zaposleniId}
                      helperText={errors.zaposleniId?.message}
                    >
                      <MenuItem value={0} disabled>
                        -- Izaberite zaposlenog --
                      </MenuItem>
                      {zaposleni?.map((z) => (
                        <MenuItem key={z.id} value={z.id}>
                          {`${z.ime} ${z.prezime} - ${z.pozicija}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="period"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Period je obavezan' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Period (npr. 2025-01)"
                      fullWidth
                      margin="normal"
                      placeholder="2025-01"
                      error={!!errors.period}
                      helperText={errors.period?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="osnovna"
                  control={control}
                  defaultValue={0}
                  rules={{ 
                    required: 'Osnovna plata je obavezna',
                    min: { value: 0, message: 'Osnovna plata ne može biti negativna' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Osnovna plata"
                      type="number"
                      fullWidth
                      margin="normal"
                      error={!!errors.osnovna}
                      helperText={errors.osnovna?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="bonusi"
                  control={control}
                  defaultValue={0}
                  rules={{ 
                    min: { value: 0, message: 'Bonusi ne mogu biti negativni' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Bonusi"
                      type="number"
                      fullWidth
                      margin="normal"
                      error={!!errors.bonusi}
                      helperText={errors.bonusi?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="otkazi"
                  control={control}
                  defaultValue={0}
                  rules={{ 
                    min: { value: 0, message: 'Otkazi ne mogu biti negativni' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Otkazi"
                      type="number"
                      fullWidth
                      margin="normal"
                      error={!!errors.otkazi}
                      helperText={errors.otkazi?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="napomene"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Napomene"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Otkaži</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingPlata ? 'Sačuvaj' : 'Dodaj'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog za pregled */}
      <Dialog open={!!viewingPlata} onClose={() => setViewingPlata(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalji plate</DialogTitle>
        <DialogContent>
          {viewingPlata && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {viewingPlata.zaposleni ? `${viewingPlata.zaposleni.ime} ${viewingPlata.zaposleni.prezime}` : 'Nepoznato'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Period:</strong> {viewingPlata.period}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Datum kreiranja:</strong> {new Date(viewingPlata.datumKreiranja).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Osnovna plata:</strong> {viewingPlata.osnovna.toLocaleString()} RSD</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Bonusi:</strong> {viewingPlata.bonusi.toLocaleString()} RSD</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Otkazi:</strong> {viewingPlata.otkazi.toLocaleString()} RSD</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Neto plata:</strong> <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{viewingPlata.neto.toLocaleString()} RSD</span></Typography>
              </Grid>
              {viewingPlata.napomene && (
                <Grid item xs={12}>
                  <Typography><strong>Napomene:</strong></Typography>
                  <Typography variant="body2" sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    {viewingPlata.napomene}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingPlata(null)}>Zatvori</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Plate;