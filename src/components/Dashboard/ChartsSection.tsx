import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Skeleton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '../../types/dashboard';

interface ChartsSectionProps {
  data?: ChartData;
  loading?: boolean;
}

const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#00796b'];

const ChartsSection: React.FC<ChartsSectionProps> = ({
  data,
  loading = false,
}) => {
  const ChartSkeleton = () => (
    <Box height={300}>
      <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>
  );

  return (
    <Grid container spacing={3}>
      {/* Zaposleni po odsecima */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Zaposleni po odsecima
          </Typography>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.zaposleniPoOdsecima || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="brojZaposlenih"
                    nameKey="naziv"
                    label
                  >
                    {data?.zaposleniPoOdsecima?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Mesečne statistike */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Mesečne statistike
          </Typography>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.mesecneStatistike || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mesec" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="ukupnePlate"
                    stroke="#f57c00"
                    strokeWidth={2}
                    name="Ukupne plate (RSD)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="brojZahteva"
                    stroke="#d32f2f"
                    strokeWidth={2}
                    name="Broj zahteva"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="noviZaposleni"
                    stroke="#1976d2"
                    strokeWidth={2}
                    name="Novi zaposleni"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Distribucija plata */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Distribucija plata
          </Typography>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.platneGrupe || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grupa" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="broj" fill="#388e3c" name="Broj zaposlenih" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChartsSection;
