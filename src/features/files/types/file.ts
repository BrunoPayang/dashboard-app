export interface FileItem {
  id: string;
  original_name: string;
  firebase_url: string;
  file_size_mb: number;
  content_type: string;
  file_type: FileType;
  description?: string;
  tags?: string;
  is_public: boolean;
  uploaded_by: number;
  uploaded_by_name: string;
  school_name: string;
  uploaded_at: string;
}

export type FileType = 'transcript' | 'behavior_report' | 'payment_receipt' | 'student_document' | 'other';

export interface FileFilters {
  search?: string;
  file_type?: FileType;
  is_public?: boolean;
}

export interface FileUploadData {
  file: File;
  file_type: FileType;
  description?: string;
  tags?: string;
  is_public?: boolean;
}

export interface FileUpdateData {
  description?: string;
  tags?: string;
  is_public?: boolean;
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface FilesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FileItem[];
  page: number;
  pages: number;
}

export const FILE_TYPES = [
  { value: 'transcript', label: 'Academic Transcript', icon: '📄' },
  { value: 'behavior_report', label: 'Behavior Report', icon: '📋' },
  { value: 'payment_receipt', label: 'Payment Receipt', icon: '💰' },
  { value: 'student_document', label: 'Student Document', icon: '📁' },
  { value: 'other', label: 'Other', icon: '📎' }
] as const;

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  transcript: 'Academic Transcript',
  behavior_report: 'Behavior Report',
  payment_receipt: 'Payment Receipt',
  student_document: 'Student Document',
  other: 'Other'
};

export const FILE_TYPE_ICONS: Record<FileType, string> = {
  transcript: '📄',
  behavior_report: '📋',
  payment_receipt: '💰',
  student_document: '📁',
  other: '📎'
};
