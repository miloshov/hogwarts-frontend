import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Zaposleni } from '../../types';
import Avatar from '../components/Avatar';
import ImageUpload from '../components/ImageUpload';

interface ZaposleniDetailsProps {
  zaposleni: Zaposleni | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (zaposleni: Zaposleni) => void;
  onImageUpload?: (zaposleniId: number, file: File) => void;
  imageUploadLoading?: boolean;
}

const ZaposleniDetails: React.FC<ZaposleniDetailsProps> = ({
  zaposleni,
  open,
  onClose,
  onEdit,
  onImageUpload,
  imageUploadLoading = false,
}) => {
  if (!zaposleni) return null;

  const handleImageUpload = (file: File) => {
    if (onImageUpload) {
      onImageUpload(zaposleni.id, file);
    }
  };

  const InfoRow: React.FC<{ icon: React.ReactElement; label: string; value: string }> = ({
    icon,
    label,
    value,
  }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Box sx={{ mr: 2, color: 'text.secondary' }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  );

  const getPolDisplayName = (pol?: string) => {
    switch (pol) {
      case 'Muski':
        return 'Muški';
      case 'Zenski':
        return 'Ženski';
      default:
        return 'Nije specificiran';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center">
          <Avatar
            zaposleni={zaposleni}
            size={80}
          />
          <Box flexGrow={1} ml={2}>
            <Typography variant="h5" component="div">
              {zaposleni.punoIme || `${zaposleni.ime} ${zaposleni.prezime}`}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {zaposleni.pozicija}
            </Typography>
            <Chip
              label={zaposleni.isActive ? 'Aktivan' : 'Neaktivan'}
              color={zaposleni.isActive ? 'success' : 'default'}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Box>
            <ImageUpload
              onUpload={handleImageUpload}
              loading={imageUploadLoading}
              buttonText="Promeni sliku"
              accept="image/*"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Kontakt informacije
            </Typography>
            <InfoRow
              icon={<EmailIcon />}
              label="Email"
              value={zaposleni.email}
            />
            <InfoRow
              icon={<PhoneIcon />}
              label="Broj telefona"
              value={zaposleni.brojTelefon}
            />
            <InfoRow
              icon={<HomeIcon />}
              label="Adresa"
              value={zaposleni.adresa}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Lični podaci
            </Typography>
            <InfoRow
              icon={<PersonIcon />}
              label="Pol"
              value={getPolDisplayName(zaposleni.pol)}
            />
            <InfoRow
              icon={<BadgeIcon />}
              label="JMBG"
              value={zaposleni.jmbg}
            />
            <InfoRow
              icon={<CalendarIcon />}
              label="Datum rođenja"
              value={new Date(zaposleni.datumRodjenja).toLocaleDateString()}
            />
            <InfoRow
              icon={<CalendarIcon />}
              label="Godine"
              value={zaposleni.godine?.toString() || 'N/A'}
            />
            <InfoRow
              icon={<WorkIcon />}
              label="Ime oca"
              value={zaposleni.imeOca}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informacije o zaposlenju
            </Typography>
            <InfoRow
              icon={<CalendarIcon />}
              label="Datum zaposlenja"
              value={new Date(zaposleni.datumZaposlenja).toLocaleDateString()}
            />
            <InfoRow
              icon={<WorkIcon />}
              label="Odsek"
              value={zaposleni.odsek?.naziv || 'Nije dodeljen'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Sistem informacije
            </Typography>
            <InfoRow
              icon={<CalendarIcon />}
              label="Datum kreiranja"
              value={new Date(zaposleni.datumKreiranja).toLocaleDateString()}
            />
            <InfoRow
              icon={<BadgeIcon />}
              label="ID"
              value={zaposleni.id.toString()}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {onEdit && (
          <Button onClick={() => onEdit(zaposleni)} variant="outlined">
            Uredi
          </Button>
        )}
        <Button onClick={onClose} variant="contained">
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ZaposleniDetails;