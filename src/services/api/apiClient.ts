import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { validateTokens } from '../../utils/tokenUtils';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and validate before requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Skip token validation for auth endpoints
    if (config.url?.includes('/auth/')) {
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    }
    
    // Validate tokens before making the request
    const tokenValidation = validateTokens(accessToken, refreshToken);
    
    if (tokenValidation.needsLogin) {
      // Redirect to login if tokens are completely invalid
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication required'));
    }
    
    if (tokenValidation.needsRefresh && refreshToken) {
      // Try to refresh token before the request
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/auth/token/refresh/`,
          { refresh: refreshToken }
        );
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        if (config.headers) {
          config.headers.Authorization = `Bearer ${access}`;
        }
      } catch (refreshError) {
        console.error('Proactive token refresh failed:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
