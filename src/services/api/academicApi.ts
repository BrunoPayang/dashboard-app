import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { 
  TranscriptRecord, 
  BehaviorReport, 
  StudentStatistics,
  CreateTranscriptRequest,
  CreateBehaviorReportRequest 
} from '../../types/academic';

export const academicApi = createApi({
  reducerPath: 'academicApi',
  baseQuery,
  tagTypes: ['Transcript', 'BehaviorReport', 'StudentStats'],
  endpoints: (builder) => ({
    // Transcript Management
    getTranscripts: builder.query<
      {
        count: number;
        next: string | null;
        previous: string | null;
        results: TranscriptRecord[];
      },
      {
        student?: string;
        academic_year?: string;
        semester?: string;
        search?: string;
        page?: number;
        page_size?: number;
      }
    >({
      query: (params) => ({
        url: '/transcripts/',
        params: Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined)
        ),
      }),
      providesTags: ['Transcript'],
    }),

    getTranscript: builder.query<TranscriptRecord, number>({
      query: (id) => `/transcripts/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Transcript', id }],
    }),

    createTranscript: builder.mutation<TranscriptRecord, CreateTranscriptRequest>({
      query: (data) => ({
        url: '/transcripts/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transcript', 'StudentStats'],
    }),

    updateTranscript: builder.mutation<
      TranscriptRecord,
      { id: number; data: Partial<TranscriptRecord> }
    >({
      query: ({ id, data }) => ({
        url: `/transcripts/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transcript', id },
        'Transcript',
        'StudentStats',
      ],
    }),

    deleteTranscript: builder.mutation<void, number>({
      query: (id) => ({
        url: `/transcripts/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transcript', 'StudentStats'],
    }),

    // Behavior Report Management
    getBehaviorReports: builder.query<
      {
        count: number;
        next: string | null;
        previous: string | null;
        results: BehaviorReport[];
      },
      {
        student?: string;
        report_type?: string;
        severity?: string;
        search?: string;
        page?: number;
        page_size?: number;
      }
    >({
      query: (params) => ({
        url: '/behavior-reports/',
        params: Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined)
        ),
      }),
      providesTags: ['BehaviorReport'],
    }),

    getBehaviorReport: builder.query<BehaviorReport, number>({
      query: (id) => `/behavior-reports/${id}/`,
      providesTags: (result, error, id) => [{ type: 'BehaviorReport', id }],
    }),

    createBehaviorReport: builder.mutation<BehaviorReport, CreateBehaviorReportRequest>({
      query: (data) => ({
        url: '/behavior-reports/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BehaviorReport', 'StudentStats'],
    }),

    updateBehaviorReport: builder.mutation<
      BehaviorReport,
      { id: number; data: Partial<BehaviorReport> }
    >({
      query: ({ id, data }) => ({
        url: `/behavior-reports/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'BehaviorReport', id },
        'BehaviorReport',
        'StudentStats',
      ],
    }),

    deleteBehaviorReport: builder.mutation<void, number>({
      query: (id) => ({
        url: `/behavior-reports/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BehaviorReport', 'StudentStats'],
    }),

    // Student Statistics
    getStudentStatistics: builder.query<StudentStatistics, string>({
      query: (studentId) => `/students/${studentId}/statistics/`,
      providesTags: (result, error, studentId) => [
        { type: 'StudentStats', id: studentId },
      ],
    }),

    // Student-specific academic records
    getStudentTranscripts: builder.query<TranscriptRecord[], string>({
      query: (studentId) => `/students/${studentId}/transcripts/`,
      providesTags: (result, error, studentId) => [
        { type: 'Transcript', id: `student-${studentId}` },
      ],
    }),

    getStudentBehaviorReports: builder.query<BehaviorReport[], string>({
      query: (studentId) => `/students/${studentId}/behavior-reports/`,
      providesTags: (result, error, studentId) => [
        { type: 'BehaviorReport', id: `student-${studentId}` },
      ],
    }),
  }),
});

export const {
  useGetTranscriptsQuery,
  useGetTranscriptQuery,
  useCreateTranscriptMutation,
  useUpdateTranscriptMutation,
  useDeleteTranscriptMutation,
  useGetBehaviorReportsQuery,
  useGetBehaviorReportQuery,
  useCreateBehaviorReportMutation,
  useUpdateBehaviorReportMutation,
  useDeleteBehaviorReportMutation,
  useGetStudentStatisticsQuery,
  useGetStudentTranscriptsQuery,
  useGetStudentBehaviorReportsQuery,
} = academicApi;



