import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { 
      main: '#7C3AED',
      light: '#A78BFA',
      dark: '#6B21A8',
      contrastText: '#F1F5F9'
    },
    secondary: { 
      main: '#6B46C1',
      light: '#8B5CF6',
      dark: '#553399',
      contrastText: '#F1F5F9'
    },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#06B6D4' },
    background: { 
      default: '#0a0e27',
      paper: 'rgba(26, 26, 77, 0.6)'
    },
    text: { 
      primary: '#F1F5F9',
      secondary: '#CBD5E1'
    },
    divider: 'rgba(241, 245, 249, 0.1)'
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'linear-gradient(135deg, rgba(26, 26, 77, 0.6) 0%, rgba(45, 27, 78, 0.6) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #3B5BDB 0%, #6B46C1 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2D47B6 0%, #553399 100%)',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)'
          }
        },
        outlined: {
          borderColor: 'rgba(124, 58, 237, 0.3)',
          '&:hover': {
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124, 58, 237, 0.1)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'rgba(26, 26, 77, 0.4)',
            '& fieldset': {
              borderColor: 'rgba(124, 58, 237, 0.2)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(124, 58, 237, 0.3)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7C3AED',
              boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.15)'
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a4d 100%)',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
          borderBottom: '1px solid rgba(124, 58, 237, 0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'linear-gradient(135deg, rgba(26, 26, 77, 0.6) 0%, rgba(45, 27, 78, 0.6) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.875rem'
        }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: { 
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#F1F5F9',
      lineHeight: 1.2
    },
    h2: { 
      fontWeight: 700,
      fontSize: '2rem',
      color: '#F1F5F9',
      lineHeight: 1.2
    },
    h3: { 
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#F1F5F9',
      lineHeight: 1.2
    },
    h4: { 
      fontWeight: 600,
      fontSize: '1.125rem',
      color: '#F1F5F9',
      lineHeight: 1.2
    },
    h5: { 
      fontWeight: 600,
      fontSize: '1rem',
      color: '#F1F5F9',
      lineHeight: 1.2
    },
    h6: { 
      fontWeight: 600,
      fontSize: '0.875rem',
      color: '#F1F5F9',
      lineHeight: 1.2
    },
    body1: { 
      fontSize: '1rem',
      color: '#CBD5E1',
      lineHeight: 1.5
    },
    body2: { 
      fontSize: '0.875rem',
      color: '#CBD5E1',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none'
    },
    caption: {
      fontSize: '0.75rem',
      color: '#94A3B8',
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 12
  }
});

export default darkTheme;

