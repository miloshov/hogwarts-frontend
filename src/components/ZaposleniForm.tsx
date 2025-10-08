import React, { useEffect, useState } from 'react';
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
import { Zaposleni, ZaposleniDto, Pol } from '../types/types';
import { zaposleniService } from '../services/zaposleniService';
import { strukturaService } from '../services/strukturaService'; // Dodano za pozicije
import LoadingSpinner from './LoadingSpinner';
import Avatar from '../components/Avatar';
import ImageUpload from '../components/ImageUpload';
// Dodavanje pozicijId u formu podatke
interface ZaposleniFormData {
  ime: string;
  prezime: string;
  email: string;
  pozicija: string;
  pozicijaId: number | undefined; // Dodano za dropdown
  datumZaposlenja: string;
  datumRodjenja: string;
  imeOca: string;
  jmbg: string;
  adresa: string;
  brojTelefon: string;
  odsekId: number | undefined;
  pol?: Pol;
}
interface ZaposleniFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ZaposleniDto) => void;
  editingZaposleni?: Zaposleni | null;
  loading?: boolean;
  onImageUpload?: (zaposleniId: number, file: File) => void;
  imageUploadLoading?: boolean;
}
const ZaposleniForm: React.FC<ZaposleniFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingZaposleni,
  loading = false,
  onImageUpload,
  imageUploadLoading = false,
}) => {
  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm<ZaposleniFormData>();
  const [currentEmployee, setCurrentEmployee] = useState<Zaposleni | null>(null);
  
  // Watch pol for Avatar preview
  const polValue = watch('pol');

  // Query za odseke
  const { data: odseci } = useQuery({
    queryKey: ['odseci'],
    queryFn: zaposleniService.getOdseci,
  });

  // Query za pozicije
  const { data: pozicije } = useQuery({
    queryKey: ['pozicije'],
    queryFn: strukturaService.getPozicije,
  });
  useEffect(() => {
    if (editingZaposleni) {
      setCurrentEmployee(editingZaposleni);
      reset({
        ime: editingZaposleni.ime,
        prezime: editingZaposleni.prezime,
        email: editingZaposleni.email,
        pozicija: editingZaposleni.pozicija,
        pozicijaId: editingZaposleni.pozicijaId,
        datumZaposlenja: editingZaposleni.datumZaposlenja.split('T')[0],
        datumRodjenja: editingZaposleni.datumRodjenja.split('T')[0],
        imeOca: editingZaposleni.imeOca,
        jmbg: editingZaposleni.jmbg,
        adresa: editingZaposleni.adresa,
        brojTelefon: editingZaposleni.brojTelefon,
        odsekId: editingZaposleni.odsekId,
        pol: editingZaposleni.pol,
      });
    } else {
      setCurrentEmployee(null);
      reset({
        ime: '',
        prezime: '',
        email: '',
        pozicija: '',
        pozicijaId: undefined,
        datumZaposlenja: '',
        datumRodjenja: '',
        imeOca: '',
        jmbg: '',
        adresa: '',
        brojTelefon: '',
        odsekId: undefined,
        pol: undefined,
      });
    }
  }, [editingZaposleni, reset, open]);
  const handleFormSubmit = (data: ZaposleniFormData) => {
    console.log('Form data being submitted:', data); // 🔍 DEBUG
    const zaposleniData: ZaposleniDto = {
      ...data,
      odsekId: data.odsekId || undefined,
    };
    console.log('Processed data for API:', zaposleniData); // 🔍 DEBUG
    onSubmit(zaposleniData);
  };
  const handleImageUploadWrapper = (file: File) => {
    if (editingZaposleni && onImageUpload) {
      onImageUpload(editingZaposleni.id, file);
    }
  };
  const handleClose = () => {
    reset();
    setCurrentEmployee(null);
    onClose();
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingZaposleni ? 'Uredi zaposlenog' : 'Dodaj novog zaposlenog'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Profile Section */}
            {editingZaposleni && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Profilna slika
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Avatar
                      zaposleni={currentEmployee}
                      pol={polValue}
                      size={80}
                    />
                    <Box>
                      <ImageUpload
                        onUpload={handleImageUploadWrapper}
                        loading={imageUploadLoading}
                        buttonText="Promeni sliku"
                        accept="image/*"
                      />
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Podržani formati: JPG, PNG, GIF (max 5MB)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </>
            )}
            {/* Osnovni podaci */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: editingZaposleni ? 2 : 0 }}>
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
                name="pozicijaId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Pozicija"
                    fullWidth
                    value={field.value || ''}
                    error={!!errors.pozicijaId}
                    helperText={errors.pozicijaId?.message}
                  >
                    <MenuItem value="">Odaberite poziciju</MenuItem>
                    {pozicije?.map((pozicija) => (
                      <MenuItem key={pozicija.id} value={pozicija.id}>
                        {pozicija.naziv} (Nivo {pozicija.nivo})
                      </MenuItem>
                    ))}
                  </TextField>
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
                name="pol"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Pol"
                    fullWidth
                    value={field.value || ''}
                  >
                    <MenuItem value="">Odaberite pol</MenuItem>
                    <MenuItem value={Pol.Muski}>Muški</MenuItem>
                    <MenuItem value={Pol.Zenski}>Ženski</MenuItem>
                  </TextField>
                )}
              />
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
                  />
                )}
              />
            </Grid>
            {/* Kontakt informacije */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Kontakt informacije
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
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
                rules={{
                  required: 'Broj telefona je obavezan',
                  pattern: {
                    value: /^[\d\s\-\+\(\)]+$/,
                    message: 'Neispravna format broja telefona'
                  }
                }}
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
            {/* Informacije o zaposlenju */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Informacije o zaposlenju
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
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Otkaži
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <LoadingSpinner size={20} /> : null}
          >
            {loading ? 'Čuva se...' : (editingZaposleni ? 'Ažuriraj' : 'Dodaj')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default ZaposleniForm;