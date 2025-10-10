import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  QrCode as QrCodeIcon,
  Assignment as AssignIcon,
  AssignmentReturn as ReturnIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import inventarService, { InventarStavka, DodeljivanjeRequest } from '../../services/inventarService';

interface InventarListaProps {
  onEditStavka: (stavka: InventarStavka) => void;
  onAddNew: () => void;
}

const InventarLista: React.FC<InventarListaProps> = ({ onEditStavka, onAddNew }) => {
  const [stavke, setStavke] = useState<InventarStavka[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStavka, setSelectedStavka] = useState<InventarStavka | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [assignKorisnikId, setAssignKorisnikId] = useState<number | ''>('');
  const [assignNapomena, setAssignNapomena] = useState('');
  const [returnNapomena, setReturnNapomena] = useState('');

  useEffect(() => {
    loadStavke();
  }, []);

  const loadStavke = async () => {
    try {
      setLoading(true);
      const data = await inventarService.getAllStavke();
      setStavke(data);
      setError(null);
    } catch (err) {
      setError('Greška pri učitavanju stavki inventara');
      console.error('Error loading inventar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStavka?.id) return;
    
    try {
      await inventarService.deleteStavka(selectedStavka.id);
      await loadStavke();
      setDeleteDialogOpen(false);
      setSelectedStavka(null);
    } catch (err) {
      setError('Greška pri brisanju stavke');
      console.error('Error deleting stavka:', err);
    }
  };

  const handleAssign = async () => {
    if (!selectedStavka?.id || !assignKorisnikId) return;
    
    try {
      const request: DodeljivanjeRequest = {
        inventarStavkaId: selectedStavka.id,
        korisnikId: assignKorisnikId as number,
        napomena: assignNapomena || undefined
      };
      
      await inventarService.dodelilStavku(request);
      await loadStavke();
      setAssignDialogOpen(false);
      setSelectedStavka(null);
      setAssignKorisnikId('');
      setAssignNapomena('');
    } catch (err) {
      setError('Greška pri dodeljivanju stavke');
      console.error('Error assigning stavka:', err);
    }
  };

  const handleReturn = async () => {
    if (!selectedStavka?.id) return;
    
    try {
      await inventarService.vratiStavku(selectedStavka.id, returnNapomena || undefined);
      await loadStavke();
      setReturnDialogOpen(false);
      setSelectedStavka(null);
      setReturnNapomena('');
    } catch (err) {
      setError('Greška pri vraćanju stavke');
      console.error('Error returning stavka:', err);
    }
  };

  const handleGenerateQR = async (stavka: InventarStavka) => {
    if (!stavka.id) return;
    
    try {
      const qrBlob = await inventarService.generateQrCode(stavka.id);
      const url = URL.createObjectURL(qrBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventar-${stavka.id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Greška pri generisanju QR koda');
      console.error('Error generating QR:', err);
    }
  };

  const getStanjeColor = (stanje: string) => {
    switch (stanje.toLowerCase()) {
      case 'novo': return 'success';
      case 'dobro': return 'primary';
      case 'zadovoljavajuce': return 'warning';
      case 'loshe': return 'error';
      default: return 'default';
    }
  };

  const filteredStavke = stavke.filter(stavka => 
    stavka.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stavka.opis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stavka.serijskiBroj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stavka.barKod?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStavke = filteredStavke.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, stavka: InventarStavka) => {
    setAnchorEl(event.currentTarget);
    setSelectedStavka(stavka);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStavka(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pretraži po nazivu, opisu, serijskom broju ili bar kodu..."
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
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddNew}
            fullWidth
            size="large"
            sx={{ py: 1.5 }}
          >
            Dodaj Novu Stavku
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Naziv</strong></TableCell>
              <TableCell><strong>Opis</strong></TableCell>
              <TableCell><strong>Stanje</strong></TableCell>
              <TableCell><strong>Serijslki Broj</strong></TableCell>
              <TableCell><strong>Vrednost</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Akcije</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStavke.map((stavka) => (
              <TableRow key={stavka.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {stavka.naziv}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {stavka.opis || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={stavka.stanje} 
                    color={getStanjeColor(stavka.stanje) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {stavka.serijskiBroj || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {stavka.trenutnaVrednost ? 
                    `${stavka.trenutnaVrednost.toLocaleString()} RSD` : '-'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={stavka.dodeljenaKorisnikuId ? 'Dodeljena' : 'Dostupna'}
                    color={stavka.dodeljenaKorisnikuId ? 'warning' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, stavka)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredStavke.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Stavki po stranici:"
      />

      {/* Akcije Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedStavka) onEditStavka(selectedStavka);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} /> Uredi
        </MenuItem>
        
        <MenuItem onClick={() => {
          if (selectedStavka) handleGenerateQR(selectedStavka);
          handleMenuClose();
        }}>
          <QrCodeIcon sx={{ mr: 1 }} /> Generiši QR
        </MenuItem>
        
        {!selectedStavka?.dodeljenaKorisnikuId ? (
          <MenuItem onClick={() => {
            setAssignDialogOpen(true);
            handleMenuClose();
          }}>
            <AssignIcon sx={{ mr: 1 }} /> Dodeli
          </MenuItem>
        ) : (
          <MenuItem onClick={() => {
            setReturnDialogOpen(true);
            handleMenuClose();
          }}>
            <ReturnIcon sx={{ mr: 1 }} /> Vrati
          </MenuItem>
        )}
        
        <MenuItem onClick={() => {
          setDeleteDialogOpen(true);
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Obriši
        </MenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potvrdi brisanje</DialogTitle>
        <DialogContent>
          <Typography>
            Da li ste sigurni da želite da obrišete stavku "{selectedStavka?.naziv}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Obriši
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Dodeli stavku korisniku</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Korisnik ID</InputLabel>
              <Select
                value={assignKorisnikId}
                onChange={(e) => setAssignKorisnikId(e.target.value as number)}
                label="Korisnik ID"
              >
                {/* Ovde treba dodati listu korisnika */}
                <MenuItem value={1}>Korisnik 1</MenuItem>
                <MenuItem value={2}>Korisnik 2</MenuItem>
                <MenuItem value={3}>Korisnik 3</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Napomena (opciono)"
              value={assignNapomena}
              onChange={(e) => setAssignNapomena(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleAssign} variant="contained" disabled={!assignKorisnikId}>
            Dodeli
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Vrati stavku</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Napomena (opciono)"
              value={returnNapomena}
              onChange={(e) => setReturnNapomena(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleReturn} variant="contained">
            Vrati
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventarLista;