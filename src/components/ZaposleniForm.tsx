import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Zaposleni, ZaposleniDto } from '../../types';
import { odsekService } from '../services/zaposleniService';
import LoadingSpinner from './LoadingSpinner';

interface ZaposleniFormData {
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  datumZaposlenja: string;
  datumRodjenja: string;
  imeOca: string;
  jmbg: string;
  adresa: string;
  brojTelefon: string;
  odsekId: number | undefined;
}

interface ZaposleniFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ZaposleniDto) => void;
  editingZaposleni?: Zaposleni | null;
  loading?: boolean;
}

const ZaposleniForm: React.FC<ZaposleniFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingZaposleni,
  loading = false,
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ZaposleniFormData>();

  const { data: odseci } = useQuery({
    queryKey: ['odseci'],
    queryFn: odsekService.getAll,
  });

  useEffect(() => {
    if (editingZaposleni) {
      reset({
        ime: editingZaposleni.ime,
        prezime: editingZaposleni.prezime,
        email: editingZaposleni.email,
        pozicija: editingZaposleni.pozicija,
        datumZaposlenja: editingZaposleni.datumZaposlenja.split('T')[0],
        datumRodjenja: editingZaposleni.datumRodjenja.split('T')[0],
        imeOca: editingZaposleni.imeOca,
        jmbg: editingZaposleni.jmbg,
        adresa: editingZaposleni.adresa,
        brojTelefon: editingZaposleni.brojTelefon,
        odsekId: editingZaposleni.odsekId,
      });
    } else {
      reset({
        ime: '',
        prezime: '',
        email: '',
        pozicija: '',
        datumZaposlenja: '',
        datumRodjenja: '',
        imeOca: '',
        jmbg: '',
        adresa: '',
        brojTelefon: '',
        odsekId: undefined,
      });
    }
  }, [editingZaposleni, reset, open]);

  const handleFormSubmit = (data: ZaposleniFormData) => {
    const zaposleniData: ZaposleniDto = {
      ...data,
      odsekId: data.odsekId || undefined,
    };
    onSubmit(zaposleniData);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {editingZaposleni ? 'Uredi zaposlenog' : 'Dodaj novog zaposlenog'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Osnovni podaci */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Osnovni podaci
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="ime"
                control={control}
                defaultValue=""
                rules={{ 
                  required: 'Ime je obavezno',
                  minLength: { value: 2, message: 'Ime mora imati najmanje 2 karaktera' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ime"
                    fullWidth
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
                defaultValue=""
                rules={{ 
                  required: 'Prezime je obavezno',
                  minLength: { value: 2, message: 'Prezime mora imati najmanje 2 karaktera' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Prezime"
                    fullWidth
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
                defaultValue=""
                rules={{
                  required: 'Email je obavezan',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Neispravna email adresa'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="pozicija"
                control={control}
                defaultValue=""
                rules={{ required: 'Pozicija je obavezna' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pozicija"
                    fullWidth
                    error={!!errors.pozicija}
                    helperText={errors.pozicija?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="odsekId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Odsek"
                    fullWidth
                    value={field.value || ''}
                  >
                    <MenuItem value="">Bez odseka</MenuItem>
                    {odseci?.map((odsek) => (
                      <MenuItem key={odsek.id} value={odsek.id}>
                        {odsek.naziv}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Lični podaci */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Lični podaci
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="datumRodjenja"
                control={control}
                defaultValue=""
                rules={{ required: 'Datum rođenja je obavezan' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Datum rođenja"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.datumRodjenja}
                    helperText={errors.datumRodjenja?.message}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0]
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="imeOca"
                control={control}
                defaultValue=""
                rules={{ required: 'Ime oca je obavezno' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ime oca"
                    fullWidth
                    error={!!errors.imeOca}
                    helperText={errors.imeOca?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="jmbg"
                control={control}
                defaultValue=""
                rules={{
                  required: 'JMBG je obavezan',
                  pattern: {
                    value: /^\d{13}$/,
                    message: 'JMBG mora imati tačno 13 cifara'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="JMBG"
                    fullWidth
                    error={!!errors.jmbg}
                    helperText={errors.jmbg?.message}
                    inputProps={{ maxLength: 13 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="adresa"
                control={control}
                defaultValue=""
                rules={{ required: 'Adresa je obavezna' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Adresa"
                    fullWidth
                    error={!!errors.adresa}
                    helperText={errors.adresa?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="brojTelefon"
                control={control}
                defaultValue=""
                rules={{ required: 'Broj telefona je obavezan' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Broj telefona"
                    fullWidth
                    error={!!errors.brojTelefon}
                    helperText={errors.brojTelefon?.message}
                  />
                )}
              />
            </Grid>

            {/* Podaci o zaposlenju */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Podaci o zaposlenju
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="datumZaposlenja"
                control={control}
                defaultValue=""
                rules={{ required: 'Datum zaposlenja je obavezan' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Datum zaposlenja"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.datumZaposlenja}
                    helperText={errors.datumZaposlenja?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Otkaži
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <Box display="flex" alignItems="center">
                <LoadingSpinner size={20} />
                <Box ml={1}>Sačuvaj</Box>
              </Box>
            ) : (
              editingZaposleni ? 'Sačuvaj izmene' : 'Dodaj zaposlenog'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ZaposleniForm;
