import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Pagination
} from '@mui/material';
import {
  PhotoLibrary as PhotoLibraryIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { useGetFilesQuery } from '../../features/files/services/fileApi';
import { FileItem } from '../../features/files/types/file';

interface LogoFileSelectorProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
}

const LogoFileSelector: React.FC<LogoFileSelectorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error = false,
  fullWidth = true
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // Query files with search and pagination
  const { data: filesData, isLoading, error: apiError } = useGetFilesQuery({
    page: currentPage,
    page_size: 12, // Smaller page size for better UI
    search: searchQuery || undefined,
    // Filter for image files that are likely to be logos
    file_type: undefined // Don't filter by type to allow any file
  });

  // Check if file is an image
  const isImageFile = useCallback((file: FileItem) => {
    return file.content_type.startsWith('image/');
  }, []);

  // Get file icon based on content type
  const getFileIcon = useCallback((file: FileItem) => {
    if (isImageFile(file)) {
      return <ImageIcon />;
    }
    return <FileIcon />;
  }, [isImageFile]);

  // Handle file selection
  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
  };

  // Confirm selection and close dialog
  const handleConfirm = () => {
    if (selectedFile) {
      onChange(selectedFile.firebase_url);
      setDialogOpen(false);
      setSelectedFile(null);
      setSearchQuery('');
      setCurrentPage(1);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setDialogOpen(false);
    setSelectedFile(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Handle manual URL input
  const handleManualChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <TextField
        label={label}
        value={value}
        onChange={handleManualChange}
        placeholder={placeholder}
        helperText={helperText}
        error={error}
        fullWidth={fullWidth}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                size="small"
                startIcon={<PhotoLibraryIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{ minWidth: 'auto', px: 1 }}
              >
                Parcourir
              </Button>
            </InputAdornment>
          )
        }}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '80vh', maxHeight: '800px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Sélectionner un Logo
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Rechercher des fichiers"
              value={searchQuery}
              onChange={handleSearch}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              placeholder="Rechercher par nom de fichier..."
            />
          </Box>

          {/* Loading */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error */}
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Erreur lors du chargement des fichiers. Veuillez réessayer.
            </Alert>
          )}

          {/* Files Grid */}
          {filesData && filesData.results && (
            <>
              <Grid container spacing={2}>
                {filesData.results.map((file) => (
                  <Grid item xs={6} sm={4} md={3} key={file.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedFile?.id === file.id ? 2 : 1,
                        borderColor: selectedFile?.id === file.id ? 'primary.main' : 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          elevation: 2
                        }
                      }}
                      onClick={() => handleFileSelect(file)}
                    >
                      {isImageFile(file) ? (
                        <CardMedia
                          component="img"
                          height="120"
                          image={file.firebase_url}
                          alt={file.original_name}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.100'
                          }}
                        >
                          {getFileIcon(file)}
                        </Box>
                      )}
                      <CardContent sx={{ p: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.75rem'
                          }}
                        >
                          {file.original_name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          <Chip
                            size="small"
                            label={file.file_type}
                            sx={{ fontSize: '0.6rem', height: 16 }}
                          />
                          <Chip
                            size="small"
                            label={`${file.file_size_mb.toFixed(1)}MB`}
                            sx={{ fontSize: '0.6rem', height: 16 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {filesData.pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={filesData.pages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}

              {/* No files message */}
              {filesData.results.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'Aucun fichier trouvé pour cette recherche.' : 'Aucun fichier disponible.'}
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Selected File Preview */}
          {selectedFile && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Fichier sélectionné:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isImageFile(selectedFile) ? (
                  <Box
                    component="img"
                    src={selectedFile.firebase_url}
                    alt={selectedFile.original_name}
                    sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.200',
                      borderRadius: 1
                    }}
                  >
                    {getFileIcon(selectedFile)}
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {selectedFile.original_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedFile.file_size_mb.toFixed(1)}MB • {selectedFile.content_type}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!selectedFile}
          >
            Sélectionner
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoFileSelector;