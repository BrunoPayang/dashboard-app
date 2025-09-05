import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FileItem, FileUpdateData, FilesResponse } from '../types/file';

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['File'],
  endpoints: (builder) => ({
    // Get files with pagination and filtering
    getFiles: builder.query<FilesResponse, {
      page?: number;
      page_size?: number;
      search?: string;
      file_type?: string;
      is_public?: boolean;
    }>({
      query: (params) => ({
        url: '/files/',
        params: {
          page: params.page || 1,
          page_size: params.page_size || 20,
          ...(params.search && { search: params.search }),
          ...(params.file_type && { file_type: params.file_type }),
          ...(params.is_public !== undefined && { is_public: params.is_public })
        }
      }),
      providesTags: ['File'],
    }),

    // Get single file details
    getFile: builder.query<FileItem, string>({
      query: (id) => `/files/${id}/`,
      providesTags: (result, error, id) => [{ type: 'File', id }],
    }),

    // Upload file
    uploadFile: builder.mutation<FileItem, FormData>({
      query: (formData) => ({
        url: '/files/',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with boundary
      }),
      invalidatesTags: ['File'],
    }),

    // Update file metadata
    updateFile: builder.mutation<FileItem, { id: string; updates: FileUpdateData }>({
      query: ({ id, updates }) => ({
        url: `/files/${id}/`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'File', id }, 'File'],
    }),

    // Delete file
    deleteFile: builder.mutation<void, string>({
      query: (id) => ({
        url: `/files/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['File'],
    }),

    // Bulk delete files
    bulkDeleteFiles: builder.mutation<void, string[]>({
      query: (fileIds) => ({
        url: '/files/bulk-delete/',
        method: 'POST',
        body: { file_ids: fileIds },
      }),
      invalidatesTags: ['File'],
    }),
  }),
});

export const {
  useGetFilesQuery,
  useGetFileQuery,
  useUploadFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
  useBulkDeleteFilesMutation,
} = fileApi;
