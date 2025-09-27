import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
  Grid,
  Paper,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { InlineLoader, OverlayLoader } from '../components/LoadingSpinner';

const ZaposleniPage = () => {
  const theme = useTheme();
  
  // State management
  const [zaposleni, setZaposleni] = useState([]);
  const [skole, setSkole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkola, setFilterSkola] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZaposleni, setEditingZaposleni] = useState(null);
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: '',
    skolaId: '',
    telefon: '',
    adresa: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load data
  useEffect(() => {
    loadZaposleni();
    loadSkole();
  }, []);

  const loadZaposleni = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Zaposleni');
      if (response.ok) {
        const data = await response.json();
        setZaposleni(data);
      } else {
        throw new Error('Neuspešno učitavanje zaposlenih');
      }
    } catch (error) {
      console.error('Error loading zaposleni:', error);
      showNotification('Greška pri učitavanju zaposlenih', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSkole = async () => {
    try {
      const response = await fetch('/api/Skole');
      if (response.ok) {
        const data = await response.json();
        setSkole(data);
      }
    } catch (error) {
      console.error('Error loading skole:', error);
    }
  };

  // Filter and search logic
  const filteredZaposleni = zaposleni.filter(z => {
    const matchesSearch = 
      z.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterSkola === '' || z.skolaId.toString() === filterSkola;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const paginatedZaposleni = filteredZaposleni.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.ime.trim()) errors.ime = 'Ime je obavezno';
    if (!formData.prezime.trim()) errors.prezime = 'Prezime je obavezno';
    if (!formData.email.trim()) {
      errors.email = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Neispravna email adresa';
    }
    if (!formData.skolaId) errors.skolaId = 'Škola je obavezna';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CRUD operations
  const handleAdd = () => {
    setEditingZaposleni(null);
    setFormData({
      ime: '',
      prezime: '',
      email: '',
      skolaId: '',
      telefon: '',
      adresa: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (zaposleni) => {
    setEditingZaposleni(zaposleni);
    setFormData({
      ime: zaposleni.ime,
      prezime: zaposleni.prezime,
      email: zaposleni.email,
      skolaId: zaposleni.skolaId.toString(),
      telefon: zaposleni.telefon || '',
      adresa: zaposleni.adresa || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSaving(true);
      
      const method = editingZaposleni ? 'PUT' : 'POST';
      const url = editingZaposleni 
        ? `/api/Zaposleni/${editingZaposleni.id}`
        : '/api/Zaposleni';
      
      const payload = {
        ...formData,
        skolaId: parseInt(formData.skolaId)
      };
      
      if (editingZaposleni) {
        payload.id = editingZaposleni.id;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        await loadZaposleni();
        setIsModalOpen(false);
        showNotification(
          editingZaposleni 
            ? 'Zaposleni je uspešno ažuriran' 
            : 'Zaposleni je uspešno dodat',
          'success'
        );
      } else {
        throw new Error('Neuspešno čuvanje');
      }
    } catch (error) {
      console.error('Error saving zaposleni:', error);
      showNotification('Greška pri čuvanju zaposlenog', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovog zaposlenog?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/Zaposleni/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await loadZaposleni();
        showNotification('Zaposleni je uspešno obrisan', 'success');
      } else {
        throw new Error('Neuspešno brisanje');
      }
    } catch (error) {
      console.error('Error deleting zaposleni:', error);
      showNotification('Greška pri brisanju zaposlenog', 'error');
    }
  };

  // Utility functions
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getSkoolName = (skolaId) => {
    const skola = skole.find(s => s.id === skolaId);
    return skola ? skola.naziv : 'Nepoznata škola';
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <InlineLoader message="Učitavam zaposlene..." />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Upravljanje zaposlenima
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Ukupno zaposlenih: {filteredZaposleni.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadZaposleni}
          >
            Osveži
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Dodaj zaposlenog
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Pretraži po imenu, prezimenu ili email-u..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter po školi</InputLabel>
                <Select
                  value={filterSkola}
                  label="Filter po školi"
                  onChange={(e) => setFilterSkola(e.target.value)}
                  startAdornment={<FilterIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="">
                    <em>Sve škole</em>
                  </MenuItem>
                  {skole.map((skola) => (
                    <MenuItem key={skola.id} value={skola.id.toString()}>
                      {skola.naziv}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                Prikazano: {filteredZaposleni.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Zaposleni</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Škola</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell align="right">Akcije</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedZaposleni.map((zaposleni) => (
                <TableRow key={zaposleni.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                        {zaposleni.ime.charAt(0)}{zaposleni.prezime.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {zaposleni.ime} {zaposleni.prezime}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {zaposleni.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1, color: 'action.active', fontSize: 18 }} />
                      {zaposleni.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<SchoolIcon />}
                      label={getSkoolName(zaposleni.skolaId)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {zaposleni.telefon || '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Uredi">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(zaposleni)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Obriši">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(zaposleni.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredZaposleni.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Redova po stranici:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} od ${count !== -1 ? count : `više od ${to}`}`
          }
        />
      </Card>

      {/* Add/Edit Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => !isSaving && setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} />
            {editingZaposleni ? 'Uredi zaposlenog' : 'Dodaj novog zaposlenog'}
          </Box>
        </DialogTitle>
        <DialogContent>
          {isSaving && <OverlayLoader />}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ime"
                name="ime"
                value={formData.ime}
                onChange={handleInputChange}
                error={Boolean(formErrors.ime)}
                helperText={formErrors.ime}
                disabled={isSaving}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Prezime"
                name="prezime"
                value={formData.prezime}
                onChange={handleInputChange}
                error={Boolean(formErrors.prezime)}
                helperText={formErrors.prezime}
                disabled={isSaving}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                disabled={isSaving}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean(formErrors.skolaId)}>
                <InputLabel>Škola</InputLabel>
                <Select
                  name="skolaId"
                  value={formData.skolaId}
                  label="Škola"
                  onChange={handleInputChange}
                  disabled={isSaving}
                >
                  {skole.map((skola) => (
                    <MenuItem key={skola.id} value={skola.id.toString()}>
                      {skola.naziv}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.skolaId && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {formErrors.skolaId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefon"
                name="telefon"
                value={formData.telefon}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Adresa"
                name="adresa"
                value={formData.adresa}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setIsModalOpen(false)}
            disabled={isSaving}
          >
            Otkaži
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Čuva...' : (editingZaposleni ? 'Sačuvaj' : 'Dodaj')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ZaposleniPage;