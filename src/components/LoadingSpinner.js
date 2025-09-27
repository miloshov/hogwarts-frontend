import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Backdrop,
  useTheme
} from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Učitava...', 
  fullScreen = false,
  overlay = false,
  color = 'primary' 
}) => {
  const theme = useTheme();

  // Full screen loading (za inicijalno učitavanje aplikacije)
  if (fullScreen) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={true}
      >
        <CircularProgress 
          color="inherit" 
          size={60}
          thickness={4}
        />
        <Typography variant="h6" component="div">
          {message}
        </Typography>
      </Backdrop>
    );
  }

  // Overlay loading (za modalne ili sekcije)
  if (overlay) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
          gap: 2
        }}
      >
        <CircularProgress 
          color={color} 
          size={size}
          thickness={4}
        />
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  // Inline loading (za sadržaj stranica)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 4
      }}
    >
      <CircularProgress 
        color={color} 
        size={size}
        thickness={4}
      />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Specijalizovane varijante
export const FullScreenLoader = ({ message = 'Pokretanje aplikacije...' }) => (
  <LoadingSpinner fullScreen message={message} />
);

export const OverlayLoader = ({ message = 'Učitava...', size = 40 }) => (
  <LoadingSpinner overlay message={message} size={size} />
);

export const InlineLoader = ({ message = 'Učitava...', size = 30 }) => (
  <LoadingSpinner message={message} size={size} />
);

// Button loading spinner (za dugmad)
export const ButtonLoader = ({ size = 20 }) => (
  <CircularProgress 
    color="inherit" 
    size={size}
    thickness={4}
    sx={{ mr: 1 }}
  />
);

// Table loading komponenta
export const TableLoader = ({ rows = 5, columns = 4 }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 1,
            alignItems: 'center'
          }}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <Box
              key={colIndex}
              sx={{
                height: 24,
                flex: colIndex === 0 ? '0 0 150px' : 1,
                backgroundColor: theme.palette.grey[200],
                borderRadius: 1,
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': {
                    opacity: 1,
                  },
                  '50%': {
                    opacity: 0.5,
                  },
                  '100%': {
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default LoadingSpinner;