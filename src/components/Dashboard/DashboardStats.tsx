import React from 'react';
import {
  Box,
  Grid,
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  BeachAccess as VacationIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { DashboardStatistics } from '../../types/dashboard';
import StatCard from './StatCard';

interface DashboardStatsProps {
  statistics?: DashboardStatistics;
  loading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  statistics,
  loading = false,
}) => {
  const stats = [
    {
      title: 'Ukupno zaposlenih',
      value: statistics?.ukupnoZaposlenih || 0,
      icon: <PeopleIcon />,
      color: '#1976d2',
      subtitle: 'Aktivni zaposleni'
    },
    {
      title: 'Aktivni odseci',
      value: statistics?.ukupnoOdseka || 0,
      icon: <BusinessIcon />,
      color: '#388e3c',
      subtitle: 'Organizacione jedinice'
    },
    {
      title: 'Ukupne plate',
      value: statistics?.ukupneMesecnePlate || 0,
      icon: <MoneyIcon />,
      color: '#f57c00',
      format: 'currency' as const,
      subtitle: 'Mesečni troškovi'
    },
    {
      title: 'Prosečna plata',
      value: statistics?.prosecnaPlata || 0,
      icon: <TrendingUpIcon />,
      color: '#7b1fa2',
      format: 'currency' as const,
      subtitle: 'Po zaposlenom'
    },
    {
      title: 'Zahtevi na čekanju',
      value: statistics?.aktivniZahtevi || 0,
      icon: <VacationIcon />,
      color: '#d32f2f',
      subtitle: 'Zahtevi za odmor'
    },
    {
      title: 'Novi zaposleni',
      value: statistics?.noviZaposleni || 0,
      icon: <PersonAddIcon />,
      color: '#00796b',
      subtitle: 'Poslednji mesec'
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <StatCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={loading}
            format={stat.format}
            subtitle={stat.subtitle}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;
