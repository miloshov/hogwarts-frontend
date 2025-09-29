import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import DashboardStats from '../components/Dashboard/DashboardStats';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import QuickActions from '../components/Dashboard/QuickActions';
import ChartsSection from '../components/Dashboard/ChartsSection';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
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

  if (statsError) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          Greška pri učitavanju podataka za dashboard. Molimo pokušajte ponovo.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Box mb={4}>
        <DashboardStats statistics={statistics} loading={loadingStats} />
      </Box>

      {/* Quick Actions */}
      <Box mb={4}>
        <QuickActions />
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

      {/* Additional Charts Section */}
      <Box mb={4}>
        <ChartsSection data={chartsData} loading={loadingCharts} />
      </Box>
    </Box>
  );
};

export default Dashboard;
