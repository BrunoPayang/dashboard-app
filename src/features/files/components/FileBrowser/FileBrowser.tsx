import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Sort as SortIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as RefreshIcon
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

  const [deleteFile] = useDeleteFileMutation();
  const [updateFile] = useUpdateFileMutation();

  // Local state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);

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

  // Handle filters
  const handleFiltersChange = useCallback((newFilters: FiltersType) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
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
      console.error('Failed to update files:', error);
    }
  };

  const handleBulkDownload = () => {
    // TODO: Implement bulk download
    console.log('Bulk download:', selectedFiles);
  };

  // Handle individual file actions
  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleTogglePublic = async (fileId: string, isPublic: boolean) => {
    try {
      await updateFile({ id: fileId, updates: { is_public: isPublic } });
    } catch (error) {
      console.error('Failed to update file:', error);
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
      console.error('Failed to delete files:', error);
    }
  };

  // Sort files
  const sortedFiles = filesData?.results ? [...filesData.results].sort((a, b) => {
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
        aValue = a.file_type;
        bValue = b.file_type;
        break;
      case 'uploaded_at':
      default:
        aValue = new Date(a.uploaded_at);
        bValue = new Date(b.uploaded_at);
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  }) : [];

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
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load files: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            File Browser ({filesData?.count || 0} files)
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => refetch()} disabled={isLoading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="List View">
              <IconButton
                onClick={() => dispatch(setViewMode('list'))}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Grid View">
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
            <Typography variant="body2" color="textSecondary">Sort by:</Typography>
          </Box>

          {[
            { value: 'uploaded_at', label: 'Upload Date' },
            { value: 'original_name', label: 'File Name' },
            { value: 'file_size_mb', label: 'File Size' },
            { value: 'file_type', label: 'File Type' }
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
                {selectedFiles.length} file(s) selected
              </Typography>
              
              <Button
                size="small"
                variant="outlined"
                onClick={handleSelectAll}
              >
                {selectedFiles.length === filesData?.results.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleBulkDownload}
              >
                Download Selected
              </Button>

              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => handleBulkTogglePublic(true)}
              >
                Make Public
              </Button>

              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityOffIcon />}
                onClick={() => handleBulkTogglePublic(false)}
              >
                Make Private
              </Button>

              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* File List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : sortedFiles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No files found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {Object.keys(filters).length > 0 
              ? 'Try adjusting your filters or search terms'
              : 'Upload your first file to get started'
            }
          </Typography>
        </Paper>
      ) : (
        <Box>
          {/* Files Grid/List */}
          <Box sx={{ 
            display: viewMode === 'grid' ? 'grid' : 'block',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(400px, 1fr))' : '1fr',
            gap: 2
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
                    Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} of{' '}
                    {pagination.totalCount} files
                  </Typography>

                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={pagination.pageSize}
                      onChange={handlePageSizeChange}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
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
                />
              </Box>
            </Paper>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {filesToDelete.length} selected file(s)? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileBrowser;
