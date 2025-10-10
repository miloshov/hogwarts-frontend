import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import InventarLista from '../components/inventar/InventarLista';
import InventarForma from '../components/inventar/InventarForma';
import InventarStatistike from '../components/inventar/InventarStatistike';
import { InventarStavka } from '../services/inventarService';

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
      id={`inventar-tabpanel-${index}`}
      aria-labelledby={`inventar-tab-${index}`}
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
    id: `inventar-tab-${index}`,
    'aria-controls': `inventar-tabpanel-${index}`,
  };
}

const InventarPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedStavka, setSelectedStavka] = useState<InventarStavka | null>(null);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue !== 1) {
      setSelectedStavka(null); // Resetuj selekciju kada nije forma tab
    }
  };

  const handleStavkaCreated = () => {
    setRefreshKey(prev => prev + 1); // Refresh lista
    setTabValue(0); // Vrati na listu
    setSelectedStavka(null);
  };

  const handleStavkaUpdated = () => {
    setRefreshKey(prev => prev + 1); // Refresh lista
    setTabValue(0); // Vrati na listu
    setSelectedStavka(null);
  };

  const handleEditStavka = (stavka: InventarStavka) => {
    setSelectedStavka(stavka);
    setTabValue(1); // Prebaci na formu
  };

  const handleAddNew = () => {
    setSelectedStavka(null);
    setTabValue(1); // Prebaci na formu
  };

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
        🏰 Inventar Upravljanje
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
            aria-label="inventar tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
              }
            }}
          >
            <Tab 
              label="📋 Lista Inventara" 
              {...a11yProps(0)} 
              icon={<span>📋</span>}
              iconPosition="start"
            />
            <Tab 
              label={selectedStavka ? "✏️ Uredi Stavku" : "➕ Dodaj Stavku"} 
              {...a11yProps(1)}
              icon={selectedStavka ? <span>✏️</span> : <span>➕</span>}
              iconPosition="start"
            />
            <Tab 
              label="📊 Statistike" 
              {...a11yProps(2)}
              icon={<span>📊</span>}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <InventarLista 
            key={refreshKey}
            onEditStavka={handleEditStavka}
            onAddNew={handleAddNew}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <InventarForma 
            stavka={selectedStavka}
            onStavkaCreated={handleStavkaCreated}
            onStavkaUpdated={handleStavkaUpdated}
            onCancel={() => setTabValue(0)}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <InventarStatistike key={refreshKey} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default InventarPage;