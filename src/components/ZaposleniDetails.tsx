import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Avatar,
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
} from '@mui/icons-material';
import { Zaposleni } from '../../types';

interface ZaposleniDetailsProps {
  zaposleni: Zaposleni | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (zaposleni: Zaposleni) => void;
}

const ZaposleniDetails: React.FC<ZaposleniDetailsProps> = ({
  zaposleni,
  open,
  onClose,
  onEdit,
}) => {
  if (!zaposleni) return null;

  const getInitials = (ime: string, prezime: string) => {
    return `${ime.charAt(0).toUpperCase()}${prezime.charAt(0).toUpperCase()}`;
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#00796b'];
    const index = name.length % colors.length;
    return colors[index];
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              bgcolor: getAvatarColor(zaposleni.ime + zaposleni.prezime),
              width: 64,
              height: 64,
              mr: 2,
            }}
          >
            {getInitials(zaposleni.ime, zaposleni.prezime)}
          </Avatar>
          <Box>
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