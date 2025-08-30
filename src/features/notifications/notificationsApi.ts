import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Notification {
  id: string;
  title: string;
  body: string;
  notification_type: 'academic' | 'behavior' | 'payment' | 'general';
  school: string;
  school_name: string;
  target_user_ids: number[];
  sent_via_fcm: boolean;
  sent_via_email: boolean;
  sent_via_sms: boolean;
  data: string;
  created_at: string;
  sent_at: string | null;
}

export interface NotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
  page: number;
  pages: number;
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
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
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, { school_id?: string; page?: number; page_size?: number }>({
      query: (params) => ({
        url: '/notifications/',
        params: {
          school: params.school_id,
          page: params.page || 1,
          page_size: params.page_size || 20
        }
      }),
      providesTags: ['Notification'],
    }),
    createNotification: builder.mutation<Notification, Partial<Notification>>({
      query: (notification) => ({
        url: '/notifications/',
        method: 'POST',
        body: notification,
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
} = notificationsApi;
