# Phase 2: Authentication & Core Infrastructure (Week 1 - Days 4-7)

## Overview
Implement the complete JWT authentication system with protected routes, create login and registration screens, set up authentication state management, and establish the core layout components for the school staff dashboard.

## Task 2.1: Authentication System Implementation

### Step 1: Create Authentication Types
**src/types/auth.ts:**
```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  user_type: 'admin' | 'school_staff' | 'parent';
  first_name: string;
  last_name: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  user_type: 'admin' | 'school_staff' | 'parent';
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface AuthState {
  user: User | null;
  school: School | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Step 2: Create Authentication API with RTK Query
**src/features/auth/authApi.ts:**
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest } from '../../types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://72814d906075.ngrok-free.app/api',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData,
      }),
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
  useRegisterMutation,
  useRefreshTokenMutation,
} = authApi;
```

### Step 3: Create Authentication Slice
**src/features/auth/authSlice.ts:**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, School } from '../../types/auth';
import { authApi } from './authApi';

const initialState: AuthState = {
  user: null,
  school: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { username: string; password: string }, { dispatch }) => {
    try {
      const response = await dispatch(
        authApi.endpoints.login.initiate(credentials)
      ).unwrap();
      
      // Store tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      return response;
    } catch (error: any) {
      throw new Error(error.data?.detail || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, { dispatch }) => {
    try {
      const response = await dispatch(
        authApi.endpoints.register.initiate(userData)
      ).unwrap();
      
      // Store tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      return response;
    } catch (error: any) {
      throw new Error(error.data?.detail || 'Registration failed');
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'auth/refreshUserToken',
  async (refreshToken: string, { dispatch }) => {
    try {
      const response = await dispatch(
        authApi.endpoints.refreshToken.initiate({ refresh: refreshToken })
      ).unwrap();
      
      // Update access token
      localStorage.setItem('access_token', response.access);
      
      return response;
    } catch (error: any) {
      throw new Error('Token refresh failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('school');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setSchool: (state, action: PayloadAction<School>) => {
      state.school = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    checkAuthStatus: (state) => {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      const schoolStr = localStorage.getItem('school');
      
      if (token && userStr) {
        try {
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
          if (schoolStr) {
            state.school = JSON.parse(schoolStr);
          }
        } catch (error) {
          state.user = null;
          state.school = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Refresh Token
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(refreshUserToken.rejected, (state) => {
        state.user = null;
        state.school = null;
        state.isAuthenticated = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('school');
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.school = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const {
  setUser,
  setSchool,
  setLoading,
  setError,
  clearError,
  checkAuthStatus,
} = authSlice.actions;

export default authSlice.reducer;
```

### Step 4: Create Protected Route Component
**src/components/auth/ProtectedRoute.tsx:**
```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'school_staff' | 'parent';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user && user.user_type !== requiredRole) {
    // User doesn't have required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### Step 5: Create Login Page
**src/pages/auth/LoginPage.tsx:**
```typescript
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Link,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../features/auth/authSlice';
import { RootState, AppDispatch } from '../../features/store';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

type LoginFormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the slice
      console.error('Login failed:', err);
    }
  };

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            School Dashboard
          </Typography>
          <Typography component="h2" variant="h6" color="textSecondary" gutterBottom>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              autoComplete="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
```

### Step 6: Create Registration Page
**src/pages/auth/RegisterPage.tsx:**
```typescript
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../features/auth/authSlice';
import { RootState, AppDispatch } from '../../features/store';

const schema = yup.object({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  password_confirm: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
  user_type: yup.string().required('User type is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
}).required();

type RegisterFormData = yup.InferType<typeof schema>;

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const userType = watch('user_type');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>
          <Typography component="h2" variant="h6" color="textSecondary" gutterBottom>
            Join the School Dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                {...register('first_name')}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
              <TextField
                fullWidth
                label="Last Name"
                {...register('last_name')}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Box>
            
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>User Type</InputLabel>
              <Select
                value={userType || ''}
                label="User Type"
                onChange={(e) => setValue('user_type', e.target.value)}
                error={!!errors.user_type}
              >
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="school_staff">School Staff</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            
            <TextField
              margin="normal"
              fullWidth
              label="Confirm Password"
              type="password"
              {...register('password_confirm')}
              error={!!errors.password_confirm}
              helperText={errors.password_confirm?.message}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
```

## Task 2.2: Core Layout & Navigation

### Step 1: Create Layout Component
**src/components/layout/Layout.tsx:**
```typescript
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Account for header height
          ml: sidebarOpen ? '240px' : 0, // Account for sidebar width
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
```

### Step 2: Create Header Component
**src/components/layout/Header.tsx:**
```typescript
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings,
  Logout,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../features/store';
import { logoutUser } from '../../features/auth/authSlice';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, school } = useSelector((state: RootState) => state.auth);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
      handleMenuClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {school?.logo && (
            <Box
              component="img"
              src={school.logo}
              alt={school.name}
              sx={{
                height: 40,
                width: 40,
                mr: 2,
                borderRadius: 1,
              }}
            />
          )}
          <Typography variant="h6" noWrap component="div">
            {school?.name || 'School Dashboard'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.first_name} {user?.last_name}
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={isMenuOpen ? 'primary-search-account-menu' : undefined}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        id="primary-search-account-menu"
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleSettings}>
          <Settings sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
```

### Step 3: Create Sidebar Component
**src/components/layout/Sidebar.tsx:**
```typescript
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Book,
  Notifications,
  Folder,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Students', icon: <People />, path: '/students' },
  { text: 'Parents', icon: <School />, path: '/parents' },
  { text: 'Academics', icon: <Book />, path: '/academics' },
  { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
  { text: 'Files', icon: <Folder />, path: '/files' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const drawerWidth = 240;

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8, // Account for header height
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'primary.contrastText' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
```

## Task 2.3: Authentication Hooks

### Step 1: Create Authentication Hook
**src/hooks/useAuth.ts:**
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../features/store';
import { loginUser, registerUser, logoutUser, checkAuthStatus } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, school, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: { username: string; password: string }) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (userData: any) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
    register,
    logout,
    checkAuth,
  };
};
```

### Step 2: Create Protected Route Hook
**src/hooks/useProtectedRoute.ts:**
```typescript
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
```

## Validation Checklist

### Authentication System
- [ ] Login functionality working with JWT tokens (username/password)
- [ ] Registration with required fields (username, email, password, password_confirm, user_type, first_name, last_name)
- [ ] Token refresh mechanism implemented using correct endpoint (/api/auth/token/refresh/)
- [ ] Secure token storage working (access/refresh tokens)
- [ ] Logout functionality clearing all data
- [ ] Authentication state properly managed

### API Integration
- [ ] Correct endpoint URLs (/api/auth/login/, /api/auth/register/, /api/auth/token/refresh/)
- [ ] Proper request/response field mapping (access/refresh tokens)
- [ ] User entity matches API response structure
- [ ] Error handling for API status codes (400, 401, 409, 500)

### Protected Routes
- [ ] Route protection working for unauthenticated users
- [ ] Role-based access control implemented
- [ ] Redirect to login with return URL
- [ ] Proper navigation after authentication

### Layout Components
- [ ] Header with user profile and logout
- [ ] Sidebar with navigation menu
- [ ] Responsive design working
- [ ] Layout properly structured

### State Management
- [ ] Redux store properly configured
- [ ] Authentication slice working
- [ ] RTK Query endpoints functional
- [ ] State persistence across page reloads

### Code Quality
- [ ] No compilation errors
- [ ] Proper error handling
- [ ] Clean architecture maintained
- [ ] Code properly documented
- [ ] TypeScript types defined

## Next Steps
After completing Phase 2, proceed to Phase 3: Student Management Module to implement:
- Student list with pagination and search
- Student CRUD operations
- Student detail views
- Bulk operations

## Common Issues and Solutions

### Issue 1: JWT Token Storage
**Problem**: Tokens not persisting across page reloads
**Solution**: Ensure tokens are stored in localStorage and checkAuthStatus is called on app initialization

### Issue 2: Route Protection
**Problem**: Protected routes not working
**Solution**: Ensure ProtectedRoute component wraps all private routes and useProtectedRoute hook is used

### Issue 3: API Authentication
**Problem**: API calls failing with 401 errors
**Solution**: Check token interceptor and ensure Authorization header is properly set

### Issue 4: State Persistence
**Problem**: User state lost on page refresh
**Solution**: Implement checkAuthStatus in useEffect and store user data in localStorage

### Issue 5: Role-based Access
**Problem**: Users accessing unauthorized routes
**Solution**: Implement proper role checking in ProtectedRoute and useProtectedRoute hook

## API Endpoints Summary
- **Login**: `POST /api/auth/login/` (username, password)
- **Register**: `POST /api/auth/register/` (username, email, password, password_confirm, user_type, first_name, last_name)
- **Refresh Token**: `POST /api/auth/token/refresh/` (refresh)
- **Logout**: Local cleanup only (API endpoint not documented)

Ready to implement Phase 2, or do you have questions about the authentication and core infrastructure setup?
