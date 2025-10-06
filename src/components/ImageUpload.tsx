import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zaposleniService } from '../services/zaposleniService';
import { Zaposleni } from '../types';
import Avatar from './Avatar';

interface ImageUploadProps {
  zaposleni?: Zaposleni | null; // 🔧 FIX: Allow undefined/null
  onImageUpdate?: (imageUrl: string) => void;
  size?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  zaposleni,
  onImageUpdate,
  size = 100,
}) => {
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // 🔧 FIX: Early return if zaposleni is undefined
  if (!zaposleni) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Box
          width={size}
          height={size}
          borderRadius="50%"
          bgcolor="grey.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" color="text.secondary">
            Nema podataka
          </Typography>
        </Box>
      </Box>
    );
  }

  const uploadMutation = useMutation({
    mutationFn: (file: File) => zaposleniService.uploadProfileImage(zaposleni.id, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['zaposleni'] });
      queryClient.invalidateQueries({ queryKey: ['zaposleni', zaposleni.id] });
      setError('');
      onImageUpdate?.(data.imageUrl);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Greška pri uploadu slike');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => zaposleniService.deleteProfileImage(zaposleni.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zaposleni'] });
      queryClient.invalidateQueries({ queryKey: ['zaposleni', zaposleni.id] });
      setError('');
      onImageUpdate?.('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Greška pri brisanju slike');
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validacija fajla
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Dozvoljeni su samo JPEG, PNG i GIF fajlovi.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('Fajl ne sme biti veći od 5MB.');
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteClick = () => {
    if (window.confirm('Da li ste sigurni da želite da obrišete sliku?')) {
      deleteMutation.mutate();
    }
  };

  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Box position="relative">
        <Avatar 
          zaposleni={zaposleni}
          size={size}
        />
        
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(0,0,0,0.5)"
            borderRadius="50%"
          >
            <CircularProgress size={24} sx={{ color: 'white' }} />
          </Box>
        )}
      </Box>

      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PhotoCamera />}
          onClick={handleUploadClick}
          disabled={isLoading}
        >
          {/* 🔧 FIX: Safe access to profileImageUrl */}
          {zaposleni?.profileImageUrl ? 'Promeni' : 'Dodaj'}
        </Button>

        {/* 🔧 FIX: Safe access to profileImageUrl */}
        {zaposleni?.profileImageUrl && (
          <IconButton
            size="small"
            color="error"
            onClick={handleDeleteClick}
            disabled={isLoading}
            title="Obriši sliku"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default ImageUpload;