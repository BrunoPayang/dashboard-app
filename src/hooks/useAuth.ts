import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../features/store';
import { checkAuthStatus, setUser, setSchool, setTokens, logout } from '../features/auth/authSlice';
import { useLoginMutation, useRefreshTokenMutation } from '../features/auth/authApi';
import { validateTokens } from '../utils/tokenUtils';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, school, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [loginMutation] = useLoginMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return false;
      }

      const result = await refreshTokenMutation({ refresh: refreshToken }).unwrap();
      
      if (result.access) {
        dispatch(setTokens({ access: result.access, refresh: result.refresh }));
        console.log('Tokens refreshed successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const checkAndRefreshTokens = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    const tokenValidation = validateTokens(accessToken, refreshToken);
    
    if (tokenValidation.needsLogin) {
      // Tokens are completely invalid, need full login
      dispatch(logout());
      return false;
    }
    
    if (tokenValidation.needsRefresh) {
      // Try to refresh tokens
      return await refreshTokens();
    }
    
    // Tokens are valid
    return tokenValidation.isValid;
  };

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      // Handle successful login - store tokens and user data
      if (result.access) {
        localStorage.setItem('access_token', result.access);
        if (result.refresh) {
          localStorage.setItem('refresh_token', result.refresh);
        }
        // Store user data
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          dispatch(setUser(result.user));
          
          // For school staff and admin users, get school information
          if (result.user.user_type === 'school_staff' || result.user.user_type === 'admin') {
            // Get school_id from user data (it's called 'school' in the response)
            const schoolId = result.user.school;
            
            if (schoolId) {
              try {
                const schoolResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://schoolconnect-qeaf.onrender.com/api'}/schools/${schoolId}/`, {
                  headers: { 
                    Authorization: `Bearer ${result.access}`,
                    'Content-Type': 'application/json'
                  }
                });
                if (schoolResponse.ok) {
                  const schoolData = await schoolResponse.json();
                  localStorage.setItem('school', JSON.stringify(schoolData));
                  dispatch(setSchool(schoolData));
                } else {
                  console.error('Failed to fetch school data:', schoolResponse.status);
                }
              } catch (error) {
                console.error('Failed to fetch school data:', error);
              }
            } else {
              console.log('No school found for school staff user');
            }
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate('/login');
  };

  const checkAuth = () => {
    dispatch(checkAuthStatus());
  };

  return {
    user,
    school,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
    checkAuth,
    refreshTokens,
    checkAndRefreshTokens,
  };
};
