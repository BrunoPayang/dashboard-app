## Implementation Phases (Updated for Actual API)

### 📅 **Phase 6.2.1: Foundation & File Upload (Days 1-2)**

#### **Day 1: Core Infrastructure**
- [ ] Create file type definitions (`types/file.ts`) - Match API structure
- [ ] Set up Redux slice for file management (`fileSlice.ts`)
- [ ] Create file API service (`fileApi.ts`) - Use actual endpoints
- [ ] Implement basic file utilities (`fileUtils.ts`)

#### **Day 2: File Upload System**
- [ ] Create drag & drop upload zone (`FileUploadZone.tsx`)
- [ ] Implement file upload progress tracking (`FileUploadProgress.tsx`)
- [ ] Add file validation and error handling
- [ ] Create upload list component (`FileUploadList.tsx`)
- [ ] Handle multipart/form-data uploads

### 📅 **Phase 6.2.2: File Browser & Organization (Days 3-4)**

#### **Day 3: File Browser Interface**
- [ ] Create main file browser (`FileBrowser.tsx`)
- [ ] Implement file grid view (`FileGrid.tsx`)
- [ ] Add file list view (`FileList.tsx`)
- [ ] Create individual file cards (`FileCard.tsx`)

#### **Day 4: File Organization**
- [ ] Implement file type categorization (transcript, behavior_report, etc.)
- [ ] Add file metadata display (`FileMetadata.tsx`)
- [ ] Implement file sorting and grouping
- [ ] Add public/private file filtering

### 📅 **Phase 6.2.3: Search & Filtering (Day 5)**

#### **Day 5: Advanced Search**
- [ ] Create search interface (`FileFilters.tsx`)
- [ ] Implement search in filename, description, and tags
- [ ] Add file type filtering
- [ ] Add public/private status filtering
- [ ] Create search results highlighting

### 📅 **Phase 6.2.4: File Management & Polish (Day 6)**

#### **Day 6: File Operations**
- [ ] Create file details modal (`FileDetailsModal.tsx`)
- [ ] Implement file metadata editing
- [ ] Add file deletion with confirmation
- [ ] Create file preview component (`FilePreview.tsx`)

### 📅 **Phase 6.2.5: Integration & Testing (Day 7)**

#### **Day 7: Final Integration**
- [ ] Integrate with existing dashboard
- [ ] Add file management to navigation
- [ ] Implement error handling and loading states
- [ ] Final testing and bug fixes

## Updated Component Specifications

### 📤 **FileUploadZone.tsx**
```typescript
interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
  dragActive?: boolean;
}
```

**Features:**
- Drag & drop interface with visual feedback
- File type validation (transcript, behavior_report, payment_receipt, student_document, other)
- File size validation
- Multiple file selection
- Upload progress indication
- Multipart/form-data handling

### 🔍 **FileBrowser.tsx**
```typescript
interface FileBrowserProps {
  viewMode: 'grid' | 'list';
  sortBy: 'original_name' | 'uploaded_at' | 'file_size_mb' | 'file_type';
  sortOrder: 'asc' | 'desc';
  filters: FileFilters;
  onFileSelect: (file: FileItem) => void;
}

interface FileFilters {
  search?: string;
  file_type?: string;
  is_public?: boolean;
}
```

**Features:**
- Grid and list view modes
- Sortable columns (name, date, size, type)
- Filterable content (search, file type, public status)
- Pagination support
- Bulk selection

### 📋 **FileCard.tsx**
```typescript
interface FileCardProps {
  file: FileItem;
  onSelect: (file: FileItem) => void;
  onEdit: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onPreview: (file: FileItem) => void;
}
```

**Features:**
- File icon based on type
- File name and metadata display
- Quick action buttons (edit, delete, preview)
- Selection state
- Public/private status indicator

### 📝 **FileDetailsModal.tsx**
```typescript
interface FileDetailsModalProps {
  file: FileItem;
  open: boolean;
  onClose: () => void;
  onUpdate: (fileId: string, updates: Partial<FileItem>) => void;
}
```

**Features:**
- File metadata display
- Editable description and tags
- Public/private toggle
- File preview
- Download link
