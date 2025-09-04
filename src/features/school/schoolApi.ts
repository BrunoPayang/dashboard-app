import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  School,
  SchoolConfigurationResponse,
  SchoolStatistics,
  SchoolListResponse,
  SchoolUpdateRequest,
  SchoolConfigurationUpdateRequest,
} from '../../types/school';

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
  tagTypes: ['School', 'SchoolConfiguration', 'SchoolStatistics'],
  endpoints: (builder) => ({
    // School Management Endpoints
    getSchools: builder.query<SchoolListResponse, {
      search?: string;
      school_type?: string;
      city?: string;
      state?: string;
      country?: string;
      is_active?: boolean;
      is_verified?: boolean;
      page?: number;
      page_size?: number;
    }>({
      query: (params) => ({
        url: '/api/schools/',
        params,
      }),
      providesTags: ['School'],
    }),
    
    getSchool: builder.query<School, string>({
      query: (id) => `/api/schools/${id}/`,
      providesTags: (result, error, id) => [{ type: 'School', id }],
    }),
    
    createSchool: builder.mutation<School, Partial<School>>({
      query: (school) => ({
        url: '/api/schools/',
        method: 'POST',
        body: school,
      }),
      invalidatesTags: ['School'],
    }),
    
    updateSchool: builder.mutation<School, { id: string; data: SchoolUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/api/schools/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'School', id },
        { type: 'SchoolConfiguration', id },
      ],
    }),
    
    patchSchool: builder.mutation<School, { id: string; data: Partial<SchoolUpdateRequest> }>({
      query: ({ id, data }) => ({
        url: `/api/schools/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'School', id },
        { type: 'SchoolConfiguration', id },
      ],
    }),
    
    deleteSchool: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/schools/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['School'],
    }),
    
    // School Configuration Endpoints
    getSchoolConfiguration: builder.query<SchoolConfigurationResponse, string>({
      query: (id) => `/api/schools/${id}/configuration/`,
      providesTags: (result, error, id) => [{ type: 'SchoolConfiguration', id }],
    }),
    
    updateSchoolConfiguration: builder.mutation<SchoolConfigurationResponse, { 
      id: string; 
      data: SchoolConfigurationUpdateRequest 
    }>({
      query: ({ id, data }) => ({
        url: `/api/schools/${id}/configuration/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SchoolConfiguration', id },
        { type: 'School', id },
      ],
    }),
    
    patchSchoolConfiguration: builder.mutation<SchoolConfigurationResponse, { 
      id: string; 
      data: Partial<SchoolConfigurationUpdateRequest> 
    }>({
      query: ({ id, data }) => ({
        url: `/api/schools/${id}/configuration/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SchoolConfiguration', id },
        { type: 'School', id },
      ],
    }),
    
    // School Statistics
    getSchoolStatistics: builder.query<SchoolStatistics, string>({
      query: (id) => `/api/schools/${id}/statistics/`,
      providesTags: (result, error, id) => [{ type: 'SchoolStatistics', id }],
    }),
    
    // School Status Management
    activateSchool: builder.mutation<{ message: string; is_active: boolean }, string>({
      query: (id) => ({
        url: `/api/schools/${id}/activate/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'School', id },
        { type: 'SchoolConfiguration', id },
      ],
    }),
    
    deactivateSchool: builder.mutation<{ message: string; is_active: boolean }, string>({
      query: (id) => ({
        url: `/api/schools/${id}/deactivate/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'School', id },
        { type: 'SchoolConfiguration', id },
      ],
    }),
  }),
});

export const {
  useGetSchoolsQuery,
  useGetSchoolQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  usePatchSchoolMutation,
  useDeleteSchoolMutation,
  useGetSchoolConfigurationQuery,
  useUpdateSchoolConfigurationMutation,
  usePatchSchoolConfigurationMutation,
  useGetSchoolStatisticsQuery,
  useActivateSchoolMutation,
  useDeactivateSchoolMutation,
} = schoolApi;
