import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Parent {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'parent';
  school: number;
  phone?: string;
  is_active: boolean;
}

export const parentsApi = createApi({
  reducerPath: 'parentsApi',
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
  tagTypes: ['Parent'],
  endpoints: (builder) => ({
    getParents: builder.query<Parent[], void>({
      query: () => '/api/parents/',
      providesTags: ['Parent'],
    }),
  }),
});

export const {
  useGetParentsQuery,
} = parentsApi;
