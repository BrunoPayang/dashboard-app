import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/redux';
import { FileUploadZone, FileUploadList, FileUploadProgressList } from '../../features/files/components/FileUpload';
import { FileBrowser } from '../../features/files/components/FileBrowser';
import { useFileUpload } from '../../features/files/hooks/useFileUpload';
import { FileUploadData, FileItem } from '../../features/files/types/file';

const FilesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showUploadList, setShowUploadList] = useState(false);
  const [uploadDataMap, setUploadDataMap] = useState<Map<string, FileUploadData>>(new Map());
  
  // const { school } = useAppSelector((state: any) => state.auth);
  const { uploadProgress } = useAppSelector((state: any) => state.files);
  

  
  const { uploadFiles, cancelUpload, retryUpload, uploading } = useFileUpload();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setShowUploadList(true);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    if (newFiles.length === 0) {
      setShowUploadList(false);
    }
  };

  const handleUpload = async (uploadData: FileUploadData[]) => {
    try {
      // Store upload data for potential retry
      const newUploadDataMap = new Map();
      uploadData.forEach(data => {
        const fileId = `${data.file.name}-${Date.now()}`;
        newUploadDataMap.set(fileId, data);
      });
      setUploadDataMap(newUploadDataMap);
      
      await uploadFiles(uploadData);
      setSelectedFiles([]);
      setShowUploadList(false);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleRetry = (fileId: string) => {
    const uploadData = uploadDataMap.get(fileId);
    if (uploadData) {
      retryUpload(fileId, uploadData);
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setShowUploadList(false);
  };

  const handleEditFile = (file: FileItem) => {
    // TODO: Implement file editing modal
    console.log('Edit file:', file);
  };

  const handleDownloadFile = (file: FileItem) => {
    if (file.firebase_url) {
      const link = document.createElement('a');
      link.href = file.firebase_url;
      link.download = file.original_name;
      link.click();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          File Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => setActiveTab(0)}
        >
          Upload Files
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>File Management System:</strong> Upload, organize, and manage school files including 
        academic transcripts, behavior reports, payment receipts, and student documents.
      </Alert>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
                  <FileUploadProgressList
          progressList={uploadProgress}
          onCancel={cancelUpload}
          onRetry={handleRetry}
        />
        </Paper>
      )}

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="File management tabs">
          <Tab label="Upload Files" />
          <Tab label="File Browser" />
        </Tabs>

        {/* Upload Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {!showUploadList ? (
              <FileUploadZone
                onFilesSelected={handleFilesSelected}
                multiple={true}
                disabled={uploading}
              />
            ) : (
              <FileUploadList
                files={selectedFiles}
                onRemoveFile={handleRemoveFile}
                onUpload={handleUpload}
                onCancel={handleCancel}
                uploading={uploading}
              />
            )}
          </Box>
        )}

                       {/* File Browser Tab */}
               {activeTab === 1 && (
                 <Box sx={{ p: 3 }}>
                   <FileBrowser
                     onEditFile={handleEditFile}
                     onDownloadFile={handleDownloadFile}
                   />
                 </Box>
               )}
      </Paper>
    </Box>
  );
};

export default FilesPage;
