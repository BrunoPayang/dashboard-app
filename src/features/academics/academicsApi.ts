import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Transcript {
  id: number;
  student: number;
  academic_year: string;
  semester: string;
  file_url: string;
  uploaded_by: number;
  created_at: string;
}

export const academicsApi = createApi({
  reducerPath: 'academicsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Transcript'],
  endpoints: (builder) => ({
    getTranscripts: builder.query<Transcript[], void>({
      query: () => '/api/transcripts/',
      providesTags: ['Transcript'],
    }),
  }),
});

export const {
  useGetTranscriptsQuery,
} = academicsApi;
