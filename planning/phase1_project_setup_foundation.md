# Phase 1: Project Setup & Foundation (Week 1 - Days 1-3)

## Overview
Initialize the React project with Vite and TypeScript, set up the complete project structure, configure development tools, and establish the foundation for the school staff dashboard application.

## Task 1.1: Initialize React Project

### Step 1: Create React Project with Vite and TypeScript
**Terminal Commands:**
```bash
npm create vite@latest school-dashboard -- --template react-ts
cd school-dashboard
npm install
```

**Project Structure Setup:**
```
school-dashboard/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Buttons, inputs, modals
│   │   ├── layout/          # Header, sidebar, navigation
│   │   ├── forms/           # Form components and validation
│   │   └── charts/          # Data visualization components
│   ├── pages/               # Main application pages
│   │   ├── dashboard/       # Main dashboard view
│   │   ├── students/        # Student management
│   │   ├── parents/         # Parent management
│   │   ├── academics/       # Academic records
│   │   ├── notifications/   # Notification system
│   │   ├── files/           # File management
│   │   ├── reports/         # Analytics and reporting
│   │   └── settings/        # School configuration
│   ├── features/            # Redux slices and API logic
│   │   ├── auth/            # Authentication state
│   │   ├── students/        # Student data management
│   │   ├── parents/         # Parent data management
│   │   ├── academics/       # Academic records management
│   │   ├── notifications/   # Notification management
│   │   ├── files/           # File management
│   │   └── school/          # School configuration
│   ├── services/            # API services and utilities
│   │   ├── api/             # API client and endpoints
│   │   ├── auth/            # Authentication services
│   │   ├── storage/         # Local storage utilities
│   │   └── utils/           # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── constants/           # Application constants
│   ├── styles/              # Global styles and themes
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global CSS
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.js
├── .prettierrc
└── README.md
```

### Step 2: Configure ESLint, Prettier, and Husky
**Install Development Dependencies:**
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y prettier husky lint-staged
```

**.eslintrc.js:**
```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'jsx-a11y'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

**.prettierrc:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,css,md}",
    "type-check": "tsc --noEmit"
  }
}
```

### Step 3: Set up Material-UI and Custom Theming
**Install Material-UI Dependencies:**
```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-data-grid @mui/x-date-pickers
```

**src/styles/theme.ts:**
```typescript
import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
```

### Step 4: Configure Routing with React Router
**Install React Router:**
```bash
npm install react-router-dom
```

**src/App.tsx:**
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import StudentsPage from './pages/students/StudentsPage';
import ParentsPage from './pages/parents/ParentsPage';
import AcademicsPage from './pages/academics/AcademicsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import FilesPage from './pages/files/FilesPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="parents" element={<ParentsPage />} />
            <Route path="academics" element={<AcademicsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="files" element={<FilesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```

## Task 1.2: Development Environment

### Step 1: Set up Redux Toolkit and RTK Query
**Install Redux Dependencies:**
```bash
npm install @reduxjs/toolkit react-redux
```

**src/features/store.ts:**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './auth/authApi';
import { studentsApi } from './students/studentsApi';
import { parentsApi } from './parents/parentsApi';
import { academicsApi } from './academics/academicsApi';
import { notificationsApi } from './notifications/notificationsApi';
import { filesApi } from './files/filesApi';
import { schoolApi } from './school/schoolApi';
import authReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [studentsApi.reducerPath]: studentsApi.reducer,
    [parentsApi.reducerPath]: parentsApi.reducer,
    [academicsApi.reducerPath]: academicsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
    [schoolApi.reducerPath]: schoolApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      studentsApi.middleware,
      parentsApi.middleware,
      academicsApi.middleware,
      notificationsApi.middleware,
      filesApi.middleware,
      schoolApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Step 2: Configure API Client with Axios
**Install Axios:**
```bash
npm install axios
```

**src/services/api/apiClient.ts:**
```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://72814d906075.ngrok-free.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
            `${process.env.REACT_APP_API_BASE_URL || 'https://72814d906075.ngrok-free.app/api'}/auth/token/refresh/`,
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
```

### Step 3: Set up Environment Variables Management
**.env.example:**
```env
# API Configuration
REACT_APP_API_BASE_URL=https://72814d906075.ngrok-free.app/api

# Application Configuration
REACT_APP_APP_NAME=School Dashboard
REACT_APP_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG_MODE=false
```

**.env.local:**
```env
REACT_APP_API_BASE_URL=https://72814d906075.ngrok-free.app/api
REACT_APP_APP_NAME=School Dashboard
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG_MODE=true
```

### Step 4: Create Base Component Library
**src/components/common/Button.tsx:**
```typescript
import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  children, 
  disabled,
  ...props 
}) => {
  const getMuiVariant = () => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'contained';
      case 'outline':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  const getMuiColor = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'primary';
      case 'text':
        return 'primary';
      default:
        return 'primary';
    }
  };

  return (
    <MuiButton
      variant={getMuiVariant()}
      color={getMuiColor()}
      size={size}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button;
```

**src/components/common/Input.tsx:**
```typescript
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error = false, 
  helperText, 
  required = false,
  ...props 
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      error={error}
      helperText={helperText}
      required={required}
      {...props}
    />
  );
};

export default Input;
```

**src/components/common/Card.tsx:**
```typescript
import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardHeader, CardActions } from '@mui/material';

export interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  actions, 
  children, 
  ...props 
}) => {
  return (
    <MuiCard {...props}>
      {(title || subtitle) && (
        <CardHeader
          title={title}
          subheader={subtitle}
        />
      )}
      <CardContent>
        {children}
      </CardContent>
      {actions && (
        <CardActions>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
```

### Step 5: Set up Testing Framework
**Install Testing Dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

**src/test/setup.ts:**
```typescript
import '@testing-library/jest-dom';
```

**src/components/common/__tests__/Button.test.tsx:**
```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByText('Loading...');
    expect(button).toBeDisabled();
  });
});
```

## Validation Checklist

### Project Setup
- [ ] React project created with Vite and TypeScript
- [ ] Project structure properly organized
- [ ] ESLint, Prettier, and Husky configured
- [ ] Material-UI installed and themed
- [ ] React Router configured with all routes
- [ ] Environment variables set up

### Development Environment
- [ ] Redux Toolkit and RTK Query configured
- [ ] API client with Axios set up
- [ ] Environment variables working
- [ ] Base component library created
- [ ] Testing framework configured
- [ ] All dependencies installed

### Code Quality
- [ ] No compilation errors
- [ ] ESLint rules properly applied
- [ ] Prettier formatting working
- [ ] TypeScript types defined
- [ ] Component tests passing
- [ ] Code properly documented

## Next Steps
After completing Phase 1, proceed to Phase 2: Authentication & Core Infrastructure to implement:
- JWT authentication system
- Protected route components
- Authentication state management
- Login/logout components

## Common Issues and Solutions

### Issue 1: Vite Configuration
**Problem**: Vite not recognizing TypeScript
**Solution**: Ensure tsconfig.json is properly configured and @vitejs/plugin-react is installed

### Issue 2: Material-UI Theme
**Problem**: Theme not applying to components
**Solution**: Ensure ThemeProvider wraps the entire app and CssBaseline is included

### Issue 3: Environment Variables
**Problem**: Environment variables not accessible
**Solution**: Use REACT_APP_ prefix and restart development server

### Issue 4: TypeScript Errors
**Problem**: TypeScript compilation errors
**Solution**: Check tsconfig.json settings and ensure all types are properly defined

### Issue 5: Testing Setup
**Problem**: Tests not running
**Solution**: Ensure vitest is configured in vite.config.ts and setup files are correct

Ready to implement Phase 1, or do you have questions about the project setup and foundation?
