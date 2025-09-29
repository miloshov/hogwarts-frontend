import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 60, 
  message = 'Učitavanje...',
  fullHeight = true 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={fullHeight ? "100vh" : "auto"}
      py={fullHeight ? 0 : 2}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant={size > 30 ? "h6" : "body2"} sx={{ mt: size > 30 ? 2 : 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
