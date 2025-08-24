import { createTheme, Theme } from '@mui/material/styles';

// Default theme colors
const defaultColors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#dc004e',
    light: '#ff5983',
    dark: '#9a0036',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
  },
};

// Create base theme
export const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: defaultColors.primary,
    secondary: defaultColors.secondary,
    success: defaultColors.success,
    warning: defaultColors.warning,
    error: defaultColors.error,
    info: defaultColors.info,
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Function to create custom theme for schools
export const createSchoolTheme = (schoolColors: {
  primary?: string;
  secondary?: string;
  logo?: string;
}): Theme => {
  return createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      primary: schoolColors.primary 
        ? { main: schoolColors.primary }
        : baseTheme.palette.primary,
      secondary: schoolColors.secondary 
        ? { main: schoolColors.secondary }
        : baseTheme.palette.secondary,
    },
  });
};

// Export default theme
export const theme = baseTheme;
