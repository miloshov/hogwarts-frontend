import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zaposleniService } from '../services/zaposleniService';
import { Zaposleni as ZaposleniType, ZaposleniDto } from '../types';
import { SearchAndSortParams } from '../types/dashboard';
import ZaposleniList from '../components/ZaposleniList';
import ZaposleniForm from '../components/ZaposleniForm';
import ZaposleniDetails from '../components/ZaposleniDetails';

const ZaposleniPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingZaposleni, setEditingZaposleni] = useState<ZaposleniType | null>(null);
  const [viewingZaposleni, setViewingZaposleni] = useState<ZaposleniType | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );
  
  // Search and sort state
  const [searchParams, setSearchParams] = useState<SearchAndSortParams>({
    page: 1,
    pageSize: 10,
    search: '',
    sortBy: 'ime',
    ascending: true,
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['zaposleni-paginated', searchParams],
    queryFn: () => zaposleniService.getPaginated(searchParams),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: zaposleniService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zaposleni-paginated'] });
      setFormOpen(false);
      setEditingZaposleni(null);
      showSnackbar('Zaposleni je uspešno dodat', 'success');
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Greška pri dodavanju zaposlenog', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ZaposleniDto }) =>
      zaposleniService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zaposleni-paginated'] });
      setFormOpen(false);
      setEditingZaposleni(null);
      showSnackbar('Zaposleni je uspešno ažuriran', 'success');
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Greška pri ažuriranju zaposlenog', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: zaposleniService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zaposleni-paginated'] });
      showSnackbar('Zaposleni je uspešno obrisan', 'success');
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Greška pri brisanju zaposlenog', 'error');
    },
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = () => {
    setEditingZaposleni(null);
    setFormOpen(true);
  };

  const handleEdit = (zaposleni: Zaposleni) => {
    setEditingZaposleni(zaposleni);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog zaposlenog?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (zaposleni: Zaposleni) => {
    setViewingZaposleni(zaposleni);
    setDetailsOpen(true);
  };

  const handleFormSubmit = (data: ZaposleniDto) => {
    if (editingZaposleni) {
      updateMutation.mutate({ id: editingZaposleni.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSearchChange = (search: string) => {
    setSearchParams({ ...searchParams, search, page: 1 });
  };

  const handleSortChange = (sortBy: string, ascending: boolean) => {
    setSearchParams({ ...searchParams, sortBy, ascending, page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams({ ...searchParams, page, pageSize });
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingZaposleni(null);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setViewingZaposleni(null);
  };

  const handleEditFromDetails = (zaposleni: Zaposleni) => {
    setDetailsOpen(false);
    handleEdit(zaposleni);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Zaposleni</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size="large"
        >
          Dodaj zaposlenog
        </Button>
      </Box>

      <ZaposleniList
        data={data}
        loading={isLoading}
        search={searchParams.search || ''}
        onSearchChange={handleSearchChange}
        sortBy={searchParams.sortBy || 'ime'}
        ascending={searchParams.ascending || true}
        onSortChange={handleSortChange}
        page={searchParams.page || 1}
        pageSize={searchParams.pageSize || 10}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <ZaposleniForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editingZaposleni={editingZaposleni}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ZaposleniDetails
        zaposleni={viewingZaposleni}
        open={detailsOpen}
        onClose={handleDetailsClose}
        onEdit={handleEditFromDetails}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ZaposleniPage;
