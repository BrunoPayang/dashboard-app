import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileItem, FileFilters, FileUploadProgress } from './types/file';

interface FileState {
  files: FileItem[];
  loading: boolean;
  error: string | null;
  filters: FileFilters;
  selectedFiles: string[];
  uploadProgress: FileUploadProgress[];
  viewMode: 'grid' | 'list';
  sortBy: 'original_name' | 'uploaded_at' | 'file_size_mb' | 'file_type';
  sortOrder: 'asc' | 'desc';
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
  filters: {},
  selectedFiles: [],
  uploadProgress: [],
  viewMode: 'grid',
  sortBy: 'uploaded_at',
  sortOrder: 'desc',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 20
  }
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileItem[]>) => {
      state.files = action.payload;
    },
    addFile: (state, action: PayloadAction<FileItem>) => {
      state.files.unshift(action.payload);
    },
    updateFile: (state, action: PayloadAction<{ id: string; updates: Partial<FileItem> }>) => {
      const index = state.files.findIndex(file => file.id === action.payload.id);
      if (index !== -1) {
        state.files[index] = { ...state.files[index], ...action.payload.updates };
      }
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
      state.selectedFiles = state.selectedFiles.filter(id => id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<FileFilters>) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.currentPage = 1;
    },
    toggleFileSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedFiles.indexOf(action.payload);
      if (index === -1) {
        state.selectedFiles.push(action.payload);
      } else {
        state.selectedFiles.splice(index, 1);
      }
    },
    selectAllFiles: (state) => {
      state.selectedFiles = state.files.map(file => file.id);
    },
    clearFileSelection: (state) => {
      state.selectedFiles = [];
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'original_name' | 'uploaded_at' | 'file_size_mb' | 'file_type'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setPagination: (state, action: PayloadAction<{
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    }>) => {
      state.pagination = action.payload;
    },
    addUploadProgress: (state, action: PayloadAction<FileUploadProgress>) => {
      state.uploadProgress.push(action.payload);
    },
    updateUploadProgress: (state, action: PayloadAction<{ fileId: string; updates: Partial<FileUploadProgress> }>) => {
      const index = state.uploadProgress.findIndex(progress => progress.fileId === action.payload.fileId);
      if (index !== -1) {
        state.uploadProgress[index] = { ...state.uploadProgress[index], ...action.payload.updates };
      }
    },
    removeUploadProgress: (state, action: PayloadAction<string>) => {
      state.uploadProgress = state.uploadProgress.filter(progress => progress.fileId !== action.payload);
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = [];
    }
  }
});

export const {
  setFiles,
  addFile,
  updateFile,
  removeFile,
  setLoading,
  setError,
  setFilters,
  clearFilters,
  toggleFileSelection,
  selectAllFiles,
  clearFileSelection,
  setViewMode,
  setSortBy,
  setSortOrder,
  setPagination,
  addUploadProgress,
  updateUploadProgress,
  removeUploadProgress,
  clearUploadProgress
} = fileSlice.actions;

export default fileSlice.reducer;
