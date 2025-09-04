import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useSchoolTheme } from '../../hooks/useSchoolTheme';

interface DynamicThemeProviderProps {
  children: React.ReactNode;
}

export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({ children }) => {
  const theme = useSchoolTheme();

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
