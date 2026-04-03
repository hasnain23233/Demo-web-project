// components.ts
import type { Theme } from '@mui/material/styles';

const components = (theme: Theme) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        textTransform: 'none' as const,
        '&:hover': { boxShadow: 'none' },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        padding: '16px',
        boxShadow: 'none',
        backgroundColor: theme.palette.background.paper,
        border: `0.5px solid ${theme.palette.custom.borderFaint}`,
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '24px',
        backgroundColor: theme.palette.custom.surfaceSubtle,
        color: theme.palette.text.secondary,
        border: `0.5px solid ${theme.palette.custom.borderFaint}`,
      },
    },
  },

  MuiLink: {
    styleOverrides: {
      root: {
        fontSize: '13px',
        textDecoration: 'none',
        color: theme.palette.text.secondary,
        transition: 'color 0.2s ease',
        '&:hover': {
          color: theme.palette.text.primary,
          textDecoration: 'none',
        },
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: theme.palette.mode === 'dark' ? '#080808' : '#ffffff',
        borderRight: `0.5px solid ${theme.palette.custom.borderFaint}`,
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: theme.palette.custom.borderFaint,
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          backgroundColor: theme.palette.custom.surfaceSubtle,
          color: theme.palette.text.primary,
          '& fieldset': {
            borderColor: theme.palette.custom.borderFaint,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.custom.borderSubtle,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.custom.borderDefault,
            borderWidth: '0.5px',
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: theme.palette.text.disabled,
          opacity: 1,
        },
      },
    },
  },
});

export default components;