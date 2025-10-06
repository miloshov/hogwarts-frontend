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
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { Zaposleni } from '../../types';
import { PaginatedResponse } from '../../types/dashboard';
import ZaposleniCard from './ZaposleniCard';
import LoadingSpinner from './LoadingSpinner';

interface ZaposleniListProps {
  data: PaginatedResponse<Zaposleni> | undefined;
  loading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: string;
  ascending: boolean;
  onSortChange: (sortBy: string, ascending: boolean) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (zaposleni: Zaposleni) => void;
  onDelete: (id: number) => void;
  onView: (zaposleni: Zaposleni) => void;
}

type SortableField = 'ime' | 'prezime' | 'email' | 'pozicija' | 'datumzaposlenja';

interface HeadCell {
  id: SortableField;
  label: string;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'ime', label: 'Ime i prezime', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'pozicija', label: 'Pozicija', sortable: true },
  { id: 'datumzaposlenja', label: 'Datum zaposlenja', sortable: true },
];

const ZaposleniList: React.FC<ZaposleniListProps> = ({
  data,
  loading,
  search,
  onSearchChange,
  sortBy,
  ascending,
  onSortChange,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchInput, setSearchInput] = useState(search);

  const handleSearchSubmit = () => {
    onSearchChange(searchInput);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    onSearchChange('');
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSort = (property: SortableField) => {
    const isAsc = sortBy === property && ascending;
    onSortChange(property, !isAsc);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1, pageSize);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    onPageChange(1, newPageSize);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (!data?.data?.length) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          {search ? 'Nema rezultata pretrage' : 'Nema zaposlenih u bazi'}
        </Typography>
        {search && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            Pokušajte sa drugačijim pojmovima pretrage
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {/* Search bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Pretraži zaposlene po imenu, prezimenu, email-u ili poziciji..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <IconButton onClick={handleSearchClear} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Results info */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Prikazano {data.data.length} od ukupno {data.pagination.totalCount} zaposlenih
          {search && ` za "${search}"`}
        </Typography>
      </Box>

      {/* Mobile card view */}
      {isMobile ? (
        <Grid container spacing={2}>
          {data.data.map((zaposleni) => (
            <Grid item xs={12} sm={6} key={zaposleni.id}>
              <ZaposleniCard
                zaposleni={zaposleni}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Desktop table view */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}>
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={sortBy === headCell.id}
                        direction={sortBy === headCell.id ? (ascending ? 'asc' : 'desc') : 'asc'}
                        onClick={() => handleSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
                <TableCell>Odsek</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Akcije</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((zaposleni) => (
                <TableRow key={zaposleni.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {zaposleni.punoIme || `${zaposleni.ime} ${zaposleni.prezime}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {zaposleni.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {zaposleni.pozicija}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(zaposleni.datumZaposlenja).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {zaposleni.odsek?.naziv || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={zaposleni.isActive ? 'Aktivan' : 'Neaktivan'}
                      color={zaposleni.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title="Prikaži detalje">
                        <IconButton size="small" onClick={() => onView(zaposleni)} color="info">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Uredi">
                        <IconButton size="small" onClick={() => onEdit(zaposleni)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Obriši">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(zaposleni.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        component="div"
        count={data.pagination.totalCount}
        page={data.pagination.currentPage - 1}
        onPageChange={handlePageChange}
        rowsPerPage={data.pagination.pageSize}
        onRowsPerPageChange={handlePageSizeChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} od ${count !== -1 ? count : `više od ${to}`}`
        }
        labelRowsPerPage="Redova po stranici:"
      />
    </Box>
  );
};

export default ZaposleniList;
