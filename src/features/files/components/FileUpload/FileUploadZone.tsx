import React, { useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { FileType, FILE_TYPES } from '../../types/file';
import { validateFileSize, validateFileType, MAX_FILE_SIZE_MB } from '../../services/fileUtils';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  disabled?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  allowedTypes = [],
  multiple = true,
  disabled = false
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<FileType>('other');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setErrors([]);
    const newErrors: string[] = [];

    // Validate rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          newErrors.push(`${file.name}: La taille du fichier doit être inférieure à ${MAX_FILE_SIZE_MB}MB`);
        } else if (error.code === 'file-invalid-type') {
          newErrors.push(`${file.name}: Type de fichier non supporté`);
        } else {
          newErrors.push(`${file.name}: ${error.message}`);
        }
      });
    });

    // Validate accepted files
    acceptedFiles.forEach(file => {
      if (!validateFileSize(file)) {
        newErrors.push(`${file.name}: La taille du fichier doit être inférieure à ${MAX_FILE_SIZE_MB}MB`);
      }
      if (!validateFileType(file)) {
        newErrors.push(`${file.name}: Type de fichier non supporté`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // If validation passes, call the callback
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: allowedTypes.length > 0 ? Object.fromEntries(allowedTypes.map(type => [type, []])) : undefined,
    maxSize: maxFileSize,
    multiple,
    disabled
  });

  const getBorderColor = () => {
    if (isDragReject) return 'error.main';
    if (isDragActive) return 'primary.main';
    return 'grey.300';
  };

  const getBackgroundColor = () => {
    if (isDragActive) return 'primary.50';
    return 'background.paper';
  };

  return (
    <Box>
      {/* File Type Selection */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Type de Fichier :
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {FILE_TYPES.map((type) => (
            <Chip
              key={type.value}
              label={`${type.icon} ${type.label}`}
              onClick={() => setSelectedFileType(type.value)}
              color={selectedFileType === type.value ? 'primary' : 'default'}
              variant={selectedFileType === type.value ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Upload Zone */}
      <Paper
        {...getRootProps()}
        sx={{
          border: 2,
          borderColor: getBorderColor(),
          borderStyle: 'dashed',
          borderRadius: 2,
          backgroundColor: getBackgroundColor(),
          p: 4,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: disabled ? 'grey.300' : 'primary.main',
            backgroundColor: disabled ? 'background.paper' : 'primary.50'
          }
        }}
      >
        <input {...getInputProps()} />
        
        <CloudUploadIcon 
          sx={{ 
            fontSize: 48, 
            color: isDragActive ? 'primary.main' : 'grey.400',
            mb: 2 
          }} 
        />
        
        <Typography variant="h6" gutterBottom>
          {isDragActive 
            ? 'Déposez les fichiers ici...' 
            : 'Glissez-déposez les fichiers ici, ou cliquez pour sélectionner'
          }
        </Typography>
        
        <Typography variant="body2" color="textSecondary">
          {multiple ? 'Fichiers multiples autorisés' : 'Un seul fichier'} • 
          Taille max: {MAX_FILE_SIZE_MB}MB • 
          Formats supportés: PDF, DOC, DOCX, TXT, Images, etc.
        </Typography>

        {!isDragActive && (
          <Box sx={{ mt: 2 }}>
            <IconButton
              color="primary"
              size="large"
              disabled={disabled}
            >
              <AddIcon />
            </IconButton>
          </Box>
        )}
      </Paper>

      {/* Error Display */}
      {errors.length > 0 && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setErrors([])}
            >
              <CloseIcon />
            </IconButton>
          }
        >
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Erreurs de Téléchargement :
            </Typography>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2">
                • {error}
              </Typography>
            ))}
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default FileUploadZone;
