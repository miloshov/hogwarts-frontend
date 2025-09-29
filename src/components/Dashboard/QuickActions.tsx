import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  BeachAccess as VacationIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  action: () => void;
}

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      title: 'Dodaj zaposlenog',
      description: 'Kreiraj novi profil zaposlenog',
      icon: <AddIcon />,
      color: '#1976d2',
      action: () => navigate('/zaposleni')
    },
    {
      title: 'Upravljaj platama',
      description: 'Pregledaj i dodeli plate',
      icon: <MoneyIcon />,
      color: '#f57c00',
      action: () => navigate('/plate')
    },
    {
      title: 'Zahtevi za odmor',
      description: 'Obradi zahteve za odmor',
      icon: <VacationIcon />,
      color: '#d32f2f',
      action: () => navigate('/zahtevi-za-odmor')
    },
    {
      title: 'Izveštaji',
      description: 'Generiši HR izveštaje',
      icon: <AssessmentIcon />,
      color: '#7b1fa2',
      action: () => navigate('/dashboard') // Could navigate to reports page
    },
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Brze akcije
      </Typography>
      
      <Grid container spacing={2}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={action.action}
            >
              <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                <Box 
                  sx={{ 
                    color: action.color,
                    fontSize: '2.5rem',
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                <Button 
                  size="small" 
                  sx={{ color: action.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.action();
                  }}
                >
                  Otvori
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default QuickActions;