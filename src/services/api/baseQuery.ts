import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api',
  prepareHeaders: (headers) => {
    // Get the token from localStorage
    const token = localStorage.getItem('access_token');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
