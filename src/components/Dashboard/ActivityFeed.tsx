import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  BeachAccess as VacationIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { RecentActivity } from '../../types/dashboard';

interface ActivityFeedProps {
  activities?: RecentActivity[];
  loading?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities = [],
  loading = false,
}) => {
  const getActivityIcon = (tip: string) => {
    switch (tip) {
      case 'Plata':
        return <MoneyIcon />;
      case 'Zahtev za odmor':
        return <VacationIcon />;
      case 'Novi zaposleni':
        return <PersonAddIcon />;
      default:
        return <MoneyIcon />;
    }
  };

  const getActivityColor = (tip: string) => {
    switch (tip) {
      case 'Plata':
        return '#f57c00';
      case 'Zahtev za odmor':
        return '#d32f2f';
      case 'Novi zaposleni':
        return '#00796b';
      default:
        return '#1976d2';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Juče';
    } else if (diffDays < 7) {
      return `Pre ${diffDays} dana`;
    } else {
      return date.toLocaleDateString('sr-RS');
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Nedavne aktivnosti
        </Typography>
        <List>
          {[...Array(5)].map((_, index) => (
            <ListItem key={index} divider>
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton variant="text" width="70%" />}
                secondary={<Skeleton variant="text" width="50%" />}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Nedavne aktivnosti
      </Typography>
      
      {activities.length === 0 ? (
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          height={200}
          flexDirection="column"
        >
          <Typography variant="body2" color="text.secondary">
            Nema nedavnih aktivnosti
          </Typography>
        </Box>
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {activities.map((activity) => (
            <ListItem key={`${activity.tip}-${activity.id}`} divider>
              <ListItemAvatar>
                <Avatar 
                  sx={{ 
                    bgcolor: `${getActivityColor(activity.tip)}15`,
                    color: getActivityColor(activity.tip)
                  }}
                >
                  {getActivityIcon(activity.tip)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {activity.naslov}
                    </Typography>
                    <Chip 
                      label={activity.tip} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 20,
                        borderColor: getActivityColor(activity.tip),
                        color: getActivityColor(activity.tip)
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {activity.opis}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(activity.datum)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ActivityFeed;
