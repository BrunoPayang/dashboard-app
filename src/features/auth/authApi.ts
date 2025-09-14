import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, AuthResponse, RefreshTokenRequest } from '../../types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: (() => {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api';
      console.log('Auth API Base URL:', baseUrl);
      return baseUrl;
    })(),
    prepareHeaders: (headers, { getState: _getState }) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // Add CORS headers
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    // Add timeout and error handling
    timeout: 10000,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => {
        const url = 'auth/login/';
        console.log('Making login request to:', url);
        console.log('Request body:', credentials);
        return {
          url,
          method: 'POST',
          body: credentials,
        };
      },
      // Add transformResponse to handle potential response wrapping
      transformResponse: (response: any) => {
        console.log('Raw API response:', response);
        // If the response is wrapped in a data property, extract it
        if (response.data) {
          return response.data;
        }
        return response;
      },
      // Add error handling
      async onQueryStarted(credentials, { queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log('Login query fulfilled successfully');
        } catch (error) {
          console.error('Login query failed:', error);
        }
      },
    }),
    refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (refreshData) => ({
        url: '/auth/token/refresh/',
        method: 'POST',
        body: refreshData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
} = authApi;
