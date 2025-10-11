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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zahtevZaOdmorService } from '../services/zahtevZaOdmorService';
import { zaposleniService, ZaposleniDropdownItem } from '../services/zaposleniService';
import { ZahtevZaOdmor, ZahtevZaOdmorDto } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// ✅ NOVO: Tip za GET response koji ima drugačiji format od ZahtevZaOdmor
interface ZahtevZaOdmorListItem {
  id: number;
  zaposleniId: number;
  zaposleniIme: string;  // Umesto zaposleni objekta
  odsekNaziv?: string;
  datumOd: string;
  datumDo: string;
  brojDana: number;
  razlog?: string;
  status: string;
  tipOdmora: string;
  datumZahteva: string;
  datumOdgovora?: string;
  odobrioKorisnikId?: number;
  napomenaOdgovora?: string;
}

interface ZahtevFormData {
  zaposleniId: number;
  datumOd: string;
  datumDo: string;
  razlog: string;
  tipOdmora: string;
}

interface ApprovalDialogProps {
  open: boolean;
  zahtev: ZahtevZaOdmorListItem | null;  // ✅ ISPRAVKA: Koristimo novi tip
  onClose: () => void;
  onApprove: (id: number, napomena?: string) => void;
  onReject: (id: number, napomena?: string) => void;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`zahtevi-tabpanel-${index}`}
      aria-labelledby={`zahtevi-tab-${index}`}
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
    id: `zahtevi-tab-${index}`,
    'aria-controls': `zahtevi-tabpanel-${index}`,
  };
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  open,
  zahtev,
  onClose,
  onApprove,
  onReject,
}) => {
  const [napomena, setNapomena] = useState('');

  const handleApprove = () => {
    if (zahtev) {
      onApprove(zahtev.id, napomena);
      setNapomena('');
      onClose();
    }
  };

  const handleReject = () => {
    if (zahtev) {
      onReject(zahtev.id, napomena);
      setNapomena('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Odobravanje zahteva za odmor</DialogTitle>
      <DialogContent>
        {zahtev && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {/* ✅ ISPRAVKA: Koristi zaposleniIme umesto zaposleni objekta */}
                {zahtev.zaposleniIme || 'Nepoznato'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Tip odmora:</strong> {zahtev.tipOdmora}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Broj dana:</strong> {zahtev.brojDana}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Od:</strong> {new Date(zahtev.datumOd).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Do:</strong> {new Date(zahtev.datumDo).toLocaleDateString()}</Typography>
            </Grid>
            {zahtev.razlog && (
              <Grid item xs={12}>
                <Typography><strong>Razlog:</strong></Typography>
                <Typography variant="body2" sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                  {zahtev.razlog}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Napomena (opciono)"
                fullWidth
                multiline
                rows={3}
                value={napomena}
                onChange={(e) => setNapomena(e.target.value)}
                margin="normal"
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Otkaži</Button>
        <Button
          onClick={handleReject}
          color="error"
          variant="outlined"
          startIcon={<CloseIcon />}
        >
          Odbij
        </Button>
        <Button
          onClick={handleApprove}
          color="success"
          variant="contained"
          startIcon={<CheckIcon />}
        >
          Odobri
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const tipOdmoraOptions = [
  'Godisnji',
  'Bolovanje',
  'Porodicno',
  'Ostalo',
];

const ZahteviZaOdmor: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [viewingZahtev, setViewingZahtev] = useState<ZahtevZaOdmorListItem | null>(null);  // ✅ ISPRAVKA
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [selectedZahtev, setSelectedZahtev] = useState<ZahtevZaOdmorListItem | null>(null);  // ✅ ISPRAVKA
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<ZahtevFormData>();

  const { data: zahteviZaOdmor, isLoading } = useQuery<ZahtevZaOdmorListItem[]>({
    queryKey: ['zahteviZaOdmor'],
    queryFn: zahtevZaOdmorService.getAll,
  });

  // ✅ IZMENA: Koristi novi getDropdown() metod umesto getAll()
  const { data: zaposleni } = useQuery({
    queryKey: ['zaposleni-dropdown'],
    queryFn: zaposleniService.getDropdown,
  });

  const createMutation = useMutation({
    mutationFn: zahtevZaOdmorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahteviZaOdmor'] });
      setOpen(false);
      reset();
      setTabValue(0); // Vrati na listu
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, napomena }: { id: number; napomena?: string }) =>
      zahtevZaOdmorService.approve(id, napomena),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahteviZaOdmor'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, napomena }: { id: number; napomena?: string }) =>
      zahtevZaOdmorService.reject(id, napomena),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahteviZaOdmor'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: zahtevZaOdmorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahteviZaOdmor'] });
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreate = () => {
    reset({
      zaposleniId: 0,
      datumOd: '',
      datumDo: '',
      razlog: '',
      tipOdmora: 'Godisnji',
    });
    setOpen(true);
    setTabValue(1); // Prebaci na formu
  };

  const handleView = (zahtev: ZahtevZaOdmorListItem) => {  // ✅ ISPRAVKA
    setViewingZahtev(zahtev);
  };

  const handleApproval = (zahtev: ZahtevZaOdmorListItem) => {  // ✅ ISPRAVKA
    setSelectedZahtev(zahtev);
    setApprovalDialog(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj zahtev?')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: ZahtevFormData) => {
    // ✅ Konvertuj datume u UTC format za PostgreSQL
    const datumOdUtc = new Date(data.datumOd + 'T00:00:00.000Z').toISOString();
    const datumDoUtc = new Date(data.datumDo + 'T00:00:00.000Z').toISOString();
    
    const zahtevData: ZahtevZaOdmorDto = {
      zaposleniId: data.zaposleniId,
      datumOd: datumOdUtc,
      datumDo: datumDoUtc,
      razlog: data.razlog || undefined,
      tipOdmora: data.tipOdmora,
    };

    createMutation.mutate(zahtevData);
  };

  const handleApprove = (id: number, napomena?: string) => {
    approveMutation.mutate({ id, napomena });
  };

  const handleReject = (id: number, napomena?: string) => {
    rejectMutation.mutate({ id, napomena });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const zahteviNaCekanju = zahteviZaOdmor?.filter(z => z.status === 'NaCekanju') || [];  // ✅ ISPRAVKA
  const odobreniZahtevi = zahteviZaOdmor?.filter(z => z.status === 'Odobren') || [];
  const odbijeniZahtevi = zahteviZaOdmor?.filter(z => z.status === 'Odbacen') || [];  // ✅ ISPRAVKA

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NaCekanju': return 'warning';  // ✅ ISPRAVKA
      case 'Odobren': return 'success';
      case 'Odbacen': return 'error';  // ✅ ISPRAVKA
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NaCekanju': return 'Na čekanju';  // ✅ ISPRAVKA
      case 'Odobren': return 'Odobren';
      case 'Odbacen': return 'Odbačen';  // ✅ ISPRAVKA
      default: return status;
    }
  };

  // Kalkulacija broja dana iz forme
  const datumOd = watch('datumOd');
  const datumDo = watch('datumDo');
  const brojDana = datumOd && datumDo ? 
    Math.ceil((new Date(datumDo).getTime() - new Date(datumOd).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

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
        🏖️ Zahtevi za Odmor Upravljanje
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
            aria-label="zahtevi tabs"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
              }
            }}
          >
            <Tab 
              label="📋 Lista Zahteva" 
              {...a11yProps(0)} 
              icon={<span>📋</span>}
              iconPosition="start"
            />
            <Tab 
              label="➕ Novi Zahtev" 
              {...a11yProps(1)}
              icon={<span>➕</span>}
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Zaposleni</TableCell>
                  <TableCell>Tip odmora</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell align="center">Broj dana</TableCell>
                  <TableCell>Datum zahteva</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Akcije</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zahteviZaOdmor?.map((zahtev) => (
                  <TableRow key={zahtev.id}>
                    <TableCell>
                      {/* ✅ ISPRAVKA: Koristi ZaposleniIme iz GET response-a */}
                      {zahtev.zaposleniIme || 'Nepoznato'}
                    </TableCell>
                    <TableCell>{zahtev.tipOdmora}</TableCell>
                    <TableCell>
                      {new Date(zahtev.datumOd).toLocaleDateString()} - {new Date(zahtev.datumDo).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">{zahtev.brojDana}</TableCell>
                    <TableCell>{new Date(zahtev.datumZahteva).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(zahtev.status)}
                        color={getStatusColor(zahtev.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleView(zahtev)} color="info">
                        <ViewIcon />
                      </IconButton>
                      {zahtev.status === 'NaCekanju' && (  /* ✅ ISPRAVKA */
                        <IconButton onClick={() => handleApproval(zahtev)} color="primary">
                          <CheckIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDelete(zahtev.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="zaposleniId"
                  control={control}
                  defaultValue={0}
                  rules={{ required: 'Zaposleni je obavezan' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Zaposleni"
                      fullWidth
                      margin="normal"
                      error={!!errors.zaposleniId}
                      helperText={errors.zaposleniId?.message}
                    >
                      {/* ✅ IZMENA: Koristimo novi format podataka bez filtera */}
                      {zaposleni?.map((z) => (
                        <MenuItem key={z.id} value={z.id}>
                          {z.punoIme} - {z.pozicija}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="tipOdmora"
                  control={control}
                  defaultValue="Godisnji"
                  rules={{ required: 'Tip odmora je obavezan' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Tip odmora"
                      fullWidth
                      margin="normal"
                      error={!!errors.tipOdmora}
                      helperText={errors.tipOdmora?.message}
                    >
                      {tipOdmoraOptions.map((tip) => (
                        <MenuItem key={tip} value={tip}>
                          {tip}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Broj dana: {brojDana > 0 ? brojDana : 0}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="datumOd"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Datum početka je obavezan' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Datum početka"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.datumOd}
                      helperText={errors.datumOd?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="datumDo"
                  control={control}
                  defaultValue=""
                  rules={{ 
                    required: 'Datum kraja je obavezan',
                    validate: (value) => {
                      if (datumOd && value && new Date(value) < new Date(datumOd)) {
                        return 'Datum kraja mora biti nakon datuma početka';
                      }
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Datum kraja"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.datumDo}
                      helperText={errors.datumDo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="razlog"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Razlog (opciono)"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createMutation.isPending}
                  fullWidth
                  size="large"
                >
                  Pošalji zahtev
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Statistike */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Na čekanju
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {zahteviNaCekanju.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Odobreni
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {odobreniZahtevi.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Odbijeni
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {odbijeniZahtevi.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Ukupno
                  </Typography>
                  <Typography variant="h4">
                    {zahteviZaOdmor?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Dialog za pregled */}
      <Dialog open={!!viewingZahtev} onClose={() => setViewingZahtev(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalji zahteva za odmor</DialogTitle>
        <DialogContent>
          {viewingZahtev && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {/* ✅ ISPRAVKA: Koristi zaposleniIme umesto zaposleni objekta */}
                  {viewingZahtev.zaposleniIme || 'Nepoznato'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Tip odmora:</strong> {viewingZahtev.tipOdmora}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Broj dana:</strong> {viewingZahtev.brojDana}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Od:</strong> {new Date(viewingZahtev.datumOd).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Do:</strong> {new Date(viewingZahtev.datumDo).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Datum zahteva:</strong> {new Date(viewingZahtev.datumZahteva).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Status:</strong>{' '}
                  <Chip
                    label={getStatusText(viewingZahtev.status)}
                    color={getStatusColor(viewingZahtev.status) as any}
                    size="small"
                  />
                </Typography>
              </Grid>
              {viewingZahtev.razlog && (
                <Grid item xs={12}>
                  <Typography><strong>Razlog:</strong></Typography>
                  <Typography variant="body2" sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    {viewingZahtev.razlog}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingZahtev(null)}>Zatvori</Button>
        </DialogActions>
      </Dialog>

      {/* Approval Dialog */}
      <ApprovalDialog
        open={approvalDialog}
        zahtev={selectedZahtev}
        onClose={() => setApprovalDialog(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Container>
  );
};

export default ZahteviZaOdmor;