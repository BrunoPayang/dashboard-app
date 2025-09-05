import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { FileType, FILE_TYPES, FileUploadData } from '../../types/file';
import { formatFileSize } from '../../services/fileUtils';

interface FileUploadListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onUpload: (uploadData: FileUploadData[]) => void;
  onCancel: () => void;
  uploading?: boolean;
}

const FileUploadList: React.FC<FileUploadListProps> = ({
  files,
  onRemoveFile,
  onUpload,
  onCancel,
  uploading = false
}) => {
  const [fileData, setFileData] = useState<FileUploadData[]>(
    files.map(file => ({
      file,
      file_type: 'other' as FileType,
      description: '',
      tags: '',
      is_public: false
    }))
  );

  const handleFileTypeChange = (index: number, fileType: FileType) => {
    const newFileData = [...fileData];
    newFileData[index].file_type = fileType;
    setFileData(newFileData);
  };

  const handleDescriptionChange = (index: number, description: string) => {
    const newFileData = [...fileData];
    newFileData[index].description = description;
    setFileData(newFileData);
  };

  const handleTagsChange = (index: number, tags: string) => {
    const newFileData = [...fileData];
    newFileData[index].tags = tags;
    setFileData(newFileData);
  };

  const handlePublicChange = (index: number, isPublic: boolean) => {
    const newFileData = [...fileData];
    newFileData[index].is_public = isPublic;
    setFileData(newFileData);
  };

  const handleUpload = () => {
    onUpload(fileData);
  };

  const getFileIconByExtension = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📎';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Fichiers à Télécharger ({files.length})
      </Typography>

      {fileData.map((data, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* File Icon */}
              <Box sx={{ fontSize: 32, mt: 1 }}>
                {getFileIconByExtension(data.file.name)}
              </Box>

              {/* File Info */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {data.file.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {formatFileSize(data.file.size)} • {data.file.type}
                </Typography>

                {/* File Type Selection */}
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Type de Fichier</InputLabel>
                  <Select
                    value={data.file_type}
                    label="Type de Fichier"
                    onChange={(e) => handleFileTypeChange(index, e.target.value as FileType)}
                  >
                    {FILE_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Description */}
                <TextField
                  fullWidth
                  size="small"
                  label="Description (optionnel)"
                  value={data.description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* Tags */}
                <TextField
                  fullWidth
                  size="small"
                  label="Étiquettes (optionnel)"
                  value={data.tags}
                  onChange={(e) => handleTagsChange(index, e.target.value)}
                  placeholder="académique, relevé, 2024"
                  sx={{ mb: 2 }}
                />

                {/* Public/Private Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={data.is_public}
                      onChange={(e) => handlePublicChange(index, e.target.checked)}
                      size="small"
                    />
                  }
                  label="Rendre le fichier public"
                />
              </Box>

              {/* Remove Button */}
              <IconButton
                color="error"
                onClick={() => onRemoveFile(index)}
                disabled={uploading}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={uploading}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          startIcon={<DescriptionIcon />}
        >
          {uploading ? 'Téléchargement...' : `Télécharger ${files.length} Fichier${files.length !== 1 ? 's' : ''}`}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUploadList;
