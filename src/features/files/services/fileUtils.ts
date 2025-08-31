import { FileType, FileUploadData } from '../types/file';

// File size validation
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_FILE_SIZE_MB = 50;

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// File type validation
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/rtf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'audio/mpeg',
  'audio/wav',
  'audio/aac',
  'video/mp4',
  'video/avi',
  'video/quicktime',
  'video/webm'
];

export const validateFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

// Create FormData for file upload
export const createFileFormData = (uploadData: FileUploadData): FormData => {
  const formData = new FormData();
  
  formData.append('file', uploadData.file);
  formData.append('file_type', uploadData.file_type);
  
  if (uploadData.description) {
    formData.append('description', uploadData.description);
  }
  
  if (uploadData.tags) {
    formData.append('tags', uploadData.tags);
  }
  
  if (uploadData.is_public !== undefined) {
    formData.append('is_public', uploadData.is_public.toString());
  }
  
  return formData;
};

// Get file icon based on type
export const getFileIcon = (fileType: FileType): string => {
  const icons: Record<FileType, string> = {
    transcript: '📄',
    behavior_report: '📋',
    payment_receipt: '💰',
    student_document: '📁',
    other: '📎'
  };
  
  return icons[fileType] || '📎';
};

// Get file type label
export const getFileTypeLabel = (fileType: FileType): string => {
  const labels: Record<FileType, string> = {
    transcript: 'Academic Transcript',
    behavior_report: 'Behavior Report',
    payment_receipt: 'Payment Receipt',
    student_document: 'Student Document',
    other: 'Other'
  };
  
  return labels[fileType] || 'Other';
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get file extension
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

// Check if file is image
export const isImageFile = (contentType: string): boolean => {
  return contentType.startsWith('image/');
};

// Check if file is PDF
export const isPdfFile = (contentType: string): boolean => {
  return contentType === 'application/pdf';
};

// Check if file can be previewed
export const canPreviewFile = (contentType: string): boolean => {
  return isImageFile(contentType) || isPdfFile(contentType);
};

// Generate file preview URL
export const getFilePreviewUrl = (firebaseUrl: string): string => {
  // For now, return the firebase URL directly
  // In the future, this could be enhanced with preview services
  return firebaseUrl;
};

// Validate file upload data
export const validateFileUpload = (uploadData: FileUploadData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!uploadData.file) {
    errors.push('File is required');
  } else {
    if (!validateFileSize(uploadData.file)) {
      errors.push(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
    }
    
    if (!validateFileType(uploadData.file)) {
      errors.push('File type is not supported');
    }
  }
  
  if (!uploadData.file_type) {
    errors.push('File type is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
