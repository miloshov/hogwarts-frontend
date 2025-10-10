import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  Assignment as AssignIcon,
  AssignmentReturn as ReturnIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  MonetizationOn as MoneyIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import inventarService, { InventarStavka, DodeljivanjeRequest } from '../../services/inventarService';

interface InventarDetaljiProps {
  stavkaId: number;
  onEdit: (stavka: InventarStavka) => void;
  onClose: () => void;
}

const InventarDetalji: React.FC<InventarDetaljiProps> = ({ stavkaId, onEdit, onClose }) => {
  const [stavka, setStavka] = useState<InventarStavka | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [assignKorisnikId, setAssignKorisnikId] = useState<number | ''>('');
  const [assignNapomena, setAssignNapomena] = useState('');
  const [returnNapomena, setReturnNapomena] = useState('');

  useEffect(() => {
    loadStavka();
  }, [stavkaId]);

  const loadStavka = async () => {
    try {
      setLoading(true);
      const data = await inventarService.getStavkaById(stavkaId);
      setStavka(data);
      setError(null);
    } catch (err) {
      setError('Greška pri učitavanju detalja stavke');
      console.error('Error loading stavka details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!stavka?.id) return;
    
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

  const handleAssign = async () => {
    if (!stavka?.id || !assignKorisnikId) return;
    
    try {
      const request: DodeljivanjeRequest = {
        inventarStavkaId: stavka.id,
        korisnikId: assignKorisnikId as number,
        napomena: assignNapomena || undefined
      };
      
      await inventarService.dodelilStavku(request);
      await loadStavka(); // Refresh data
      setAssignDialogOpen(false);
      setAssignKorisnikId('');
      setAssignNapomena('');
    } catch (err) {
      setError('Greška pri dodeljivanju stavke');
      console.error('Error assigning stavka:', err);
    }
  };

  const handleReturn = async () => {
    if (!stavka?.id) return;
    
    try {
      await inventarService.vratiStavku(stavka.id, returnNapomena || undefined);
      await loadStavka(); // Refresh data
      setReturnDialogOpen(false);
      setReturnNapomena('');
    } catch (err) {
      setError('Greška pri vraćanju stavke');
      console.error('Error returning stavka:', err);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return `${amount.toLocaleString('sr-RS')} RSD`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !stavka) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || 'Stavka nije pronađena'}
      </Alert>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {stavka.naziv}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => onEdit(stavka)}
          >
            Uredi
          </Button>
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon />}
            onClick={handleGenerateQR}
          >
            QR Kod
          </Button>
          {!stavka.dodeljenaKorisnikuId ? (
            <Button
              variant="contained"
              startIcon={<AssignIcon />}
              onClick={() => setAssignDialogOpen(true)}
            >
              Dodeli
            </Button>
          ) : (
            <Button
              variant="contained"
              color="warning"
              startIcon={<ReturnIcon />}
              onClick={() => setReturnDialogOpen(true)}
            >
              Vrati
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Osnovne informacije */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} /> Osnovne informacije
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Opis</Typography>
                <Typography variant="body1">{stavka.opis || 'Nema opisa'}</Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Stanje</Typography>
                <Chip 
                  label={stavka.stanje} 
                  color={getStanjeColor(stavka.stanje) as any}
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip 
                  label={stavka.dodeljenaKorisnikuId ? 'Dodeljena' : 'Dostupna'}
                  color={stavka.dodeljenaKorisnikuId ? 'warning' : 'success'}
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Serijski broj</Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {stavka.serijskiBroj || '-'}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Bar kod</Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {stavka.barKod || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Finansijske informacije */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ mr: 1 }} /> Finansijske informacije
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Nabavna cena</Typography>
                <Typography variant="h6" color="primary.main">
                  {formatCurrency(stavka.nabavnaCena)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Trenutna vrednost</Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(stavka.trenutnaVrednost)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Bočna panel */}
        <Grid item xs={12} md={4}>
          {/* Lokacija i kategorija */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <CategoryIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Kategorija"
                    secondary={`ID: ${stavka.kategorijaId}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <LocationIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Lokacija"
                    secondary={`ID: ${stavka.lokacijaId}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Datumi */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 1 }} /> Važni datumi
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Datum nabavke"
                    secondary={formatDate(stavka.datumNabavke)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Garancija do"
                    secondary={formatDate(stavka.garancijaDo)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Datum kreiranja"
                    secondary={formatDate(stavka.datumKreiranja)}
                  />
                </ListItem>
                
                {stavka.datumIzmene && (
                  <ListItem>
                    <ListItemText
                      primary="Poslednja izmena"
                      secondary={formatDate(stavka.datumIzmene)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Dodeli stavku korisniku</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Korisnik ID"
              value={assignKorisnikId}
              onChange={(e) => setAssignKorisnikId(e.target.value ? parseInt(e.target.value) : '')}
              sx={{ mb: 2 }}
            />
            
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
            <Typography sx={{ mb: 2 }}>Vraćanje stavke: <strong>{stavka.naziv}</strong></Typography>
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

export default InventarDetalji;