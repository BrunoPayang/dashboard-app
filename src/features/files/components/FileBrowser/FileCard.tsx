import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Tooltip,
  Link,
  Avatar
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { FileItem } from '../../types/file';
import { 
  getFileTypeLabel, 
  formatFileSize, 
  formatDate,
  canPreviewFile 
} from '../../services/fileUtils';

interface FileCardProps {
  file: FileItem;
  onEdit?: (file: FileItem) => void;
  onDelete?: (fileId: string) => void;
  onDownload?: (file: FileItem) => void;
  onTogglePublic?: (fileId: string, isPublic: boolean) => void;
  selected?: boolean;
  onSelect?: (fileId: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onEdit,
  onDelete,
  onDownload,
  onTogglePublic,
  selected = false,
  onSelect
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(file);
    } else if (file.firebase_url) {
      // Default download behavior
      const link = document.createElement('a');
      link.href = file.firebase_url;
      link.download = file.original_name;
      link.click();
    }
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

  const getStatusColor = () => {
    if (file.is_public) return 'success';
    return 'default';
  };

  return (
    <Card 
      sx={{ 
        width: '100%', 
        mb: 2,
        border: selected ? '2px solid' : '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {/* File Icon */}
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <Typography variant="h6">
                {getFileIconByExtension(file.original_name)}
              </Typography>
            </Avatar>

            {/* File Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap sx={{ mb: 0.5 }}>
                {file.original_name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={getFileTypeLabel(file.file_type)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                
                <Chip
                  icon={file.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  label={file.is_public ? 'Public' : 'Private'}
                  size="small"
                  color={getStatusColor()}
                  variant="outlined"
                />

                {file.file_size_mb && (
                  <Chip
                    icon={<StorageIcon />}
                    label={formatFileSize(file.file_size_mb * 1024 * 1024)}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onSelect && (
              <Tooltip title={selected ? 'Deselect' : 'Select'}>
                <IconButton
                  size="small"
                  onClick={() => onSelect(file.id)}
                  color={selected ? 'primary' : 'default'}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: selected ? 'primary.main' : 'grey.400',
                      bgcolor: selected ? 'primary.main' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {selected && (
                      <Typography variant="caption" sx={{ color: 'white', fontSize: '0.6rem' }}>
                        ✓
                      </Typography>
                    )}
                  </Box>
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Download">
              <IconButton size="small" onClick={handleDownload} color="primary">
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            {onEdit && (
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => onEdit(file)} color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}

            {onDelete && (
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => onDelete(file.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={expanded ? 'Show less' : 'Show more'}>
              <IconButton
                size="small"
                onClick={handleExpandClick}
                sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Basic Info Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="textSecondary">
              {file.uploaded_by_name || `User ${file.uploaded_by}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SchoolIcon fontSize="small" color="action" />
            <Typography variant="body2" color="textSecondary">
              {file.school_name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="textSecondary">
              {formatDate(file.uploaded_at)}
            </Typography>
          </Box>
        </Box>

        {/* Expanded Details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            
            {/* File Details Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
              
              {/* File Properties */}
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  File Properties
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2">
                    <strong>Content Type:</strong> {file.content_type || 'Not specified'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>File ID:</strong> {file.id}
                  </Typography>
                  {file.file_size_mb && (
                    <Typography variant="body2">
                      <strong>Size:</strong> {formatFileSize(file.file_size_mb * 1024 * 1024)}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Description & Tags */}
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Description & Tags
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2">
                    <strong>Description:</strong> {file.description || 'No description'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tags:</strong> {file.tags || 'No tags'}
                  </Typography>
                </Box>
              </Box>

              {/* Upload Information */}
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Upload Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2">
                    <strong>Uploaded By:</strong> {file.uploaded_by_name || `User ${file.uploaded_by}`}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Upload Date:</strong> {formatDate(file.uploaded_at)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>School:</strong> {file.school_name}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* File URL */}
            {file.firebase_url && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  File URL
                </Typography>
                <Link 
                  href={file.firebase_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ wordBreak: 'break-all' }}
                >
                  {file.firebase_url}
                </Link>
              </Box>
            )}

            {/* Preview Section */}
            {file.firebase_url && canPreviewFile(file.content_type) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Preview
                </Typography>
                <Box sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 1, 
                  p: 1,
                  bgcolor: 'grey.50'
                }}>
                  <Typography variant="body2" color="textSecondary">
                    Preview available for {file.content_type} files
                  </Typography>
                  {/* TODO: Implement actual file preview */}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onTogglePublic && (
            <Tooltip title={file.is_public ? 'Make private' : 'Make public'}>
              <IconButton
                size="small"
                onClick={() => onTogglePublic(file.id, !file.is_public)}
                color={file.is_public ? 'success' : 'default'}
              >
                {file.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography variant="caption" color="textSecondary">
          Click to expand for more details
        </Typography>
      </CardActions>
    </Card>
  );
};

export default FileCard;
