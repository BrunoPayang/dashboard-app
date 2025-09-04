import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import { RootState } from '../features/store';

// Base theme colors
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

export const useSchoolTheme = (): Theme => {
  const school = useSelector((state: RootState) => state.auth.school);

  const theme = useMemo(() => {
    const primaryColor = school?.primary_color;
    const secondaryColor = school?.secondary_color;

    // Helper function to generate light and dark variants from a hex color
    const generateColorVariants = (hexColor: string) => {
      // Convert hex to RGB
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Generate lighter variant
      const lightR = Math.min(255, Math.floor(r + (255 - r) * 0.3));
      const lightG = Math.min(255, Math.floor(g + (255 - g) * 0.3));
      const lightB = Math.min(255, Math.floor(b + (255 - b) * 0.3));

      // Generate darker variant
      const darkR = Math.max(0, Math.floor(r * 0.7));
      const darkG = Math.max(0, Math.floor(g * 0.7));
      const darkB = Math.max(0, Math.floor(b * 0.7));

      return {
        main: hexColor,
        light: `rgb(${lightR}, ${lightG}, ${lightB})`,
        dark: `rgb(${darkR}, ${darkG}, ${darkB})`,
      };
    };

    return createTheme({
      palette: {
        mode: 'light',
        primary: primaryColor ? generateColorVariants(primaryColor) : defaultColors.primary,
        secondary: secondaryColor ? generateColorVariants(secondaryColor) : defaultColors.secondary,
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
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: primaryColor || defaultColors.primary.main,
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: primaryColor || defaultColors.primary.main,
              color: '#ffffff',
            },
          },
        },
      },
    });
  }, [school?.primary_color, school?.secondary_color]);

  return theme;
};
