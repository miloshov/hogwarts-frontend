import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Event as EventIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { InlineLoader } from '../components/LoadingSpinner';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      zaposleni: { total: 0, active: 0, new: 0 },
      skole: { total: 0, active: 0 },
      predmeti: { total: 0, popular: 0 }
    },
    recentActivity: [],
    notifications: []
  });

  // Simulacija učitavanja podataka
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulacija API poziva
      setTimeout(() => {
        setDashboardData({
          stats: {
            zaposleni: { total: 47, active: 43, new: 3 },
            skole: { total: 12, active: 11 },
            predmeti: { total: 28, popular: 15 }
          },
          recentActivity: [
            { id: 1, action: 'Dodao novi predmet', user: 'Marko Petrović', time: 'Pre 2 sata', type: 'create' },
            { id: 2, action: 'Ažurirao podatke zaposlenog', user: 'Ana Jovanović', time: 'Pre 4 sata', type: 'update' },
            { id: 3, action: 'Kreirao novu školu', user: 'Stefan Nikolić', time: 'Jutros', type: 'create' },
            { id: 4, action: 'Obrisao neaktivni predmet', user: 'Milica Stojanović', time: 'Juče', type: 'delete' }
          ],
          notifications: [
            { id: 1, title: 'Nova registracija', message: '3 nova zahteva za registraciju', type: 'info', urgent: false },
            { id: 2, title: 'Rezervacija učionice', message: 'Učionica A101 je rezervisana', type: 'warning', urgent: true },
            { id: 3, title: 'Sistem ažuriran', message: 'Aplikacija je uspešno ažurirana', type: 'success', urgent: false }
          ]
        });
        setIsLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  // Stat cards data
  const statCards = [
    {
      title: 'Zaposleni',
      total: dashboardData.stats.zaposleni.total,
      subtitle: `${dashboardData.stats.zaposleni.active} aktivnih`,
      change: `+${dashboardData.stats.zaposleni.new} novi`,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      onClick: () => navigate('/zaposleni')
    },
    {
      title: 'Škole',
      total: dashboardData.stats.skole.total,
      subtitle: `${dashboardData.stats.skole.active} aktivnih`,
      change: '100% dostupnost',
      icon: <SchoolIcon />,
      color: theme.palette.secondary.main,
      onClick: () => navigate('/skole')
    },
    {
      title: 'Predmeti',
      total: dashboardData.stats.predmeti.total,
      subtitle: `${dashboardData.stats.predmeti.popular} popularnih`,
      change: '+15% ovaj mesec',
      icon: <AssignmentIcon />,
      color: theme.palette.success.main,
      onClick: () => navigate('/predmeti')
    },
    {
      title: 'Performanse',
      total: '94%',
      subtitle: 'Sistemska dostupnost',
      change: '+2% od prošle nedelje',
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
      onClick: () => navigate('/settings')
    }
  ];

  // Quick actions
  const quickActions = [
    { label: 'Dodaj zaposlenog', action: () => navigate('/zaposleni?action=add'), icon: <PeopleIcon /> },
    { label: 'Kreiraj školu', action: () => navigate('/skole?action=add'), icon: <SchoolIcon /> },
    { label: 'Novi predmet', action: () => navigate('/predmeti?action=add'), icon: <AssignmentIcon /> },
    { label: 'Izveštaji', action: () => navigate('/reports'), icon: <TrendingUpIcon /> }
  ];

  const getActivityColor = (type) => {
    switch (type) {
      case 'create': return theme.palette.success.main;
      case 'update': return theme.palette.info.main;
      case 'delete': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <InlineLoader message="Učitavam dashboard..." />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dobrodošli, {user?.username || 'Admin'}! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Evo pregleda vašeg Hogwarts admin panela za danas
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
              onClick={card.onClick}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: card.color + '20', 
                      color: card.color,
                      mr: 2
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {card.total}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {card.subtitle}
                </Typography>
                <Chip 
                  label={card.change} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Brze akcije
                </Typography>
                <IconButton size="small">
                  <AddIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={action.action}
                      sx={{ 
                        py: 2,
                        textTransform: 'none',
                        justifyContent: 'flex-start'
                      }}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Nedavna aktivnost
                </Typography>
                <IconButton size="small">
                  <RefreshIcon />
                </IconButton>
              </Box>
              <List dense>
                {dashboardData.recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: getActivityColor(activity.type) + '20',
                            color: getActivityColor(activity.type)
                          }}
                        >
                          <StarIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={`${activity.user} • ${activity.time}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    {index < dashboardData.recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Obaveštenja
                </Typography>
                <Chip 
                  label={dashboardData.notifications.length} 
                  size="small" 
                  color="primary"
                />
              </Box>
              <Grid container spacing={2}>
                {dashboardData.notifications.map((notification) => (
                  <Grid item xs={12} md={4} key={notification.id}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
                        backgroundColor: notification.urgent ? theme.palette.warning.light + '10' : 'transparent'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <EventIcon 
                          sx={{ 
                            color: getNotificationColor(notification.type), 
                            mr: 1, 
                            mt: 0.5,
                            fontSize: 20 
                          }} 
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {notification.title}
                            {notification.urgent && (
                              <Chip 
                                label="Hitno" 
                                size="small" 
                                color="warning" 
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;