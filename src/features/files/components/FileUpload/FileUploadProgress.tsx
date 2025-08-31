import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { FileUploadProgress as ProgressType } from '../../types/file';

interface FileUploadProgressProps {
  progress: ProgressType;
  onCancel?: (fileId: string) => void;
  onRetry?: (fileId: string, uploadData?: any) => void;
}

const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  progress,
  onCancel,
  onRetry
}) => {
  const getStatusIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <CloudUploadIcon color="primary" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'completed':
        return 'Upload Complete';
      case 'error':
        return 'Upload Failed';
      default:
        return 'Uploading...';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon()}
            <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
              {progress.fileName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={getStatusText()}
              color={getStatusColor() as any}
              size="small"
              variant="outlined"
            />
            
            {progress.status === 'uploading' && onCancel && (
              <IconButton
                size="small"
                onClick={() => onCancel(progress.fileId)}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            )}
            
            {progress.status === 'error' && onRetry && (
              <IconButton
                size="small"
                onClick={() => onRetry(progress.fileId)}
                color="primary"
              >
                <CloudUploadIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {progress.status === 'uploading' && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={progress.progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
              {progress.progress}% complete
            </Typography>
          </Box>
        )}

        {progress.status === 'error' && progress.error && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            Error: {progress.error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

interface FileUploadProgressListProps {
  progressList: ProgressType[];
  onCancel?: (fileId: string) => void;
  onRetry?: (fileId: string, uploadData: any) => void;
}

const FileUploadProgressList: React.FC<FileUploadProgressListProps> = ({
  progressList,
  onCancel,
  onRetry
}) => {
  if (progressList.length === 0) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Progress ({progressList.length})
      </Typography>
      {progressList.map((progress) => (
        <FileUploadProgress
          key={progress.fileId}
          progress={progress}
          onCancel={onCancel}
          onRetry={onRetry}
        />
      ))}
    </Box>
  );
};

export { FileUploadProgressList };
export default FileUploadProgress;
