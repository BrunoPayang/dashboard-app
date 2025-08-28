import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { 
  PaymentRecord, 
  PaymentSummary, 
  CreatePaymentRequest, 
  UpdatePaymentRequest 
} from '../../types/payment';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery,
  tagTypes: ['Payment', 'PaymentSummary'],
  endpoints: (builder) => ({
    // Get paginated payment records with filters
    getPaymentRecords: builder.query<
      {
        count: number;
        next: string | null;
        previous: string | null;
        results: PaymentRecord[];
      },
      {
        payment_type?: string;
        status?: string;
        currency?: string;
        search?: string;
        page?: number;
        page_size?: number;
      }
    >({
      query: (params) => ({
        url: '/payment-records/',
        params: Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined)
        ),
      }),
      providesTags: ['Payment'],
    }),

    // Get specific payment record
    getPaymentRecord: builder.query<PaymentRecord, number>({
      query: (id) => `/payment-records/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),

    // Create new payment record
    createPaymentRecord: builder.mutation<PaymentRecord, CreatePaymentRequest>({
      query: (data) => ({
        url: '/payment-records/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment', 'PaymentSummary'],
    }),

    // Update payment record (partial)
    updatePaymentRecord: builder.mutation<
      PaymentRecord,
      { id: number; data: UpdatePaymentRequest }
    >({
      query: ({ id, data }) => ({
        url: `/payment-records/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Payment', id },
        'Payment',
        'PaymentSummary',
      ],
    }),

    // Delete payment record
    deletePaymentRecord: builder.mutation<void, number>({
      query: (id) => ({
        url: `/payment-records/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payment', 'PaymentSummary'],
    }),

    // Get overdue payments
    getOverduePayments: builder.query<PaymentRecord[], void>({
      query: () => '/payment-records/overdue_payments/',
      providesTags: ['Payment'],
    }),

    // Get payment summary statistics
    getPaymentSummary: builder.query<PaymentSummary, void>({
      query: () => '/payment-records/payment_summary/',
      providesTags: ['PaymentSummary'],
    }),

    // Get student payment records
    getStudentPaymentRecords: builder.query<PaymentRecord[], number>({
      query: (studentId) => `/students/${studentId}/payment_records/`,
      providesTags: (result, error, studentId) => [
        { type: 'Payment', id: `student-${studentId}` },
      ],
    }),


  }),
});

export const {
  useGetPaymentRecordsQuery,
  useGetPaymentRecordQuery,
  useCreatePaymentRecordMutation,
  useUpdatePaymentRecordMutation,
  useDeletePaymentRecordMutation,
  useGetOverduePaymentsQuery,
  useGetPaymentSummaryQuery,
  useGetStudentPaymentRecordsQuery,
} = paymentApi;
