import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface School {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  primary_color?: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const schoolApi = createApi({
  reducerPath: 'schoolApi',
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
  tagTypes: ['School'],
  endpoints: (builder) => ({
    getSchool: builder.query<School, number>({
      query: (id) => `/api/schools/${id}/`,
      providesTags: (result, error, id) => [{ type: 'School', id }],
    }),
  }),
});

export const {
  useGetSchoolQuery,
} = schoolApi;
