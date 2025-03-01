import React, { createContext, useState, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import materialTheme from '../styles/theme/vujas-theme.json';

// Create context for theme
export const ThemeContext = createContext();

// Create hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Change the initial state to 'dark'
  const [mode, setMode] = useState('dark');

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // Rest of the code remains the same...
  const theme = useMemo(() => {
    // Get the color scheme based on current mode
    const colors = materialTheme.schemes[mode];
    
    return createTheme({
      palette: {
        mode,
        primary: {
          main: colors.primary,
          light: colors.primaryContainer,
          dark: mode === 'light' ? colors.onPrimaryContainer : colors.onPrimary,
          contrastText: colors.onPrimary,
        },
        secondary: {
          main: colors.secondary,
          light: colors.secondaryContainer,
          dark: colors.onSecondaryContainer,
          contrastText: colors.onSecondary,
        },
        tertiary: { 
          main: colors.tertiary,
          light: colors.tertiaryContainer,
          dark: colors.onTertiaryContainer,
          contrastText: colors.onTertiary,
        },
        error: {
          main: colors.error,
          light: colors.errorContainer,
          dark: colors.onErrorContainer,
          contrastText: colors.onError,
        },
        background: {
          default: colors.background,
          paper: colors.surfaceContainer,
        },
        text: {
          primary: colors.onSurface,
          secondary: colors.onSurfaceVariant,
        },
        divider: colors.outlineVariant,
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
          fontWeight: 500,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};