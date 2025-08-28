import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

export const useProtectedRoute = (requiredRole?: 'admin' | 'school_staff' | 'parent') => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    } else if (!isLoading && isAuthenticated && requiredRole && user && user.user_type !== requiredRole) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, user, requiredRole, navigate, location]);

  return {
    isAuthenticated,
    user,
    isLoading,
    hasRequiredRole: !requiredRole || (user && user.user_type === requiredRole),
  };
};

