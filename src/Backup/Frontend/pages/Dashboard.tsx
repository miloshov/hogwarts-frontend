import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  BeachAccess as VacationIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Ukupno zaposlenih',
      value: '124',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.light',
    },
    {
      title: 'Prosečna plata',
      value: '85,000 RSD',
      icon: <MoneyIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.light',
    },
    {
      title: 'Aktivni zahtevi za odmor',
      value: '12',
      icon: <VacationIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.light',
    },
    {
      title: 'Nova obaveštenja',
      value: '5',
      icon: <NotificationsIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.light',
    },
  ];

  const recentActivities = [
    {
      text: 'Novi zaposleni: Marko Petrović - Software Developer',
      time: 'Pre 2 sata',
      type: 'info',
    },
    {
      text: 'Odobren zahtev za odmor: Ana Jovanović',
      time: 'Pre 4 sata',
      type: 'success',
    },
    {
      text: 'Isplaćene plate za decembar 2024',
      time: 'Pre 1 dan',
      type: 'success',
    },
    {
      text: 'Novi zahtev za odmor: Nikola Stojanović',
      time: 'Pre 2 dana',
      type: 'warning',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dobrodošli, {user?.ime}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Brzi pristup
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Dodaj novog zaposlenog
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kreiraj profil za novog člana tima
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Generiši izveštaj
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kreiraj mesečni ili godišnji izveštaj
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Nedavne aktivnosti
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.text}
                    secondary={activity.time}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Chip 
                    size="small" 
                    label={activity.type} 
                    color={activity.type as any}
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;