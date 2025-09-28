import React, { useState, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Chip,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/sr';
import { zaposleniService } from '../services/zaposleniService';
import { Zaposleni } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface ZaposleniFormData {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  adresa: string;
  datumRodjenja: Dayjs | null;
  datumZaposlenja: Dayjs | null;
  pozicija: string;
  odeljenje: string;
  trenutnaPlata: number;
}

const ZaposleniPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingZaposleni, setEditingZaposleni] = useState<Zaposleni | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZaposleniFormData>({
    defaultValues: {
      ime: '',
      prezime: '',
      email: '',
      telefon: '',
      adresa: '',
      datumRodjenja: null,
      datumZaposlenja: null,
      pozicija: '',
      odeljenje: '',
      trenutnaPlata: 0,
    },
  });

  // Fetch zaposleni
  const {
    data: zaposleni = [],
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['zaposleni'],
    queryFn: zaposleniService.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: zaposleniService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zaposleni'] });
      handleCloseDialog();
      setError('');
    },
    onError: (error: any) => {
      setError('Greška pri kreiranju zaposlenog: ' + (error.response?.data?.message || error.message));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Zaposleni> }) =>
      zaposleniService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zaposleni'] });
      handleCloseDialog();
      setError('');
    },
    onError: (error: any) => {
      setError('Greška pri ažuriranju zaposlenog: ' + (error.response?.data?.message || error.message));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: zaposleniService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zaposleni'] });
    },
    onError: (error: any) => {
      setError('Greška pri brisanju zaposlenog: ' + (error.response?.data?.message || error.message));
    },
  });

  const handleOpenDialog = (zaposleni?: Zaposleni) => {
    if (zaposleni) {
      setEditingZaposleni(zaposleni);
      reset({
        ime: zaposleni.ime,
        prezime: zaposleni.prezime,
        email: zaposleni.email,
        telefon: zaposleni.telefon,
        adresa: zaposleni.adresa,
        datumRodjenja: dayjs(zaposleni.datumRodjenja),
        datumZaposlenja: dayjs(zaposleni.datumZaposlenja),
        pozicija: zaposleni.pozicija,
        odeljenje: zaposleni.odeljenje,
        trenutnaPlata: zaposleni.trenutnaPlata,
      });
    } else {
      setEditingZaposleni(null);
      reset({
        ime: '',
        prezime: '',
        email: '',
        telefon: '',
        adresa: '',
        datumRodjenja: null,
        datumZaposlenja: dayjs(),
        pozicija: '',
        odeljenje: '',
        trenutnaPlata: 0,
      });
    }
    setOpen(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingZaposleni(null);
    setError('');
  };

  const onSubmit = async (data: ZaposleniFormData) => {
    try {
      const zaposleniData = {
        ime: data.ime,
        prezime: data.prezime,
        email: data.email,
        telefon: data.telefon,
        adresa: data.adresa,
        datumRodjenja: data.datumRodjenja?.format('YYYY-MM-DD') || '',
        datumZaposlenja: data.datumZaposlenja?.format('YYYY-MM-DD') || '',
        pozicija: data.pozicija,
        odeljenje: data.odeljenje,
        trenutnaPlata: Number(data.trenutnaPlata),
      };

      if (editingZaposleni) {
        await updateMutation.mutateAsync({
          id: editingZaposleni.id,
          data: zaposleniData,
        });
      } else {
        await createMutation.mutateAsync(zaposleniData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog zaposlenog?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting zaposleni:', error);
      }
    }
  };

  // Filter zaposleni based on search term
  const filteredZaposleni = zaposleni.filter(
    (z) =>
      z.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.pozicija.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.odeljenje.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <LoadingSpinner message="Učitavanje zaposlenih..." />;

  if (fetchError) {
    return (
      <Alert severity="error">
        Greška pri učitavanju podataka: {(fetchError as any).message}
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Zaposleni
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Dodaj zaposlenog
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Pretraži zaposlene..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ime</TableCell>
                <TableCell>Prezime</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Pozicija</TableCell>
                <TableCell>Odeljenje</TableCell>
                <TableCell>Plata</TableCell>
                <TableCell>Datum zaposlenja</TableCell>
                <TableCell>Akcije</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredZaposleni.map((zaposleni) => (
                <TableRow key={zaposleni.id}>
                  <TableCell>{zaposleni.ime}</TableCell>
                  <TableCell>{zaposleni.prezime}</TableCell>
                  <TableCell>{zaposleni.email}</TableCell>
                  <TableCell>
                    <Chip label={zaposleni.pozicija} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={zaposleni.odeljenje} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(zaposleni.trenutnaPlata)}
                  </TableCell>
                  <TableCell>
                    {dayjs(zaposleni.datumZaposlenja).format('DD.MM.YYYY')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(zaposleni)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(zaposleni.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredZaposleni.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Nema pronađenih zaposlenih
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog for Add/Edit */}
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingZaposleni ? 'Izmeni zaposlenog' : 'Dodaj novog zaposlenog'}
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="ime"
                    control={control}
                    rules={{ required: 'Ime je obavezno' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ime"
                        fullWidth
                        margin="normal"
                        error={!!errors.ime}
                        helperText={errors.ime?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="prezime"
                    control={control}
                    rules={{ required: 'Prezime je obavezno' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Prezime"
                        fullWidth
                        margin="normal"
                        error={!!errors.prezime}
                        helperText={errors.prezime?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email je obavezan',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Neispravna email adresa',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="telefon"
                    control={control}
                    rules={{ required: 'Telefon je obavezan' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Telefon"
                        fullWidth
                        margin="normal"
                        error={!!errors.telefon}
                        helperText={errors.telefon?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="adresa"
                    control={control}
                    rules={{ required: 'Adresa je obavezna' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Adresa"
                        fullWidth
                        margin="normal"
                        error={!!errors.adresa}
                        helperText={errors.adresa?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="datumRodjenja"
                    control={control}
                    rules={{ required: 'Datum rođenja je obavezan' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Datum rođenja"
                        format="DD.MM.YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: !!errors.datumRodjenja,
                            helperText: errors.datumRodjenja?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="datumZaposlenja"
                    control={control}
                    rules={{ required: 'Datum zaposlenja je obavezan' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Datum zaposlenja"
                        format="DD.MM.YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: !!errors.datumZaposlenja,
                            helperText: errors.datumZaposlenja?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="pozicija"
                    control={control}
                    rules={{ required: 'Pozicija je obavezna' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pozicija"
                        fullWidth
                        margin="normal"
                        error={!!errors.pozicija}
                        helperText={errors.pozicija?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="odeljenje"
                    control={control}
                    rules={{ required: 'Odeljenje je obavezno' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Odeljenje"
                        fullWidth
                        margin="normal"
                        error={!!errors.odeljenje}
                        helperText={errors.odeljenje?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="trenutnaPlata"
                    control={control}
                    rules={{
                      required: 'Plata je obavezna',
                      min: { value: 0, message: 'Plata mora biti pozitivna' },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Trenutna plata"
                        type="number"
                        fullWidth
                        margin="normal"
                        error={!!errors.trenutnaPlata}
                        helperText={errors.trenutnaPlata?.message}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">RSD</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Otkaži</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Čuva...'
                  : editingZaposleni
                  ? 'Sačuvaj izmene'
                  : 'Dodaj zaposlenog'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ZaposleniPage;