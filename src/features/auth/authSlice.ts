import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, School, AuthState as AuthStateType } from '../../types/auth';

// Use the centralized types
export type { User, School } from '../../types/auth';

// Local state interface that extends the centralized one
interface LocalAuthState extends Omit<AuthStateType, 'user' | 'school'> {
  user: User | null;
  school: School | null;
}

const initialState: LocalAuthState = {
  user: null,
  school: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setSchool: (state, action: PayloadAction<School>) => {
      state.school = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.school = null;
      state.error = null;
      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('school');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearInvalidSchoolData: (state) => {
      localStorage.removeItem('school');
      state.school = null;
    },
    checkAuthStatus: (state) => {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      const schoolStr = localStorage.getItem('school');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.isAuthenticated = true;
          
          // Only load school if it exists and has a valid ID (not 'default')
          if (schoolStr) {
            const school = JSON.parse(schoolStr);
            if (school && school.id && school.id !== 'default') {
              state.school = school;
            } else {
              // Clear invalid school data
              localStorage.removeItem('school');
              state.school = null;
            }
          }
        } catch (error) {
          state.user = null;
          state.school = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
});

export const {
  setLoading,
  setUser,
  setSchool,
  setError,
  logout,
  clearError,
  clearInvalidSchoolData,
  checkAuthStatus,
} = authSlice.actions;

export default authSlice.reducer;
