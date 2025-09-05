import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useGetClassesQuery, useDeleteClassMutation, useBulkDeleteClassesMutation, useCreateClassMutation, useUpdateClassMutation } from '../../features/classes/classApi';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setFilters, clearFilters, toggleClassSelection, selectAllClasses, clearClassSelection, setPagination } from '../../features/classes/classSlice';
import { useCurrentSchool } from '../../hooks/useCurrentSchool';
import ClassList from '../../features/classes/components/ClassList';
import ClassForm from '../../features/classes/components/ClassForm';
import { Class } from '../../types/class';

const ClassesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { school } = useCurrentSchool();
  const {
    filters,
    pagination,
    selectedClasses
  } = useAppSelector((state: any) => state.classes);

  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // API queries
  const { data: classesData, isLoading, error, refetch } = useGetClassesQuery({
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    search: filters.search,
    level: filters.level,
    section: filters.section,
    academic_year: filters.academic_year,
    is_active: filters.is_active,
    school: school?.id
  });

  const [deleteClass] = useDeleteClassMutation();
  const [bulkDeleteClasses] = useBulkDeleteClassesMutation();
  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();

  // Handle pagination
  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setPagination({
      ...pagination,
      currentPage: newPage + 1
    }));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    dispatch(setPagination({
      ...pagination,
      pageSize: newPageSize,
      currentPage: 1
    }));
  };

  // Handle filters
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ ...filters, search: event.target.value }));
  };

  const handleFilterChange = (filterName: string, value: any) => {
    dispatch(setFilters({ ...filters, [filterName]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Handle class selection
  const handleSelectClass = (classId: string) => {
    dispatch(toggleClassSelection(classId));
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === classesData?.results.length) {
      dispatch(clearClassSelection());
    } else {
      dispatch(selectAllClasses());
    }
  };

  // Handle form
  const handleCreateClass = () => {
    setEditingClass(null);
    setFormOpen(true);
  };

  const handleEditClass = (classData: Class) => {
    setEditingClass(classData);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingClass(null);
  };

  // Handle delete
  const handleDeleteClass = (classId: string) => {
    setClassToDelete(classId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (classToDelete) {
      try {
        await deleteClass(classToDelete).unwrap();
        setSnackbar({
          open: true,
          message: 'Classe supprimée avec succès',
          severity: 'success'
        });
        dispatch(clearClassSelection());
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression de la classe',
          severity: 'error'
        });
      }
    }
    setDeleteDialogOpen(false);
    setClassToDelete(null);
  };

  const handleBulkDelete = async () => {
    if (selectedClasses.length === 0) return;

    try {
      await bulkDeleteClasses(selectedClasses).unwrap();
      setSnackbar({
        open: true,
        message: `${selectedClasses.length} classe(s) supprimée(s) avec succès`,
        severity: 'success'
      });
      dispatch(clearClassSelection());
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression des classes',
        severity: 'error'
      });
    }
  };

  const handleViewClass = (classData: Class) => {
    // TODO: Implement view class details
    console.log('View class:', classData);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingClass) {
        // Update existing class
        await updateClass({
          id: editingClass.id,
          data: data
        }).unwrap();
        
        setSnackbar({
          open: true,
          message: 'Classe modifiée avec succès',
          severity: 'success'
        });
      } else {
        // Create new class
        await createClass(data).unwrap();
        
        setSnackbar({
          open: true,
          message: 'Classe créée avec succès',
          severity: 'success'
        });
      }
      
      handleFormClose();
    } catch (error: any) {
      console.error('Error saving class:', error);
      setSnackbar({
        open: true,
        message: error?.data?.message || error?.message || 'Erreur lors de l\'enregistrement de la classe',
        severity: 'error'
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Gestion des Classes
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Actualiser">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClass}
          >
            Nouvelle Classe
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Rechercher une classe..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Niveau</InputLabel>
              <Select
                value={filters.level || ''}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                label="Niveau"
              >
                <MenuItem value="">Tous les niveaux</MenuItem>
                <MenuItem value="1">CI</MenuItem>
                <MenuItem value="2">CP</MenuItem>
                <MenuItem value="3">CE1</MenuItem>
                <MenuItem value="4">CE2</MenuItem>
                <MenuItem value="5">CM1</MenuItem>
                <MenuItem value="6">CM2</MenuItem>
                <MenuItem value="7">6ème</MenuItem>
                <MenuItem value="8">5ème</MenuItem>
                <MenuItem value="9">4ème</MenuItem>
                <MenuItem value="10">3ème</MenuItem>
                <MenuItem value="11">Seconde</MenuItem>
                <MenuItem value="12">Première</MenuItem>
                <MenuItem value="13">Terminale</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Section</InputLabel>
              <Select
                value={filters.section || ''}
                onChange={(e) => handleFilterChange('section', e.target.value)}
                label="Section"
              >
                <MenuItem value="">Toutes les sections</MenuItem>
                <MenuItem value="A">Section A</MenuItem>
                <MenuItem value="B">Section B</MenuItem>
                <MenuItem value="C">Section C</MenuItem>
                <MenuItem value="D">Section D</MenuItem>
                <MenuItem value="E">Section E</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.is_active === undefined ? '' : filters.is_active}
                onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value === 'true')}
                label="Statut"
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleClearFilters}
              fullWidth
            >
              Effacer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      {selectedClasses.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'action.selected' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {selectedClasses.length} classe(s) sélectionnée(s)
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              size="small"
            >
              Supprimer
            </Button>
            <Button
              variant="outlined"
              onClick={() => dispatch(clearClassSelection())}
              size="small"
            >
              Annuler
            </Button>
          </Box>
        </Paper>
      )}

      {/* Classes List */}
      <ClassList
        classes={classesData?.results || []}
        onEdit={handleEditClass}
        onDelete={handleDeleteClass}
        onView={handleViewClass}
        selectedClasses={selectedClasses}
        onSelectClass={handleSelectClass}
        onSelectAll={handleSelectAll}
        isLoading={isLoading}
        error={error ? 'Erreur lors du chargement des classes' : null}
        page={pagination.currentPage - 1}
        pageSize={pagination.pageSize}
        totalCount={classesData?.count || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Class Form Dialog */}
      <ClassForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        classData={editingClass || undefined}
        isLoading={isCreating || isUpdating}
        error={null}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default ClassesPage;
