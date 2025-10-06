import React from 'react';
import {
  Card,
  CardContent,
  Typography,
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
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import { Zaposleni } from '../../types';
import Avatar from '../components/Avatar';
import ImageUpload from '../components/ImageUpload';

interface ZaposleniCardProps {
  zaposleni: Zaposleni;
  onEdit: (zaposleni: Zaposleni) => void;
  onDelete: (id: number) => void;
  onView: (zaposleni: Zaposleni) => void;
  onImageUpload?: (zaposleniId: number, file: File) => void;
  imageUploadLoading?: boolean;
}

const ZaposleniCard: React.FC<ZaposleniCardProps> = ({
  zaposleni,
  onEdit,
  onDelete,
  onView,
  onImageUpload,
  imageUploadLoading = false,
}) => {
  const handleImageUpload = (file: File) => {
    if (onImageUpload) {
      onImageUpload(zaposleni.id, file);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box position="relative">
            <Avatar
              zaposleni={zaposleni}
              size={56}
            />
            {onImageUpload && (
              <Box
                position="absolute"
                bottom={-4}
                right={-4}
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'background.paper',
                }}
              >
                <ImageUpload
                  onUpload={handleImageUpload}
                  loading={imageUploadLoading}
                  buttonText=""
                  accept="image/*"
                  renderAsIcon
                  iconButton={
                    <IconButton
                      size="small"
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      <CameraIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  }
                />
              </Box>
            )}
          </Box>
          <Box flexGrow={1} ml={2}>
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