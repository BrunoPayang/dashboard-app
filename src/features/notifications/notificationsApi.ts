import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  recipients: number[];
  sent_at: string;
  status: string;
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
    getNotifications: builder.query<Notification[], void>({
      query: () => '/api/notifications/',
      providesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
} = notificationsApi;
