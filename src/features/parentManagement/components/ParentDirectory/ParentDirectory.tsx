import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Checkbox,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useGetParentsQuery } from '../../../../services/api/parentManagementApi';
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import {
  setSelectedParents,
  toggleParentSelection,
  clearParentSelection,
  setShowCreateParentDialog,
  setShowEditParentDialog,
  setSelectedParentForEdit
} from '../../parentManagementSlice';
import ParentFilters from './ParentFilters';
import ParentCard from './ParentCard';
import ParentTable from './ParentTable';
import CreateParentForm from '../ParentAccountManagement/CreateParentForm';
import EditParentForm from '../ParentAccountManagement/EditParentForm';

const ParentDirectory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedParents, parentFilters, showCreateParentDialog, showEditParentDialog } = useAppSelector(
    (state) => state.parentManagement
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [pageSize] = useState(20);

  // Fetch parents data
  const { data: parentsData, isLoading, error, refetch } = useGetParentsQuery({
    page: currentPage,
    page_size: pageSize,
    search: parentFilters.search || '',
    is_active: parentFilters.is_active,
    ordering: parentFilters.ordering || 'first_name'
  });

  const totalPages = parentsData ? Math.ceil(parentsData.count / pageSize) : 0;

  // Handle parent selection
  const handleParentSelection = (parentId: number) => {
    dispatch(toggleParentSelection(parentId));
  };

  const handleSelectAll = () => {
    if (parentsData?.results) {
      if (selectedParents.length === parentsData.results.length) {
        dispatch(clearParentSelection());
      } else {
        dispatch(setSelectedParents(parentsData.results.map(p => p.id)));
      }
    }
  };

  // Handle edit parent
  const handleEditParent = (parent: any) => {
    dispatch(setSelectedParentForEdit(parent));
    dispatch(setShowEditParentDialog(true));
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [parentFilters]);

  if (error) {
    console.error('Parent list error:', error);
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erreur lors du chargement des parents: {error.toString()}
        <br />
        <small>Check console for more details</small>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Répertoire des Parents
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
          >
            {viewMode === 'cards' ? 'Vue Tableau' : 'Vue Cartes'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => dispatch(setShowCreateParentDialog(true))}
          >
            Ajouter un Parent
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <ParentFilters />

      {/* Selection Actions */}
      {selectedParents.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>
              {selectedParents.length} parent(s) sélectionné(s)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => dispatch(clearParentSelection())}
              >
                Désélectionner
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Supprimer ({selectedParents.length})
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Content */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : parentsData?.results && parentsData.results.length > 0 ? (
        <>
          {/* View Mode Toggle */}
          <Box sx={{ mb: 2 }}>
            <Checkbox
              checked={selectedParents.length === parentsData.results.length}
              indeterminate={selectedParents.length > 0 && selectedParents.length < parentsData.results.length}
              onChange={handleSelectAll}
            />
            <Typography component="span" variant="body2">
              Sélectionner tous les parents de cette page
            </Typography>
          </Box>

          {/* Parents Display */}
          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {parentsData.results.map((parent) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={parent.id}>
                  <ParentCard
                    parent={parent}
                    isSelected={selectedParents.includes(parent.id)}
                    onSelectionChange={() => handleParentSelection(parent.id)}
                    onEdit={() => handleEditParent(parent)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <ParentTable
              parents={parentsData.results}
              selectedParents={selectedParents}
              onParentSelection={handleParentSelection}
              onEditParent={handleEditParent}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun parent trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {parentFilters.search
              ? 'Aucun parent ne correspond à votre recherche.'
              : 'Commencez par ajouter des parents à votre école.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => dispatch(setShowCreateParentDialog(true))}
            sx={{ mt: 2 }}
          >
            Ajouter le premier parent
          </Button>
        </Paper>
      )}

      {/* Dialogs */}
      <CreateParentForm
        open={showCreateParentDialog}
        onClose={() => dispatch(setShowCreateParentDialog(false))}
        onSuccess={() => {
          dispatch(setShowCreateParentDialog(false));
          refetch();
        }}
      />

      <EditParentForm
        open={showEditParentDialog}
        onClose={() => {
          dispatch(setShowEditParentDialog(false));
          dispatch(setSelectedParentForEdit(undefined));
        }}
        onSuccess={() => {
          dispatch(setShowEditParentDialog(false));
          dispatch(setSelectedParentForEdit(undefined));
          refetch();
        }}
      />
    </Box>
  );
};

export default ParentDirectory;
