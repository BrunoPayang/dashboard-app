import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../features/store';
import { checkAuthStatus, setUser, setSchool, logout } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApi';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, school, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [loginMutation] = useLoginMutation();

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
          
          // For now, we'll create a default school since the User type doesn't include school info
          // This should be updated when the backend provides school information
          const schoolData = {
            id: 'default',
            name: 'École',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            phone: '',
            email: '',
            website: '',
            logo: '',
          };
          localStorage.setItem('school', JSON.stringify(schoolData));
          dispatch(setSchool(schoolData));
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
  };
};
