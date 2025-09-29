import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
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
import { zaposleniService } from '../services/zaposleniService';
import { ZahtevZaOdmor, ZahtevZaOdmorDto, Zaposleni } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface ZahtevFormData {
  zaposleniId: number;
  datumOd: string;
  datumDo: string;
  razlog: string;
  tipOdmora: string;
}

interface ApprovalDialogProps {
  open: boolean;
  zahtev: ZahtevZaOdmor | null;
  onClose: () => void;
  onApprove: (id: number, napomena?: string) => void;
  onReject: (id: number, napomena?: string) => void;
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
                {zahtev.zaposleni ? `${zahtev.zaposleni.ime} ${zahtev.zaposleni.prezime}` : 'Nepoznato'}
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
        <Button onClick={onClose}>Otkadži</Button>
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
  const [open, setOpen] = useState(false);
  const [viewingZahtev, setViewingZahtev] = useState<ZahtevZaOdmor | null>(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [selectedZahtev, setSelectedZahtev] = useState<ZahtevZaOdmor | null>(null);
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<ZahtevFormData>();

  const { data: zahteviZaOdmor, isLoading } = useQuery({
    queryKey: ['zahteviZaOdmor'],
    queryFn: zahtevZaOdmorService.getAll,
  });

  const { data: zaposleni } = useQuery({
    queryKey: ['zaposleni'],
    queryFn: zaposleniService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: zahtevZaOdmorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zahteviZaOdmor'] });
      setOpen(false);
      reset();
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

  const handleCreate = () => {
    reset({
      zaposleniId: 0,
      datumOd: '',
      datumDo: '',
      razlog: '',
      tipOdmora: 'Godisnji',
    });
    setOpen(true);
  };

  const handleView = (zahtev: ZahtevZaOdmor) => {
    setViewingZahtev(zahtev);
  };

  const handleApproval = (zahtev: ZahtevZaOdmor) => {
    setSelectedZahtev(zahtev);
    setApprovalDialog(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj zahtev?')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: ZahtevFormData) => {
    const zahtevData: ZahtevZaOdmorDto = {
      zaposleniId: data.zaposleniId,
      datumOd: data.datumOd,
      datumDo: data.datumDo,
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

  const zahteviNaCekanju = zahteviZaOdmor?.filter(z => z.status === 'Na_Cekanju') || [];
  const odobreniZahtevi = zahteviZaOdmor?.filter(z => z.status === 'Odobren') || [];
  const odbijeniZahtevi = zahteviZaOdmor?.filter(z => z.status === 'Odbijen') || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Na_Cekanju': return 'warning';
      case 'Odobren': return 'success';
      case 'Odbijen': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Na_Cekanju': return 'Na čekanju';
      case 'Odobren': return 'Odobren';
      case 'Odbijen': return 'Odbijen';
      default: return status;
    }
  };

  // Kalkulacija broja dana iz forme
  const datumOd = watch('datumOd');
  const datumDo = watch('datumDo');
  const brojDana = datumOd && datumDo ? 
    Math.ceil((new Date(datumDo).getTime() - new Date(datumOd).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Zahtevi za odmor</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Novi zahtev
        </Button>
      </Box>

      {/* Statistike */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                  {zahtev.zaposleni ? `${zahtev.zaposleni.ime} ${zahtev.zaposleni.prezime}` : 'Nepoznato'}
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
                  {zahtev.status === 'Na_Cekanju' && (
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

      {/* Dialog za kreiranje */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novi zahtev za odmor</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
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
                      {zaposleni?.filter(z => z.isActive).map((z) => (
                        <MenuItem key={z.id} value={z.id}>
                          {`${z.ime} ${z.prezime} - ${z.pozicija}`}
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Otkadži</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending}
            >
              Posladži zahtev
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog za pregled */}
      <Dialog open={!!viewingZahtev} onClose={() => setViewingZahtev(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalji zahteva za odmor</DialogTitle>
        <DialogContent>
          {viewingZahtev && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {viewingZahtev.zaposleni ? `${viewingZahtev.zaposleni.ime} ${viewingZahtev.zaposleni.prezime}` : 'Nepoznato'}
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
              {viewingZahtev.napomenaOdgovora && (
                <Grid item xs={12}>
                  <Typography><strong>Napomena odgovora:</strong></Typography>
                  <Typography variant="body2" sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    {viewingZahtev.napomenaOdgovora}
                  </Typography>
                </Grid>
              )}
              {viewingZahtev.datumOdgovora && (
                <Grid item xs={12}>
                  <Typography><strong>Datum odgovora:</strong> {new Date(viewingZahtev.datumOdgovora).toLocaleDateString()}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingZahtev(null)}>Zatvori</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog za odobravanje */}
      <ApprovalDialog
        open={approvalDialog}
        zahtev={selectedZahtev}
        onClose={() => setApprovalDialog(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Box>
  );
};

export default ZahteviZaOdmor;
