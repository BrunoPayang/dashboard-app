import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface FileRecord {
  id: number;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: number;
  created_at: string;
}

export const filesApi = createApi({
  reducerPath: 'filesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api',
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
    getFiles: builder.query<FileRecord[], void>({
      query: () => '/api/files/',
      providesTags: ['File'],
    }),
  }),
});

export const {
  useGetFilesQuery,
} = filesApi;
