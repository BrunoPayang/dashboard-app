import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
  Skeleton,
  Card,
  CardContent
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Sort as SortIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { 
  setViewMode, 
  setSortBy, 
  setSortOrder, 
  setPagination,
  toggleFileSelection,
  selectAllFiles,
  clearFileSelection,
  setFilters,
  clearFilters
} from '../../fileSlice';
import { FileItem, FileFilters as FiltersType } from '../../types/file';
import { useGetFilesQuery, useDeleteFileMutation, useUpdateFileMutation } from '../../services/fileApi';
import FileCard from './FileCard';
import FileFilters from './FileFilters';

interface FileBrowserProps {
  onEditFile?: (file: FileItem) => void;
  onDownloadFile?: (file: FileItem) => void;
}

const FileBrowser: React.FC<FileBrowserProps> = ({
  onEditFile,
  onDownloadFile
}) => {
  const dispatch = useAppDispatch();
  const {
    viewMode,
    sortBy,
    sortOrder,
    pagination,
    filters,
    selectedFiles
  } = useAppSelector((state: any) => state.files);

  // API queries
  const { data: filesData, isLoading, error, refetch } = useGetFilesQuery({
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    search: filters.search,
    file_type: filters.file_type,
    is_public: filters.is_public
  });

  // Debug logging
  React.useEffect(() => {
    console.log('FileBrowser Debug:', {
      isLoading,
      error,
      filesData,
      pagination,
      filters,
      apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api'
    });
  }, [isLoading, error, filesData, pagination, filters]);

  const [deleteFile] = useDeleteFileMutation();
  const [updateFile] = useUpdateFileMutation();

  // Local state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handle pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPagination({
      ...pagination,
      currentPage: value
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (event: any) => {
    const newPageSize = event.target.value;
    dispatch(setPagination({
      ...pagination,
      pageSize: newPageSize,
      currentPage: 1 // Reset to first page
    }));
  };

  // Handle sorting
  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      // Toggle order if same field
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new field with default order
      dispatch(setSortBy(newSortBy));
      dispatch(setSortOrder('desc'));
    }
  };

  // Handle search
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      dispatch(setFilters({ ...filters, search: query }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [dispatch, filters]);

  // Handle filters
  const handleFiltersChange = useCallback((newFilters: FiltersType) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    dispatch(clearFilters());
  }, [dispatch]);

  // Handle file selection
  const handleFileSelect = (fileId: string) => {
    dispatch(toggleFileSelection(fileId));
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filesData?.results.length) {
      dispatch(clearFileSelection());
    } else {
      dispatch(selectAllFiles());
    }
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    setFilesToDelete(selectedFiles);
    setDeleteDialogOpen(true);
  };

  const handleBulkTogglePublic = async (isPublic: boolean) => {
    try {
      const updatePromises = selectedFiles.map((fileId: string) => 
        updateFile({ id: fileId, updates: { is_public: isPublic } })
      );
      await Promise.all(updatePromises);
      dispatch(clearFileSelection());
    } catch (error) {
      console.error('Échec de la mise à jour des fichiers:', error);
    }
  };

  const handleBulkDownload = () => {
    // TODO: Implement bulk download
    console.log('Téléchargement en lot:', selectedFiles);
  };

  // Handle individual file actions
  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId);
    } catch (error) {
      console.error('Échec de la suppression du fichier:', error);
    }
  };

  const handleTogglePublic = async (fileId: string, isPublic: boolean) => {
    try {
      await updateFile({ id: fileId, updates: { is_public: isPublic } });
    } catch (error) {
      console.error('Échec de la mise à jour du fichier:', error);
    }
  };

  // Confirm delete dialog
  const handleConfirmDelete = async () => {
    try {
      const deletePromises = filesToDelete.map(fileId => deleteFile(fileId));
      await Promise.all(deletePromises);
      dispatch(clearFileSelection());
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Échec de la suppression des fichiers:', error);
    }
  };

  // Memoized sorted files for better performance
  const sortedFiles = useMemo(() => {
    if (!filesData?.results) return [];
    
    return [...filesData.results].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'original_name':
          aValue = a.original_name.toLowerCase();
          bValue = b.original_name.toLowerCase();
          break;
        case 'file_size_mb':
          aValue = a.file_size_mb || 0;
          bValue = b.file_size_mb || 0;
          break;
        case 'file_type':
          aValue = a.file_type || '';
          bValue = b.file_type || '';
          break;
        case 'uploaded_at':
        default:
          aValue = new Date(a.uploaded_at).getTime();
          bValue = new Date(b.uploaded_at).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filesData?.results, sortBy, sortOrder]);

  // Loading skeleton component
  const FileSkeleton = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="rectangular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
          <Skeleton variant="rectangular" width={100} height={32} />
        </Box>
      </CardContent>
    </Card>
  );

  // Update pagination when data changes
  React.useEffect(() => {
    if (filesData) {
      dispatch(setPagination({
        currentPage: filesData.page,
        totalPages: filesData.pages,
        totalCount: filesData.count,
        pageSize: pagination.pageSize
      }));
    }
  }, [filesData, dispatch, pagination.pageSize]);

  if (error) {
    // RTK Query error structure
    let errorMessage = 'Erreur inconnue';
    
    if ('data' in error) {
      // Server error with data
      errorMessage = (error.data as any)?.message || (error.data as any)?.detail || 'Erreur du serveur';
    } else if ('status' in error) {
      // HTTP error
      const status = error.status;
      if (typeof status === 'number') {
        switch (status) {
          case 401:
            errorMessage = 'Erreur 401: Non autorisé';
            break;
          case 403:
            errorMessage = 'Erreur 403: Accès refusé';
            break;
          case 404:
            errorMessage = 'Erreur 404: Fichiers non trouvés';
            break;
          case 500:
            errorMessage = 'Erreur 500: Erreur du serveur';
            break;
          default:
            errorMessage = `Erreur ${status}: Erreur de connexion`;
        }
      } else {
        // RTK Query error types
        switch (status) {
          case 'FETCH_ERROR':
            errorMessage = 'Erreur de connexion: Impossible de joindre le serveur';
            break;
          case 'TIMEOUT_ERROR':
            errorMessage = 'Erreur de délai d\'attente: Le serveur met trop de temps à répondre';
            break;
          case 'CUSTOM_ERROR':
            errorMessage = 'Erreur personnalisée';
            break;
          default:
            errorMessage = `Erreur ${status}`;
        }
      }
    }

    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Échec du chargement des fichiers
        </Typography>
        <Typography variant="body2">
          {errorMessage}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => refetch()} 
          sx={{ mt: 1 }}
          startIcon={<RefreshIcon />}
        >
          Réessayer
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher des fichiers..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleSearchChange('')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            size="small"
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            size="small"
          >
            Filtres
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Navigateur de Fichiers ({filesData?.count || 0} fichiers)
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Actualiser">
              <IconButton onClick={() => refetch()} disabled={isLoading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Vue Liste">
              <IconButton
                onClick={() => dispatch(setViewMode('list'))}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Vue Grille">
              <IconButton
                onClick={() => dispatch(setViewMode('grid'))}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Sort Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SortIcon fontSize="small" color="action" />
            <Typography variant="body2" color="textSecondary">Trier par :</Typography>
          </Box>

          {[
            { value: 'uploaded_at', label: 'Date de Téléchargement' },
            { value: 'original_name', label: 'Nom du Fichier' },
            { value: 'file_size_mb', label: 'Taille du Fichier' },
            { value: 'file_type', label: 'Type de Fichier' }
          ].map((option) => (
            <Button
              key={option.value}
              size="small"
              variant={sortBy === option.value ? 'contained' : 'outlined'}
              onClick={() => handleSortChange(option.value as any)}
              endIcon={
                sortBy === option.value ? (
                  <Typography variant="caption">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Typography>
                ) : undefined
              }
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Filters */}
      <FileFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        totalFiles={filesData?.count || 0}
      />

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1">
                {selectedFiles.length} fichier(s) sélectionné(s)
              </Typography>
              
              <Button
                size="small"
                variant="outlined"
                onClick={handleSelectAll}
              >
                {selectedFiles.length === filesData?.results.length ? 'Tout Désélectionner' : 'Tout Sélectionner'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleBulkDownload}
              >
                Télécharger Sélectionnés
              </Button>

              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => handleBulkTogglePublic(true)}
              >
                Rendre Public
              </Button>

              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityOffIcon />}
                onClick={() => handleBulkTogglePublic(false)}
              >
                Rendre Privé
              </Button>

              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
              >
                Supprimer Sélectionnés
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* File List */}
      {isLoading ? (
        <Box>
          {[...Array(5)].map((_, index) => (
            <FileSkeleton key={index} />
          ))}
        </Box>
      ) : sortedFiles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Aucun fichier trouvé
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {Object.keys(filters).length > 0 
              ? 'Essayez d\'ajuster vos filtres ou termes de recherche'
              : 'Téléchargez votre premier fichier pour commencer'
            }
          </Typography>
        </Paper>
      ) : (
        <Box>
          {/* Files Grid/List */}
          <Box sx={{ 
            display: viewMode === 'grid' ? 'grid' : 'block',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : '1fr',
            gap: 2,
            minHeight: '400px' // Prevent layout shift
          }}>
            {sortedFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onEdit={onEditFile}
                onDelete={handleDeleteFile}
                onDownload={onDownloadFile}
                onTogglePublic={handleTogglePublic}
                selected={selectedFiles.includes(file.id)}
                onSelect={handleFileSelect}
              />
            ))}
          </Box>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Paper sx={{ p: 2, mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Affichage de {((pagination.currentPage - 1) * pagination.pageSize) + 1} à{' '}
                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} sur{' '}
                    {pagination.totalCount} fichiers
                  </Typography>

                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={pagination.pageSize}
                      onChange={handlePageSizeChange}
                    >
                      <MenuItem value={10}>10 par page</MenuItem>
                      <MenuItem value={20}>20 par page</MenuItem>
                      <MenuItem value={50}>50 par page</MenuItem>
                      <MenuItem value={100}>100 par page</MenuItem>
                      <MenuItem value={200}>200 par page</MenuItem>
                      <MenuItem value={500}>500 par page</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                  color="primary"
                  size="small"
                  siblingCount={1}
                  boundaryCount={1}
                />
              </Box>
            </Paper>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la Suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer {filesToDelete.length} fichier(s) sélectionné(s) ? 
            Cette action ne peut pas être annulée.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileBrowser;
