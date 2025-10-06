import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

const LoadingSpinner = ({ size = 40, message }: LoadingSpinnerProps) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={3}
      minHeight="200px"
    >
      <CircularProgress size={size} />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          mt={2} 
          textAlign="center"
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
