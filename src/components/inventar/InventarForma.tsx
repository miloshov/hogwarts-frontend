import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/sr';
import inventarService, { InventarStavka, InventarDto } from '../../services/inventarService';

// Konfiguracija srpskog jezika za DayJS
dayjs.locale('sr');

interface InventarFormaProps {
  stavka?: InventarStavka | null;
  onStavkaCreated: () => void;
  onStavkaUpdated: () => void;
  onCancel: () => void;
}

const InventarForma: React.FC<InventarFormaProps> = ({
  stavka,
  onStavkaCreated,
  onStavkaUpdated,
  onCancel
}) => {
  const [formData, setFormData] = useState<InventarDto>({
    naziv: '',
    opis: '',
    kategorijaId: 1,
    lokacijaId: 1,
    serijskiBroj: '',
    barKod: '',
    stanje: 'Novo',
    nabavnaCena: undefined,
    trenutnaVrednost: undefined,
    datumNabavke: '',
    garancijaDo: '',
    dodeljenaKorisnikuId: undefined,
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datumNabavke, setDatumNabavke] = useState<Dayjs | null>(null);
  const [garancijaDo, setGarancijaDo] = useState<Dayjs | null>(null);

  const stanjaOptions = ['Novo', 'Dobro', 'Zadovoljavajuce', 'Loshe'];
  
  // Mock data - u realnoj aplikaciji ovo bi se ucitavalo iz backend-a
  const kategorijeOptions = [
    { id: 1, naziv: 'IT Oprema' },
    { id: 2, naziv: 'Kancelarijski materijal' },
    { id: 3, naziv: 'Mobilijari' },
    { id: 4, naziv: 'Vozila' },
    { id: 5, naziv: 'Ostalo' }
  ];
  
  const lokacijeOptions = [
    { id: 1, naziv: 'Kancelarija A' },
    { id: 2, naziv: 'Kancelarija B' },
    { id: 3, naziv: 'Magacin' },
    { id: 4, naziv: 'Parking' },
    { id: 5, naziv: 'Sala za sastanke' }
  ];

  useEffect(() => {
    if (stavka) {
      setFormData({
        naziv: stavka.naziv,
        opis: stavka.opis || '',
        kategorijaId: stavka.kategorijaId,
        lokacijaId: stavka.lokacijaId,
        serijskiBroj: stavka.serijskiBroj || '',
        barKod: stavka.barKod || '',
        stanje: stavka.stanje,
        nabavnaCena: stavka.nabavnaCena,
        trenutnaVrednost: stavka.trenutnaVrednost,
        datumNabavke: stavka.datumNabavke || '',
        garancijaDo: stavka.garancijaDo || '',
        dodeljenaKorisnikuId: stavka.dodeljenaKorisnikuId,
        isActive: stavka.isActive
      });
      
      // Postavi datume pomoću DayJS
      if (stavka.datumNabavke) {
        setDatumNabavke(dayjs(stavka.datumNabavke));
      }
      if (stavka.garancijaDo) {
        setGarancijaDo(dayjs(stavka.garancijaDo));
      }
    }
  }, [stavka]);

  const handleInputChange = (field: keyof InventarDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Pripremi podatke sa datumima koristeći DayJS
      const submitData = {
        ...formData,
        datumNabavke: datumNabavke?.format('YYYY-MM-DD') || '',
        garancijaDo: garancijaDo?.format('YYYY-MM-DD') || ''
      };

      if (stavka?.id) {
        // Update postojeće stavke
        await inventarService.updateStavka(stavka.id, submitData);
        onStavkaUpdated();
      } else {
        // Kreiranje nove stavke
        await inventarService.createStavka(submitData);
        onStavkaCreated();
      }
    } catch (err) {
      setError(stavka?.id ? 'Greška pri ažuriranju stavke' : 'Greška pri kreiranju stavke');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateBarCode = () => {
    const barCode = `INV${Date.now()}`;
    handleInputChange('barKod', barCode);
  };

  const generateSerialNumber = () => {
    const serial = `SN${Date.now()}`;
    handleInputChange('serijskiBroj', serial);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        {stavka ? '✏️ Uredi Stavku' : '➕ Dodaj Novu Stavku'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Osnovne informacije */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                📝 Osnovne informacije
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Naziv stavke"
                value={formData.naziv}
                onChange={(e) => handleInputChange('naziv', e.target.value)}
                placeholder="Unesite naziv inventarske stavke"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Kategorija</InputLabel>
                <Select
                  value={formData.kategorijaId}
                  onChange={(e) => handleInputChange('kategorijaId', e.target.value as number)}
                  label="Kategorija"
                >
                  {kategorijeOptions.map((kat) => (
                    <MenuItem key={kat.id} value={kat.id}>
                      {kat.naziv}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Lokacija</InputLabel>
                <Select
                  value={formData.lokacijaId}
                  onChange={(e) => handleInputChange('lokacijaId', e.target.value as number)}
                  label="Lokacija"
                >
                  {lokacijeOptions.map((lok) => (
                    <MenuItem key={lok.id} value={lok.id}>
                      {lok.naziv}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Stanje</InputLabel>
                <Select
                  value={formData.stanje}
                  onChange={(e) => handleInputChange('stanje', e.target.value)}
                  label="Stanje"
                >
                  {stanjaOptions.map((stanje) => (
                    <MenuItem key={stanje} value={stanje}>
                      <Chip 
                        label={stanje} 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      {stanje}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Opis"
                value={formData.opis}
                onChange={(e) => handleInputChange('opis', e.target.value)}
                placeholder="Detaljan opis inventarske stavke..."
              />
            </Grid>

            {/* Identifikatori */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                🏷️ Identifikatori
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Serijski broj"
                value={formData.serijskiBroj}
                onChange={(e) => handleInputChange('serijskiBroj', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button size="small" onClick={generateSerialNumber}>
                        Generiši
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bar kod"
                value={formData.barKod}
                onChange={(e) => handleInputChange('barKod', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button size="small" onClick={generateBarCode} startIcon={<QrCodeIcon />}>
                        Generiši
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Finansijske informacije */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                💰 Finansijske informacije
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Nabavna cena"
                value={formData.nabavnaCena || ''}
                onChange={(e) => handleInputChange('nabavnaCena', e.target.value ? parseFloat(e.target.value) : undefined)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">RSD</InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Trenutna vrednost"
                value={formData.trenutnaVrednost || ''}
                onChange={(e) => handleInputChange('trenutnaVrednost', e.target.value ? parseFloat(e.target.value) : undefined)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">RSD</InputAdornment>
                }}
              />
            </Grid>

            {/* Datumi - FIKSIRAN ZA DAYJS */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                📅 Datumi
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Datum nabavke"
                  value={datumNabavke}
                  onChange={(newValue) => setDatumNabavke(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Garancija do"
                  value={garancijaDo}
                  onChange={(newValue) => setGarancijaDo(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              </Grid>
            </LocalizationProvider>

            {/* Dugmad */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={onCancel}
                  size="large"
                >
                  Otkaži
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading || !formData.naziv.trim()}
                  size="large"
                >
                  {loading ? 'Snima...' : (stavka ? 'Ažuriraj' : 'Sačuvaj')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default InventarForma;