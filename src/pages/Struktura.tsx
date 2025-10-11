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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Collapse,
  IconButton,
  Fade,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Tooltip,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccountTree as TreeIcon,
  Business as CompanyIcon,
  Colorize as ColorIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  CorporateFare as CorporateIcon,
  WorkOutline as WorkIcon,
  Domain as DomainIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import strukturaService, { OrgChartNode, Pozicija, Odsek } from '../services/strukturaService';
import { zaposleniService } from '../services/zaposleniService';
import LoadingSpinner from '../components/LoadingSpinner';

// 🎨 Tipovi za komponentu
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface EmployeeNodeProps {
  node: OrgChartNode;
  level: number;
  onEditEmployee?: (employee: OrgChartNode) => void;
}

interface PozicijaFormData {
  naziv: string;
  opis: string;
  nivo: number;
  boja: string;
}

interface OdsekFormData {
  naziv: string;
  opis: string;
  lokacija: string;
  boja: string;
  budzetKod?: string;
}

// 🏢 TabPanel komponenta
function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`struktura-tabpanel-${index}`}
      aria-labelledby={`struktura-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `struktura-tab-${index}`,
    'aria-controls': `struktura-tabpanel-${index}`,
  };
}

// 👤 EmployeeNode komponenta za hijerarhijski prikaz
function EmployeeNode({ node, level, onEditEmployee }: EmployeeNodeProps) {
  const [expanded, setExpanded] = useState(level < 3);

  const getInitials = (ime: string, prezime: string) => {
    return `${ime.charAt(0)}${prezime.charAt(0)}`.toUpperCase();
  };

  const getBorderColor = () => {
    if (node.pozicijaBoja) return node.pozicijaBoja;
    return strukturaService.getDefaultColorForLevel(node.pozicijaNivo);
  };

  const hasSubordinates = node.podredjeni && node.podredjeni.length > 0;

  return (
    <Fade in timeout={300}>
      <Box sx={{ ml: level * 3, mb: 2 }}>
        <Card
          elevation={3}
          sx={{
            position: 'relative',
            borderLeft: `5px solid ${getBorderColor()}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6,
            },
            opacity: node.isActive ? 1 : 0.6,
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                src={node.avatarUrl}
                sx={{
                  bgcolor: getBorderColor(),
                  width: 48,
                  height: 48,
                  border: '2px solid white',
                  boxShadow: 2,
                }}
              >
                {getInitials(node.ime, node.prezime)}
              </Avatar>
            }
            title={
              <Typography variant="h6" fontWeight="bold">
                {node.punoIme}
              </Typography>
            }
            subheader={
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<WorkIcon />}
                  label={node.pozicija}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {node.odsek && (
                  <Chip
                    icon={<DomainIcon />}
                    label={node.odsek}
                    size="small"
                    variant="filled"
                    sx={{ bgcolor: getBorderColor(), color: 'white' }}
                  />
                )}
                <Chip
                  label={strukturaService.getLevelLabel(node.pozicijaNivo)}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              </Stack>
            }
            action={
              hasSubordinates && (
                <Tooltip title={expanded ? 'Sakrij podređene' : 'Prikaži podređene'}>
                  <IconButton
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Tooltip>
              )
            }
          />
          
          <CardContent sx={{ pt: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                📧 {node.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📅 {new Date(node.datumZaposlenja).toLocaleDateString('sr-RS')}
              </Typography>
              {!node.isActive && (
                <Chip label="Neaktivan" size="small" color="error" variant="outlined" />
              )}
            </Stack>
            
            {hasSubordinates && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  👥 {node.podredjeni.length} podređen{node.podredjeni.length === 1 ? '' : 'ih'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {hasSubordinates && (
          <Collapse in={expanded} timeout={300}>
            <Box sx={{ mt: 2, pl: 2 }}>
              {node.podredjeni.map((subordinate) => (
                <EmployeeNode
                  key={subordinate.id}
                  node={subordinate}
                  level={level + 1}
                  onEditEmployee={onEditEmployee}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    </Fade>
  );
}

// 🏗️ Glavna Struktura komponenta
export default function Struktura() {
  const [activeTab, setActiveTab] = useState(0);
  const [pozicijaDialog, setPozicijaDialog] = useState(false);
  const [odsekDialog, setOdsekDialog] = useState(false);
  const [editingPozicija, setEditingPozicija] = useState<Pozicija | null>(null);
  const [editingOdsek, setEditingOdsek] = useState<Odsek | null>(null);
  const [pozicijaForm, setPozicijaForm] = useState<PozicijaFormData>({
    naziv: '',
    opis: '',
    nivo: 5,
    boja: '#95a5a6',
  });
  const [odsekForm, setOdsekForm] = useState<OdsekFormData>({
    naziv: '',
    opis: '',
    lokacija: '',
    boja: '#3498db',
    budzetKod: '',
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const theme = useTheme();
  const queryClient = useQueryClient();

  // 📊 Queries
  const {
    data: orgChart,
    isLoading: orgChartLoading,
    error: orgChartError,
  } = useQuery({
    queryKey: ['organizationalChart'],
    queryFn: strukturaService.getOrganizationChart,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: pozicije,
    isLoading: pozicijeLoading,
    error: pozicijeError,
  } = useQuery({
    queryKey: ['pozicije'],
    queryFn: strukturaService.getPozicije,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: odseci,
    isLoading: odseciLoading,
    error: odseciError,
  } = useQuery({
    queryKey: ['odseci'],
    queryFn: strukturaService.getOdseci,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: zaposleni,
    isLoading: zaposleniLoading,
    error: zaposleniError,
  } = useQuery({
    queryKey: ['zaposleni'],
    queryFn: zaposleniService.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // 🔄 Mutations za pozicije
  const createPozicijaMutation = useMutation({
    mutationFn: strukturaService.createPozicija,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pozicije'] });
      handleClosePozicijaDialog();
    },
  });

  const updatePozicijaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Pozicija, 'id' | 'datumKreiranja' | 'isActive'> }) =>
      strukturaService.updatePozicija(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pozicije'] });
      handleClosePozicijaDialog();
    },
  });

  const deletePozicijaMutation = useMutation({
    mutationFn: strukturaService.deletePozicija,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pozicije'] });
    },
  });

  // 🔄 Mutations za odseke
  const createOdsekMutation = useMutation({
    mutationFn: strukturaService.createOdsek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odseci'] });
      handleCloseOdsekDialog();
    },
  });

  const updateOdsekMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Odsek, 'id' | 'datumKreiranja' | 'isActive'> }) =>
      strukturaService.updateOdsek(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odseci'] });
      handleCloseOdsekDialog();
    },
  });

  const deleteOdsekMutation = useMutation({
    mutationFn: strukturaService.deleteOdsek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odseci'] });
    },
  });

  // 🎛️ Handlers
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Pozicije handlers
  const handleOpenPozicijaDialog = (pozicija?: Pozicija) => {
    if (pozicija) {
      setEditingPozicija(pozicija);
      setPozicijaForm({
        naziv: pozicija.naziv,
        opis: pozicija.opis || '',
        nivo: pozicija.nivo,
        boja: pozicija.boja || strukturaService.getDefaultColorForLevel(pozicija.nivo),
      });
    } else {
      setEditingPozicija(null);
      setPozicijaForm({
        naziv: '',
        opis: '',
        nivo: 5,
        boja: '#95a5a6',
      });
    }
    setPozicijaDialog(true);
  };

  const handleClosePozicijaDialog = () => {
    setPozicijaDialog(false);
    setEditingPozicija(null);
    setPozicijaForm({ naziv: '', opis: '', nivo: 5, boja: '#95a5a6' });
  };

  const handleSavePozicija = () => {
    if (editingPozicija) {
      updatePozicijaMutation.mutate({
        id: editingPozicija.id,
        data: pozicijaForm,
      });
    } else {
      createPozicijaMutation.mutate(pozicijaForm);
    }
  };

  const handleDeletePozicija = (pozicija: Pozicija) => {
    if (window.confirm(`Da li ste sigurni da želite da obrišete poziciju "${pozicija.naziv}"?`)) {
      deletePozicijaMutation.mutate(pozicija.id);
    }
  };

  // Odseci handlers
  const handleOpenOdsekDialog = (odsek?: Odsek) => {
    if (odsek) {
      setEditingOdsek(odsek);
      setOdsekForm({
        naziv: odsek.naziv,
        opis: odsek.opis || '',
        lokacija: odsek.lokacija || '',
        boja: odsek.boja || '#3498db',
        budzetKod: odsek.budzetKod || '',
      });
    } else {
      setEditingOdsek(null);
      setOdsekForm({
        naziv: '',
        opis: '',
        lokacija: '',
        boja: '#3498db',
        budzetKod: '',
      });
    }
    setOdsekDialog(true);
  };

  const handleCloseOdsekDialog = () => {
    setOdsekDialog(false);
    setEditingOdsek(null);
    setOdsekForm({ naziv: '', opis: '', lokacija: '', boja: '#3498db', budzetKod: '' });
  };

  const handleSaveOdsek = () => {
    if (editingOdsek) {
      updateOdsekMutation.mutate({
        id: editingOdsek.id,
        data: odsekForm,
      });
    } else {
      createOdsekMutation.mutate(odsekForm);
    }
  };

  const handleDeleteOdsek = (odsek: Odsek) => {
    if (window.confirm(`Da li ste sigurni da želite da obrišete odsek "${odsek.naziv}"?`)) {
      deleteOdsekMutation.mutate(odsek.id);
    }
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newViewMode: 'list' | 'grid') => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // 🎨 Render funkcije
  const renderOrgChart = () => {
    if (orgChartLoading || zaposleniLoading) {
      return (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (orgChartError || zaposleniError) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          Greška pri učitavanju organizacione strukture:
          {orgChartError?.message || zaposleniError?.message}
        </Alert>
      );
    }

    if (!orgChart || orgChart.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <TreeIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nema podataka o organizacionoj strukturi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {!zaposleni || zaposleni.length === 0
              ? 'Nema zaposlenih u sistemu.'
              : 'Struktura nije definisana ili zaposleni nemaju dodeljene pozicije.'}
          </Typography>
        </Paper>
      );
    }

    const topLevelEmployees = orgChart.filter((emp) => !emp.nadredjeniId);

    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TreeIcon color="primary" />
          Organizaciona struktura ({orgChart.length} zaposlenih)
        </Typography>
        
        {topLevelEmployees.map((employee) => (
          <EmployeeNode key={employee.id} node={employee} level={0} />
        ))}
      </Box>
    );
  };

  // Skraćena verzija Pozicije - samo osnovni prikaz
  const renderPozicijeContent = () => {
    if (pozicijeLoading) {
      return <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenPozicijaDialog()}
            sx={{ mb: 2 }}
          >
            Dodaj poziciju
          </Button>
        </Grid>
        {pozicije?.map((pozicija) => (
          <Grid item xs={12} sm={6} md={4} key={pozicija.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6">{pozicija.naziv}</Typography>
                <Typography variant="body2" color="text.secondary">{pozicija.opis || '-'}</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Chip 
                    label={strukturaService.getLevelLabel(pozicija.nivo)} 
                    size="small" 
                    color="primary" 
                  />
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenPozicijaDialog(pozicija)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeletePozicija(pozicija)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Skraćena verzija Odseci - samo osnovni prikaz
  const renderOdseciContent = () => {
    if (odseciLoading) {
      return <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenOdsekDialog()}
            sx={{ mb: 2 }}
          >
            Dodaj odsek
          </Button>
        </Grid>
        {odseci?.map((odsek) => (
          <Grid item xs={12} sm={6} md={4} key={odsek.id}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6">{odsek.naziv}</Typography>
                <Typography variant="body2" color="text.secondary">{odsek.opis || '-'}</Typography>
                <Typography variant="caption">📍 {odsek.lokacija || 'Lokacija nije definisana'}</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Box 
                    sx={{ width: 20, height: 20, bgcolor: odsek.boja, borderRadius: '50%' }}
                  />
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenOdsekDialog(odsek)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteOdsek(odsek)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
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
        🏢 Struktura Upravljanje
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
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="struktura tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
              }
            }}
          >
            <Tab 
              label="🌳 Organizaciona Struktura" 
              {...a11yProps(0)} 
              icon={<TreeIcon />}
              iconPosition="start"
            />
            <Tab 
              label="💼 Pozicije" 
              {...a11yProps(1)}
              icon={<WorkIcon />}
              iconPosition="start"
            />
            <Tab 
              label="🏛️ Odseci" 
              {...a11yProps(2)}
              icon={<DomainIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          {renderOrgChart()}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {renderPozicijeContent()}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {renderOdseciContent()}
        </TabPanel>
      </Paper>

      {/* Pozicija Dialog */}
      <Dialog open={pozicijaDialog} onClose={handleClosePozicijaDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPozicija ? 'Uredi poziciju' : 'Nova pozicija'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Naziv pozicije"
            fullWidth
            variant="outlined"
            value={pozicijaForm.naziv}
            onChange={(e) => setPozicijaForm({ ...pozicijaForm, naziv: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Opis"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={pozicijaForm.opis}
            onChange={(e) => setPozicijaForm({ ...pozicijaForm, opis: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Nivo</InputLabel>
            <Select
              value={pozicijaForm.nivo}
              label="Nivo"
              onChange={(e) => setPozicijaForm({ ...pozicijaForm, nivo: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map((nivo) => (
                <MenuItem key={nivo} value={nivo}>
                  {strukturaService.getLevelLabel(nivo)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Boja (hex kod)"
            fullWidth
            variant="outlined"
            value={pozicijaForm.boja}
            onChange={(e) => setPozicijaForm({ ...pozicijaForm, boja: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePozicijaDialog}>Otkaži</Button>
          <Button onClick={handleSavePozicija} variant="contained">
            {editingPozicija ? 'Sačuvaj' : 'Dodaj'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Odsek Dialog */}
      <Dialog open={odsekDialog} onClose={handleCloseOdsekDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingOdsek ? 'Uredi odsek' : 'Novi odsek'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Naziv odseka"
            fullWidth
            variant="outlined"
            value={odsekForm.naziv}
            onChange={(e) => setOdsekForm({ ...odsekForm, naziv: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Opis"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={odsekForm.opis}
            onChange={(e) => setOdsekForm({ ...odsekForm, opis: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Lokacija"
            fullWidth
            variant="outlined"
            value={odsekForm.lokacija}
            onChange={(e) => setOdsekForm({ ...odsekForm, lokacija: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Budžet kod"
            fullWidth
            variant="outlined"
            value={odsekForm.budzetKod}
            onChange={(e) => setOdsekForm({ ...odsekForm, budzetKod: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Boja (hex kod)"
            fullWidth
            variant="outlined"
            value={odsekForm.boja}
            onChange={(e) => setOdsekForm({ ...odsekForm, boja: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOdsekDialog}>Otkaži</Button>
          <Button onClick={handleSaveOdsek} variant="contained">
            {editingOdsek ? 'Sačuvaj' : 'Dodaj'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}