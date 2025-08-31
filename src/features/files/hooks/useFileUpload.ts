import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useUploadFileMutation } from '../services/fileApi';
import { 
  addUploadProgress, 
  updateUploadProgress, 
  removeUploadProgress,
  addFile 
} from '../fileSlice';
import { FileUploadData, FileUploadProgress } from '../types/file';
import { createFileFormData, validateFileUpload } from '../services/fileUtils';

export const useFileUpload = () => {
  const dispatch = useDispatch();
  const [uploadFile] = useUploadFileMutation();
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(async (uploadDataList: FileUploadData[]) => {
    setUploading(true);
    
    try {
      const uploadPromises = uploadDataList.map(async (uploadData) => {
        // Validate upload data
        const validation = validateFileUpload(uploadData);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }

        // Create unique file ID for progress tracking
        const fileId = `${Date.now()}-${Math.random()}`;
        
        // Add initial progress
        const initialProgress: FileUploadProgress = {
          fileId,
          fileName: uploadData.file.name,
          progress: 0,
          status: 'uploading'
        };
        
        dispatch(addUploadProgress(initialProgress));

        try {
          // Create FormData
          const formData = createFileFormData(uploadData);
          
          // Upload file
          const result = await uploadFile(formData).unwrap();
          
          // Update progress to completed
          dispatch(updateUploadProgress({
            fileId,
            updates: {
              progress: 100,
              status: 'completed'
            }
          }));
          
          // Add file to store
          dispatch(addFile(result));
          
          // Remove progress after a delay
          setTimeout(() => {
            dispatch(removeUploadProgress(fileId));
          }, 3000);
          
          return result;
        } catch (error) {
          // Update progress to error
          dispatch(updateUploadProgress({
            fileId,
            updates: {
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          }));
          
          throw error;
        }
      });

      await Promise.all(uploadPromises);
      
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [dispatch, uploadFile]);

  const cancelUpload = useCallback((fileId: string) => {
    dispatch(removeUploadProgress(fileId));
  }, [dispatch]);

  const retryUpload = useCallback(async (fileId: string, uploadData: FileUploadData) => {
    try {
      // Reset progress
      dispatch(updateUploadProgress({
        fileId,
        updates: {
          progress: 0,
          status: 'uploading',
          error: undefined
        }
      }));

      // Retry upload
      const formData = createFileFormData(uploadData);
      const result = await uploadFile(formData).unwrap();
      
      // Update progress to completed
      dispatch(updateUploadProgress({
        fileId,
        updates: {
          progress: 100,
          status: 'completed'
        }
      }));
      
      // Add file to store
      dispatch(addFile(result));
      
      // Remove progress after a delay
      setTimeout(() => {
        dispatch(removeUploadProgress(fileId));
      }, 3000);
      
      return result;
    } catch (error) {
      // Update progress to error
      dispatch(updateUploadProgress({
        fileId,
        updates: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        }
      }));
      
      throw error;
    }
  }, [dispatch, uploadFile]);

  return {
    uploadFiles,
    cancelUpload,
    retryUpload,
    uploading
  };
};
