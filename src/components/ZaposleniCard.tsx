import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { Zaposleni } from '../../types';

interface ZaposleniCardProps {
  zaposleni: Zaposleni;
  onEdit: (zaposleni: Zaposleni) => void;
  onDelete: (id: number) => void;
  onView: (zaposleni: Zaposleni) => void;
}

const ZaposleniCard: React.FC<ZaposleniCardProps> = ({
  zaposleni,
  onEdit,
  onDelete,
  onView,
}) => {
  const getInitials = (ime: string, prezime: string) => {
    return `${ime.charAt(0).toUpperCase()}${prezime.charAt(0).toUpperCase()}`;
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#00796b'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{ 
              bgcolor: getAvatarColor(zaposleni.ime + zaposleni.prezime),
              width: 56,
              height: 56,
              mr: 2
            }}
          >
            {getInitials(zaposleni.ime, zaposleni.prezime)}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h6" component="div">
              {zaposleni.punoIme || `${zaposleni.ime} ${zaposleni.prezime}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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

        <Box mb={2}>
          <Box display="flex" alignItems="center" mb={1}>
            <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {zaposleni.email}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {zaposleni.brojTelefon}
            </Typography>
          </Box>
          {zaposleni.odsek && (
            <Typography variant="body2" color="text.secondary">
              Odsek: {zaposleni.odsek.naziv}
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" mt="auto">
          <Typography variant="body2" color="text.secondary">
            Godine: {zaposleni.godine || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(zaposleni.datumZaposlenja).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <Box p={1} borderTop={1} borderColor="divider">
        <Box display="flex" justifyContent="center" gap={1}>
          <Tooltip title="Prikaži detalje">
            <IconButton size="small" onClick={() => onView(zaposleni)} color="info">
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Uredi">
            <IconButton size="small" onClick={() => onEdit(zaposleni)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Obriši">
            <IconButton
              size="small"
              onClick={() => onDelete(zaposleni.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default ZaposleniCard;
