import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton,
  Chip,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  GetApp as ExportIcon,
  CloudUpload as ImportIcon,
} from '@mui/icons-material';
import { InventarService } from '../../services/inventarService';
import { InventarItem } from '../../types/inventar';

interface InventarListaProps {
  onAddStavka?: () => void;
  onEditStavka?: (stavka: InventarItem) => void;
  onViewStavka?: (stavka: InventarItem) => void;
  onDeleteStavka?: (id: number) => void;
}

const InventarLista: React.FC<InventarListaProps> = ({
  onAddStavka,
  onEditStavka,
  onViewStavka,
  onDeleteStavka,
}) => {
  // 🔍 SAFE INITIALIZATION: Početna vrednost je uvek prazan array
  const [stavke, setStavke] = useState<InventarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadStavke = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📦 Učitavam stavke inventara...');
      const data = await InventarService.getAllStavke();
      
      // 🔍 SAFE GUARD: Uvek proveri da li je data array
      if (Array.isArray(data)) {
        console.log('✅ Uspešno učitano', data.length, 'stavki');
        setStavke(data);
      } else {
        console.error('❌ API je vratio neočekivani format:', typeof data, data);
        setStavke([]);
        setError('API je vratio neočekivani format podataka');
      }
    } catch (err: any) {
      console.error('❌ Greška pri učitavanju stavki:', err);
      setError(err.message || 'Neočekivana greška pri učitavanju');
      setStavke([]); // Failsafe
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStavke();
  }, []);

  // 🔍 SAFE FILTERING: Uvek proverava da li je stavke array
  const filteredStavke = useMemo(() => {
    if (!Array.isArray(stavke)) {
      console.error('❌ CRITICAL: stavke nije array u useMemo!', stavke);
      return [];
    }

    if (!searchQuery.trim()) {
      return stavke;
    }

    const query = searchQuery.toLowerCase();
    return stavke.filter((stavka) => {
      // Safe property access sa fallback vrednostima
      const naziv = (stavka.naziv || '').toLowerCase();
      const opis = (stavka.opis || '').toLowerCase();
      const kategorija = (stavka.kategorija || '').toLowerCase();
      const serijski = (stavka.serijskiBroj || '').toLowerCase();

      return (
        naziv.includes(query) ||
        opis.includes(query) ||
        kategorija.includes(query) ||
        serijski.includes(query)
      );
    });
  }, [stavke, searchQuery]);

  // 🔍 SAFE PAGINATION: Uvek radi sa array
  const paginatedStavke = useMemo(() => {
    if (!Array.isArray(filteredStavke)) {
      return [];
    }
    
    const startIndex = page * rowsPerPage;
    return filteredStavke.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredStavke, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset pagination when searching
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'dostupno':
        return 'success';
      case 'izdato':
        return 'warning';
      case 'pokvareno':
        return 'error';
      case 'servis':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status || 'Nepoznato';
  };

  // Loading state
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Učitavam stavke inventara...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={loadStavke}>
              Pokušaj ponovo
            </Button>
          }
        >
          <Typography variant="body2">
            <strong>Greška pri učitavanju stavki inventara:</strong><br />
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Pretraži po nazivu, opisu, kategoriji ili serijskom broju..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ flexGrow: 1, minWidth: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddStavka}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Dodaj novu stavku
        </Button>
        
        <Tooltip title="Eksportuj u CSV">
          <IconButton color="primary">
            <ExportIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Importuj iz CSV">
          <IconButton color="primary">
            <ImportIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Results info */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {Array.isArray(filteredStavke) ? (
          <>
            Prikazano {paginatedStavke.length} od {filteredStavke.length} stavki
            {searchQuery && ` (filtrirano od ukupno ${stavke.length})`}
          </>
        ) : (
          'Nema podataka za prikaz'
        )}
      </Typography>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Naziv</TableCell>
              <TableCell>Opis</TableCell>
              <TableCell>Stanje</TableCell>
              <TableCell>Serijski Broj</TableCell>
              <TableCell>Vrednost</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(paginatedStavke) && paginatedStavke.length > 0 ? (
              paginatedStavke.map((stavka) => (
                <TableRow key={stavka.id || Math.random()}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '14px' }}>
                        {(stavka.naziv || 'N')[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {stavka.naziv || 'Bez naziva'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
                      {stavka.opis || 'Nema opisa'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {stavka.kolicina || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {stavka.serijskiBroj || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {stavka.vrednost ? `${stavka.vrednost} RSD` : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(stavka.status)}
                      color={getStatusColor(stavka.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Prikaži detalje">
                        <IconButton 
                          size="small" 
                          onClick={() => onViewStavka?.(stavka)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Uredi">
                        <IconButton 
                          size="small" 
                          onClick={() => onEditStavka?.(stavka)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Obriši">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => onDeleteStavka?.(stavka.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" py={4}>
                    {searchQuery ? 'Nema stavki koje odgovaraju pretrazi' : 'Nema stavki za prikaz'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {Array.isArray(filteredStavke) && filteredStavke.length > 0 && (
        <TablePagination
          component="div"
          count={filteredStavke.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Stavki po stranici:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} od ${count !== -1 ? count : `više od ${to}`}`
          }
        />
      )}
    </Box>
  );
};

export default InventarLista;