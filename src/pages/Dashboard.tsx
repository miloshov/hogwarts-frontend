import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Box,
  useTheme,
  alpha,
  Alert,
  Grid
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import DashboardStats from '../components/Dashboard/DashboardStats';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import QuickActions from '../components/Dashboard/QuickActions';
import ChartsSection from '../components/Dashboard/ChartsSection';
import LoadingSpinner from '../components/LoadingSpinner';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const { data: statistics, isLoading: loadingStats, error: statsError } = useQuery({
    queryKey: ['dashboard-statistics'],
    queryFn: dashboardService.getStatistics,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: dashboardService.getRecentActivity,
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: chartsData, isLoading: loadingCharts } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: dashboardService.getChartsData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (statsError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          🏰 Dashboard Upravljanje
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          Greška pri učitavanju podataka za dashboard. Molimo pokušajte ponovo.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}
      >
        🏰 Dashboard Upravljanje
      </Typography>

      <Paper 
        elevation={3}
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(20px)'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="dashboard tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
              }
            }}
          >
            <Tab 
              label="📊 Statistike" 
              {...a11yProps(0)} 
              icon={<span>📊</span>}
              iconPosition="start"
            />
            <Tab 
              label="⚡ Brze Akcije" 
              {...a11yProps(1)}
              icon={<span>⚡</span>}
              iconPosition="start"
            />
            <Tab 
              label="📈 Analitika" 
              {...a11yProps(2)}
              icon={<span>📈</span>}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Statistics Cards */}
          <Box mb={4}>
            <DashboardStats statistics={statistics} loading={loadingStats} />
          </Box>

          {/* Activity Feed and Charts */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} lg={4}>
              <ActivityFeed activities={activities} loading={loadingActivities} />
            </Grid>
            <Grid item xs={12} lg={8}>
              <Box height="100%">
                {loadingCharts ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                    <LoadingSpinner />
                  </Box>
                ) : (
                  <ChartsSection data={chartsData} loading={loadingCharts} />
                )}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Quick Actions */}
          <QuickActions />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Charts Section */}
          <Box height="100%">
            {loadingCharts ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                <LoadingSpinner />
              </Box>
            ) : (
              <ChartsSection data={chartsData} loading={loadingCharts} />
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Dashboard;