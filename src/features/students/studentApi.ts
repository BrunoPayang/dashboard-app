import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  Student, 
  StudentListResponse, 
  StudentCreateRequest, 
  StudentUpdateRequest,
  StudentSearchParams 
} from '../../types/student';

export const studentApi = createApi({
  reducerPath: 'studentApi',
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
  tagTypes: ['Student'],
  endpoints: (builder) => ({
    // Get students list with search, filtering, and pagination
    getStudents: builder.query<StudentListResponse, StudentSearchParams & { schoolId?: string }>({
      query: (params) => {
        // Use the schoolId passed from the component
        const schoolId = params.schoolId || '';
        
        if (!schoolId) {
          console.error('No school ID provided for students query');
        }
        
        const queryParams = {
          page: params.page || 1,
          page_size: params.page_size || 10,
          school: schoolId, // Always include user's school
          ...(params.search && { search: params.search }),
          ...(params.class_level && { class_level: params.class_level }),
          ...(params.is_active !== undefined && { is_active: params.is_active }),
          ...(params.ordering && { ordering: params.ordering }),
        };
        
        console.log('RTK Query - Making request to students/ with params:', queryParams);
        console.log('RTK Query - Full URL will be:', `${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api'}/students/?${new URLSearchParams(queryParams as any).toString()}`);
        
        return {
          url: 'students/',
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Student' as const, id })),
              { type: 'Student', id: 'LIST' },
            ]
          : [{ type: 'Student', id: 'LIST' }],
    }),

    // Get single student by ID
    getStudent: builder.query<Student, string>({
      query: (id) => `students/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // Create new student
    createStudent: builder.mutation<Student, StudentCreateRequest>({
      query: (student) => {
        console.log('Creating student with data:', student);
        return {
          url: 'students/',
          method: 'POST',
          body: student,
        };
      },
      async onQueryStarted(student, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log('Student created successfully:', result.data);
        } catch (error: any) {
          console.error('Student creation failed:', error);
          console.error('Error details:', error.error);
        }
      },
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
    }),

    // Update existing student
    updateStudent: builder.mutation<Student, { id: string; data: StudentUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `students/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Student', id },
        { type: 'Student', id: 'LIST' },
      ],
    }),

    // Delete student
    deleteStudent: builder.mutation<void, string>({
      query: (id) => ({
        url: `students/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Student', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
