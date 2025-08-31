import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { FileItem, FileUpdateData } from '../../types/file';
import { useUpdateFileMutation } from '../../services/fileApi';

interface FileEditModalProps {
  open: boolean;
  file: FileItem | null;
  onClose: () => void;
  onSave: (file: FileItem) => void;
}

const FileEditModal: React.FC<FileEditModalProps> = ({
  open,
  file,
  onClose,
  onSave
}) => {
  const [updateFile] = useUpdateFileMutation();
  const [formData, setFormData] = useState<FileUpdateData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setFormData({
        description: file.description || '',
        tags: file.tags || '',
        is_public: file.is_public
      });
      setError(null);
    }
  }, [file]);

  const handleInputChange = (field: keyof FileUpdateData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const updatedFile = await updateFile({ id: file.id, updates: formData }).unwrap();
      onSave(updatedFile);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update file');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!file) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit File: {file.original_name}</DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* File Info Display */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>File Type:</strong> {file.file_type}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Size:</strong> {file.file_size_mb ? `${file.file_size_mb} MB` : 'Unknown'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Uploaded:</strong> {new Date(file.uploaded_at).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={3}
              placeholder="Enter file description..."
            />

            {/* Tags */}
            <TextField
              fullWidth
              label="Tags"
              value={formData.tags || ''}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas..."
              helperText="Use commas to separate multiple tags"
            />

            {/* Public/Private Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_public || false}
                  onChange={(e) => handleInputChange('is_public', e.target.checked)}
                />
              }
              label="Make file public"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileEditModal;
