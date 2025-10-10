import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
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
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import strukturaService, { OrgChartNode, Pozicija } from '../services/strukturaService';
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

// 👤 EmployeeNode komponenta za hijerarhijski prikaz
function EmployeeNode({ node, level, onEditEmployee }: EmployeeNodeProps) {
  const [expanded, setExpanded] = useState(level < 3); // Auto-expand prva 3 nivoa

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
                  icon={<CompanyIcon />}
                  label={node.pozicija}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {node.odsek && (
                  <Chip
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

        {/* Hijerarhijski prikaz podređenih */}
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
  const [editingPozicija, setEditingPozicija] = useState<Pozicija | null>(null);
  const [pozicijaForm, setPozicijaForm] = useState<PozicijaFormData>({
    naziv: '',
    opis: '',
    nivo: 5,
    boja: '#95a5a6',
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // 📋 Dodato za view toggle

  const queryClient = useQueryClient();

  // 📊 Query za org chart
  const {
    data: orgChart,
    isLoading: orgChartLoading,
    error: orgChartError,
  } = useQuery({
    queryKey: ['organizationalChart'],
    queryFn: strukturaService.getOrganizationChart,
    staleTime: 5 * 60 * 1000, // 5 minuta
  });

  // 📋 Query za pozicije
  const {
    data: pozicije,
    isLoading: pozicijeLoading,
    error: pozicijeError,
  } = useQuery({
    queryKey: ['pozicije'],
    queryFn: strukturaService.getPozicije,
    staleTime: 5 * 60 * 1000,
  });

  // 📊 Query za sve zaposlene
  const {
    data: zaposleni,
    isLoading: zaposleniLoading,
    error: zaposleniError,
  } = useQuery({
    queryKey: ['zaposleni'],
    queryFn: zaposleniService.getAll,
    staleTime: 5 * 60 * 1000,
  });

  // ➕ Mutation za kreiranje pozicije
  const createPozicijaMutation = useMutation({
    mutationFn: strukturaService.createPozicija,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pozicije'] });
      handleClosePozicijaDialog();
    },
  });

  // ✏️ Mutation za ažuriranje pozicije
  const updatePozicijaMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Pozicija, 'id' | 'datumKreiranja' | 'isActive'> }) =>
      strukturaService.updatePozicija(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pozicije'] });
      handleClosePozicijaDialog();
    },
  });

  // 🗑️ Mutation za brisanje pozicije
  const deletePozicijaMutation = useMutation({
    mutationFn: strukturaService.deletePozicija,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pozicije'] });
    },
  });

  // 🎛️ Handlers
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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

  // 🗑️ Handler za brisanje pozicije
  const handleDeletePozicija = (pozicija: Pozicija) => {
    if (window.confirm(`Da li ste sigurni da želite da obrišete poziciju "${pozicija.naziv}"?`)) {
      deletePozicijaMutation.mutate(pozicija.id);
    }
  };

  // 📋 Handler za view mode toggle
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

  // 📋 Render List View za pozicije
  const renderPozicijeListView = () => {
    if (!pozicije || pozicije.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nema definisanih pozicija
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell><strong>Naziv pozicije</strong></TableCell>
              <TableCell><strong>Opis</strong></TableCell>
              <TableCell><strong>Nivo</strong></TableCell>
              <TableCell><strong>Boja</strong></TableCell>
              <TableCell align="center"><strong>Datum kreiranja</strong></TableCell>
              <TableCell align="center"><strong>Akcije</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pozicije.map((pozicija) => (
              <TableRow key={pozicija.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {pozicija.naziv}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {pozicija.opis || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={strukturaService.getLevelLabel(pozicija.nivo)}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: pozicija.boja || strukturaService.getDefaultColorForLevel(pozicija.nivo),
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {pozicija.boja || 'Default'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {new Date(pozicija.datumKreiranja).toLocaleDateString('sr-RS')}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="Uredi poziciju">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenPozicijaDialog(pozicija)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Obriši poziciju">
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePozicija(pozicija)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // 🃏 Render Grid View za pozicije (postojeći)
  const renderPozicijeGridView = () => {
    if (!pozicije || pozicije.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nema definisanih pozicija
          </Typography>
        </Paper>
      );
    }

    return (
      <Grid container spacing={2}>
        {pozicije.map((pozicija) => (
          <Grid item xs={12} sm={6} md={4} key={pozicija.id}>
            <Card
              elevation={2}
              sx={{
                borderLeft: `5px solid ${pozicija.boja || strukturaService.getDefaultColorForLevel(pozicija.nivo)}`,
                '&:hover': { boxShadow: 4 },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h3">
                    {pozicija.naziv}
                  </Typography>
                  <Box>
                    <Tooltip title="Uredi poziciju">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenPozicijaDialog(pozicija)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Obriši poziciju">
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePozicija(pozicija)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                {pozicija.opis && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {pozicija.opis}
                  </Typography>
                )}
                
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={strukturaService.getLevelLabel(pozicija.nivo)}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    icon={<ColorIcon />}
                    label={pozicija.boja || 'Default'}
                    size="small"
                    sx={{
                      bgcolor: pozicija.boja || strukturaService.getDefaultColorForLevel(pozicija.nivo),
                      color: 'white',
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderPozicijeManagement = () => {
    if (pozicijeLoading) {
      return <LoadingSpinner />;
    }

    if (pozicijeError) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          Greška pri učitavanju pozicija: {pozicijeError.message}
        </Alert>
      );
    }

    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Upravljanje pozicijama</Typography>
          <Box display="flex" gap={2} alignItems="center">
            {/* 📋 View Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="list" aria-label="list view">
                <Tooltip title="Lista">
                  <ListIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid view">
                <Tooltip title="Kartice">
                  <GridIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenPozicijaDialog()}
            >
              Dodaj poziciju
            </Button>
          </Box>
        </Box>

        {/* 📋 Conditional rendering based on view mode */}
        {viewMode === 'list' ? renderPozicijeListView() : renderPozicijeGridView()}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="struktura tabs"
          variant="fullWidth"
        >
          <Tab
            icon={<TreeIcon />}
            iconPosition="start"
            label="Organizaciona struktura"
            id="struktura-tab-0"
            aria-controls="struktura-tabpanel-0"
          />
          <Tab
            icon={<CompanyIcon />}
            iconPosition="start"
            label="Upravljanje pozicijama"
            id="struktura-tab-1"
            aria-controls="struktura-tabpanel-1"
          />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        {renderOrgChart()}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {renderPozicijeManagement()}
      </TabPanel>

      {/* Dialog za dodavanje/editovanje pozicije */}
      <Dialog
        open={pozicijaDialog}
        onClose={handleClosePozicijaDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPozicija ? 'Uredi poziciju' : 'Dodaj novu poziciju'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Naziv pozicije"
              value={pozicijaForm.naziv}
              onChange={(e) => setPozicijaForm({ ...pozicijaForm, naziv: e.target.value })}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Opis pozicije"
              value={pozicijaForm.opis}
              onChange={(e) => setPozicijaForm({ ...pozicijaForm, opis: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Nivo pozicije</InputLabel>
              <Select
                value={pozicijaForm.nivo}
                onChange={(e) => {
                  const noviNivo = Number(e.target.value);
                  setPozicijaForm({
                    ...pozicijaForm,
                    nivo: noviNivo,
                    boja: strukturaService.getDefaultColorForLevel(noviNivo),
                  });
                }}
                label="Nivo pozicije"
              >
                {[1, 2, 3, 4, 5].map((nivo) => (
                  <MenuItem key={nivo} value={nivo}>
                    {strukturaService.getLevelLabel(nivo)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Boja pozicije"
              type="color"
              value={pozicijaForm.boja}
              onChange={(e) => setPozicijaForm({ ...pozicijaForm, boja: e.target.value })}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: pozicijaForm.boja,
                      borderRadius: '50%',
                      mr: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePozicijaDialog}>Otkaži</Button>
          <Button
            onClick={handleSavePozicija}
            variant="contained"
            disabled={
              !pozicijaForm.naziv.trim() ||
              createPozicijaMutation.isPending ||
              updatePozicijaMutation.isPending
            }
          >
            {editingPozicija ? 'Sačuvaj' : 'Dodaj'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}