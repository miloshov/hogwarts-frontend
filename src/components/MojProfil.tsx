import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  AccessTime as AccessTimeIcon,
  AccountBalance as AccountBalanceIcon,
  Inventory as InventoryIcon,
  SupervisorAccount as SupervisorIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  BeachAccess as VacationIcon,
} from '@mui/icons-material';
import { profileService, UserProfile, UpdateProfileDto, ChangePasswordDto } from '../services/profileService';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MojProfil: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [salaryHistory, setSalaryHistory] = useState<any[]>([]);
  const [vacationRequests, setVacationRequests] = useState<any[]>([]);

  // Form states
  const [editEmail, setEditEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getUserProfile();
      setProfile(profileData);
      setEditEmail(profileData.email);
    } catch (err) {
      setError('Greška pri učitavanju profila');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSalaryHistory = async () => {
    try {
      const data = await profileService.getSalaryHistory();
      setSalaryHistory(data);
    } catch (err) {
      console.error('Error loading salary history:', err);
    }
  };

  const loadVacationRequests = async () => {
    try {
      const data = await profileService.getVacationRequests();
      setVacationRequests(data);
    } catch (err) {
      console.error('Error loading vacation requests:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Load additional data when needed
    if (newValue === 3 && salaryHistory.length === 0) {
      loadSalaryHistory();
    }
    if (newValue === 4 && vacationRequests.length === 0) {
      loadVacationRequests();
    }
  };

  const handleEditProfile = async () => {
    try {
      if (!profile) return;

      const updateData: UpdateProfileDto = {};
      if (editEmail !== profile.email) {
        updateData.email = editEmail;
      }

      await profileService.updateProfile(updateData);
      await loadProfile();
      setEditDialogOpen(false);
      setError(null);
    } catch (err) {
      setError('Greška pri ažuriranju profila');
      console.error('Error updating profile:', err);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError('Lozinke se ne poklapaju');
        return;
      }

      const passwordData: ChangePasswordDto = {
        staraLozinka: oldPassword,
        novaLozinka: newPassword,
      };

      await profileService.changePassword(passwordData);
      setPasswordDialogOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      alert('Lozinka je uspešno promenjena');
    } catch (err) {
      setError('Greška pri promeni lozinke');
      console.error('Error changing password:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="warning">Profil nije pronađen</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Header with avatar and basic info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={profile.avatarUrl}
                sx={{ width: 100, height: 100 }}
              >
                {profile.punoIme.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {profile.punoIme}
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {profile.pozicijaDisplay}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {profile.odsek}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
              >
                Uredi profil
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<PersonIcon />} label="Lični podaci" />
            <Tab icon={<BusinessIcon />} label="Poslovni podaci" />
            <Tab icon={<InfoIcon />} label="Opšti podaci" />
            <Tab icon={<HistoryIcon />} label="Istorija plata" />
            <Tab icon={<VacationIcon />} label="Odmori" />
          </Tabs>
        </Box>

        {/* Lični podaci */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Ime i prezime" 
                    secondary={profile.punoIme} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={profile.email} 
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={() => setPasswordDialogOpen(true)}
                fullWidth
              >
                Promeni lozinku
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Poslovni podaci */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><BusinessIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Odsek" 
                    secondary={profile.odsek} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><WorkIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Pozicija" 
                    secondary={profile.pozicija} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Plata" 
                    secondary={`${profile.plata.toLocaleString()} RSD`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><VacationIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Preostali dani odmora" 
                    secondary={`${profile.preostaliDaniOdmora} dana`} 
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                {profile.primarniMenadzer && (
                  <ListItem>
                    <ListItemIcon><SupervisorIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Primarni menadžer" 
                      secondary={`${profile.primarniMenadzer.punoIme} - ${profile.primarniMenadzer.pozicija}`} 
                    />
                  </ListItem>
                )}
                {profile.sekundarniMenadzer && (
                  <ListItem>
                    <ListItemIcon><SupervisorIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Sekundarni menadžer" 
                      secondary={`${profile.sekundarniMenadzer.punoIme} - ${profile.sekundarniMenadzer.pozicija}`} 
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Opšti podaci */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><AccessTimeIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Datum zaposlenja" 
                    secondary={new Date(profile.datumZaposlenja).toLocaleDateString('sr-RS')} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><AccessTimeIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Staž u kompaniji" 
                    secondary={profile.stazUKompaniji} 
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Zaduženi inventar
              </Typography>
              {profile.zaduzeniInventar.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Naziv</TableCell>
                        <TableCell>Serijski broj</TableCell>
                        <TableCell>Kategorija</TableCell>
                        <TableCell>Datum dodeljivanja</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profile.zaduzeniInventar.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.naziv}</TableCell>
                          <TableCell>{item.serijskiBroj}</TableCell>
                          <TableCell>
                            <Chip label={item.kategorija} size="small" />
                          </TableCell>
                          <TableCell>
                            {new Date(item.datumDodeljivanja).toLocaleDateString('sr-RS')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">
                  Nemate zadužen inventar
                </Typography>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Istorija plata */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Istorija plata
          </Typography>
          {salaryHistory.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell>Osnovna</TableCell>
                    <TableCell>Bonusi</TableCell>
                    <TableCell>Otkazi</TableCell>
                    <TableCell>Ukupno</TableCell>
                    <TableCell>Napomene</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salaryHistory.map((salary) => (
                    <TableRow key={salary.id}>
                      <TableCell>{salary.period}</TableCell>
                      <TableCell>{salary.osnovna.toLocaleString()} RSD</TableCell>
                      <TableCell>{salary.bonusi.toLocaleString()} RSD</TableCell>
                      <TableCell>{salary.otkazi.toLocaleString()} RSD</TableCell>
                      <TableCell>
                        <strong>{salary.total.toLocaleString()} RSD</strong>
                      </TableCell>
                      <TableCell>{salary.napomene}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary">
              Nema podataka o platama
            </Typography>
          )}
        </TabPanel>

        {/* Zahtevi za odmor */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Zahtevi za odmor
          </Typography>
          {vacationRequests.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Datum od</TableCell>
                    <TableCell>Datum do</TableCell>
                    <TableCell>Broj dana</TableCell>
                    <TableCell>Razlog</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vacationRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        {new Date(request.datumOd).toLocaleDateString('sr-RS')}
                      </TableCell>
                      <TableCell>
                        {new Date(request.datumDo).toLocaleDateString('sr-RS')}
                      </TableCell>
                      <TableCell>{request.brojDana}</TableCell>
                      <TableCell>{request.razlog}</TableCell>
                      <TableCell>
                        <Chip 
                          label={request.status}
                          color={
                            request.status === 'Odobreno' ? 'success' :
                            request.status === 'Odbačeno' ? 'error' : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary">
              Nema zahteva za odmor
            </Typography>
          )}
        </TabPanel>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Uredi profil</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            margin="normal"
            type="email"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleEditProfile} variant="contained">Sačuvaj</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Promeni lozinku</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Stara lozinka"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Nova lozinka"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Potvrdi novu lozinku"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleChangePassword} variant="contained">Promeni</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MojProfil;