import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Class, CreateClassRequest, UpdateClassRequest, ClassListResponse } from '../../types/class';

export const classApi = createApi({
  reducerPath: 'classApi',
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
  tagTypes: ['Class'],
  endpoints: (builder) => ({
    // Get classes with pagination and filtering
    getClasses: builder.query<ClassListResponse, {
      page?: number;
      page_size?: number;
      search?: string;
      level?: string;
      section?: string;
      academic_year?: string;
      is_active?: boolean;
      school?: string;
    }>({
      query: (params) => ({
        url: '/classes/',
        params: {
          page: params.page || 1,
          page_size: params.page_size || 20,
          ...(params.search && { search: params.search }),
          ...(params.level && { level: params.level }),
          ...(params.section && { section: params.section }),
          ...(params.academic_year && { academic_year: params.academic_year }),
          ...(params.is_active !== undefined && { is_active: params.is_active }),
          ...(params.school && { school: params.school })
        }
      }),
      providesTags: ['Class'],
    }),

    // Get single class details
    getClass: builder.query<Class, string>({
      query: (id) => `/classes/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Class', id }],
    }),

    // Create new class
    createClass: builder.mutation<Class, CreateClassRequest>({
      query: (classData) => ({
        url: '/classes/',
        method: 'POST',
        body: classData,
      }),
      invalidatesTags: ['Class'],
    }),

    // Update class
    updateClass: builder.mutation<Class, { id: string; data: UpdateClassRequest }>({
      query: ({ id, data }) => ({
        url: `/classes/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Class', id }, 'Class'],
    }),

    // Partial update class
    patchClass: builder.mutation<Class, { id: string; data: Partial<UpdateClassRequest> }>({
      query: ({ id, data }) => ({
        url: `/classes/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Class', id }, 'Class'],
    }),

    // Delete class
    deleteClass: builder.mutation<void, string>({
      query: (id) => ({
        url: `/classes/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),

    // Bulk delete classes
    bulkDeleteClasses: builder.mutation<void, string[]>({
      query: (classIds) => ({
        url: '/classes/bulk-delete/',
        method: 'POST',
        body: { class_ids: classIds },
      }),
      invalidatesTags: ['Class'],
    }),

    // Get classes for dropdown (simplified list)
    getClassesForDropdown: builder.query<Class[], { school?: string; academic_year?: string; is_active?: boolean }>({
      query: (params) => ({
        url: '/classes/',
        params: {
          page_size: 100, // Get more classes for dropdown
          ...(params.school && { school: params.school }),
          ...(params.academic_year && { academic_year: params.academic_year }),
          ...(params.is_active !== undefined && { is_active: params.is_active })
        }
      }),
      transformResponse: (response: ClassListResponse) => response.results,
      providesTags: ['Class'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  usePatchClassMutation,
  useDeleteClassMutation,
  useBulkDeleteClassesMutation,
  useGetClassesForDropdownQuery,
} = classApi;
