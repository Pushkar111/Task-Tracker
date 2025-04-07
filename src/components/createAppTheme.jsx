import { createTheme } from "@mui/material/styles";
import { alpha } from '@mui/material/styles';

// Custom theme creation function
export const createAppTheme = (mode) => {
  // Define color palettes for light and dark modes
  const lightPalette = {
    primary: {
      main: '#3a86ff',
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f72585',
      light: '#fb7bb7',
      dark: '#c81d5e',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
      card: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      disabled: '#9ca3af',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  };

  const darkPalette = {
    primary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f472b6',
      light: '#f9a8d4',
      dark: '#ec4899',
      contrastText: '#ffffff',
    },
    success: {
      main: '#34d399',
      light: '#6ee7b7',
      dark: '#10b981',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#ef4444',
      contrastText: '#ffffff',
    },
    info: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
      card: '#1e293b',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#e5e7eb',
      disabled: '#6b7280',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  };

  // Choose palette based on mode
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  // Create and return theme
  return createTheme({
    palette: {
      mode,
      ...palette,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.2,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.2,
        letterSpacing: '0em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.2,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.2,
        letterSpacing: '0em',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.2,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'none',
      },
      caption: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
      },
      overline: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 10,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.03), 0px 1px 2px rgba(0, 0, 0, 0.05)',
      '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.02)',
      '0px 10px 15px -3px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.01)',
      '0px 20px 25px -5px rgba(0, 0, 0, 0.08), 0px 10px 10px -5px rgba(0, 0, 0, 0.01)',
      ...Array(20).fill('none'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: mode === 'dark' 
              ? '0px 2px 4px rgba(0, 0, 0, 0.1)' 
              : '0px 2px 4px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'dark' 
                ? '0px 6px 12px rgba(0, 0, 0, 0.15)' 
                : '0px 6px 12px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.06)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0px 6px 12px rgba(0, 0, 0, 0.2)' 
                : '0px 8px 16px rgba(58, 134, 255, 0.2)',
            },
          },
          containedPrimary: {
            background: mode === 'dark'
              ? `linear-gradient(45deg, ${palette.primary.dark} 0%, ${palette.primary.main} 100%)`
              : `linear-gradient(45deg, ${palette.primary.main} 0%, ${palette.primary.light} 100%)`,
            '&:hover': {
              background: mode === 'dark'
                ? `linear-gradient(45deg, ${palette.primary.dark} 10%, ${palette.primary.main} 90%)`
                : `linear-gradient(45deg, ${palette.primary.main} 10%, ${palette.primary.light} 90%)`,
            },
          },
          containedSecondary: {
            background: mode === 'dark'
              ? `linear-gradient(45deg, ${palette.secondary.dark} 0%, ${palette.secondary.main} 100%)`
              : `linear-gradient(45deg, ${palette.secondary.main} 0%, ${palette.secondary.light} 100%)`,
            '&:hover': {
              background: mode === 'dark'
                ? `linear-gradient(45deg, ${palette.secondary.dark} 10%, ${palette.secondary.main} 90%)`
                : `linear-gradient(45deg, ${palette.secondary.main} 10%, ${palette.secondary.light} 90%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'dark'
              ? '0px 4px 8px rgba(0, 0, 0, 0.25)'
              : '0px 2px 4px rgba(0, 0, 0, 0.02), 0px 4px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: mode === 'dark'
                ? '0px 8px 16px rgba(0, 0, 0, 0.3)'
                : '0px 8px 16px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'dark'
              ? '0px 4px 8px rgba(0, 0, 0, 0.25)'
              : '0px 2px 4px rgba(0, 0, 0, 0.02), 0px 4px 8px rgba(0, 0, 0, 0.04)',
          },
          elevation1: {
            boxShadow: mode === 'dark'
              ? '0px 2px 4px rgba(0, 0, 0, 0.2)'
              : '0px 2px 4px rgba(0, 0, 0, 0.02), 0px 1px 2px rgba(0, 0, 0, 0.04)',
          },
          elevation2: {
            boxShadow: mode === 'dark'
              ? '0px 4px 8px rgba(0, 0, 0, 0.25)'
              : '0px 2px 4px rgba(0, 0, 0, 0.02), 0px 4px 8px rgba(0, 0, 0, 0.04)',
          },
          elevation3: {
            boxShadow: mode === 'dark'
              ? '0px 8px 16px rgba(0, 0, 0, 0.3)'
              : '0px 8px 16px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.04)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? palette.primary.light : palette.primary.main,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            fontWeight: 500,
          },
          filled: {
            '&.MuiChip-colorPrimary': {
              background: mode === 'dark'
                ? alpha(palette.primary.main, 0.2)
                : alpha(palette.primary.main, 0.1),
              color: mode === 'dark' ? palette.primary.light : palette.primary.dark,
            },
            '&.MuiChip-colorSecondary': {
              background: mode === 'dark'
                ? alpha(palette.secondary.main, 0.2)
                : alpha(palette.secondary.main, 0.1),
              color: mode === 'dark' ? palette.secondary.light : palette.secondary.dark,
            },
            '&.MuiChip-colorSuccess': {
              background: mode === 'dark'
                ? alpha(palette.success.main, 0.2)
                : alpha(palette.success.main, 0.1),
              color: mode === 'dark' ? palette.success.light : palette.success.dark,
            },
            '&.MuiChip-colorError': {
              background: mode === 'dark'
                ? alpha(palette.error.main, 0.2)
                : alpha(palette.error.main, 0.1),
              color: mode === 'dark' ? palette.error.light : palette.error.dark,
            },
            '&.MuiChip-colorWarning': {
              background: mode === 'dark'
                ? alpha(palette.warning.main, 0.2)
                : alpha(palette.warning.main, 0.1),
              color: mode === 'dark' ? palette.warning.light : palette.warning.dark,
            },
            '&.MuiChip-colorInfo': {
              background: mode === 'dark'
                ? alpha(palette.info.main, 0.2)
                : alpha(palette.info.main, 0.1),
              color: mode === 'dark' ? palette.info.light : palette.info.dark,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: mode === 'dark'
                ? alpha(palette.primary.main, 0.15)
                : alpha(palette.primary.main, 0.08),
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#111827' : '#ffffff',
            backgroundImage: mode === 'dark' 
              ? `linear-gradient(rgba(26, 32, 46, 0.8), rgba(26, 32, 46, 0.8))`
              : 'none',
            boxShadow: mode === 'dark'
              ? '4px 0px 16px rgba(0, 0, 0, 0.4)'
              : '4px 0px 16px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  });
};