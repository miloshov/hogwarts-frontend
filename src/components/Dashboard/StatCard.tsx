import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactElement;
  color: string;
  loading?: boolean;
  format?: 'number' | 'currency' | 'percentage';
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  loading = false,
  format = 'number',
  subtitle,
}) => {
  const formatValue = (val: number | string, fmt: string) => {
    if (typeof val === 'string') return val;
    
    switch (fmt) {
      case 'currency':
        return val.toLocaleString('sr-RS') + ' RSD';
      case 'percentage':
        return val.toFixed(1) + '%';
      default:
        return val.toLocaleString('sr-RS');
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box flex={1}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={40} />
              {subtitle && <Skeleton variant="text" width="50%" />}
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box flex={1}>
            <Typography 
              color="text.secondary" 
              gutterBottom 
              variant="body2"
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontWeight: 'bold',
                color: 'text.primary',
                mb: subtitle ? 0.5 : 0
              }}
            >
              {formatValue(value, format)}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box 
            sx={{ 
              color,
              fontSize: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 2,
              backgroundColor: `${color}15`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;