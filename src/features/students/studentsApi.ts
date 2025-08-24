import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Student {
  id: number;
  school: number;
  first_name: string;
  last_name: string;
  student_id: string;
  class_level: string;
  date_of_birth: string;
  enrollment_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
}

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
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
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    getStudents: builder.query<StudentListResponse, {
      page?: number;
      page_size?: number;
      search?: string;
      class_level?: string;
      is_active?: boolean;
    }>({
      query: (params) => ({
        url: '/api/students/',
        params,
      }),
      providesTags: ['Student'],
    }),
    getStudent: builder.query<Student, number>({
      query: (id) => `/api/students/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation<Student, Partial<Student>>({
      query: (student) => ({
        url: '/api/students/',
        method: 'POST',
        body: student,
      }),
      invalidatesTags: ['Student'],
    }),
    updateStudent: builder.mutation<Student, { id: number; data: Partial<Student> }>({
      query: ({ id, data }) => ({
        url: `/api/students/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }],
    }),
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/students/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
