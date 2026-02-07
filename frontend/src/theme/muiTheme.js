import { createTheme, alpha } from '@mui/material/styles';

// AgriChain Custom Theme with Agriculture-inspired colors
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2E7D32', // Deep Green
            light: '#4CAF50',
            dark: '#1B5E20',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#FF9800', // Warm Orange
            light: '#FFB74D',
            dark: '#F57C00',
            contrastText: '#ffffff',
        },
        success: {
            main: '#43A047',
            light: '#81C784',
            dark: '#2E7D32',
        },
        warning: {
            main: '#FFA726',
            light: '#FFB74D',
            dark: '#F57C00',
        },
        error: {
            main: '#E53935',
            light: '#EF5350',
            dark: '#C62828',
        },
        info: {
            main: '#1976D2',
            light: '#42A5F5',
            dark: '#1565C0',
        },
        background: {
            default: '#F5F7FA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A2E',
            secondary: '#6B7280',
        },
        divider: 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
        body1: {
            lineHeight: 1.7,
        },
        body2: {
            lineHeight: 1.6,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 1px 3px rgba(0,0,0,0.05)',
        '0 2px 6px rgba(0,0,0,0.06)',
        '0 4px 12px rgba(0,0,0,0.08)',
        '0 6px 16px rgba(0,0,0,0.10)',
        '0 8px 24px rgba(0,0,0,0.12)',
        '0 12px 32px rgba(0,0,0,0.14)',
        '0 16px 40px rgba(0,0,0,0.16)',
        '0 20px 48px rgba(0,0,0,0.18)',
        '0 24px 56px rgba(0,0,0,0.20)',
        '0 28px 64px rgba(0,0,0,0.22)',
        '0 32px 72px rgba(0,0,0,0.24)',
        // ... keep rest as default
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
        '0 32px 72px rgba(0,0,0,0.24)',
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#c1c1c1 #f5f5f5',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        width: 8,
                        height: 8,
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        backgroundColor: '#c1c1c1',
                    },
                    '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
                        borderRadius: 8,
                        backgroundColor: '#f5f5f5',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-1px)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(46, 125, 50, 0.3)',
                    },
                },
                containedSecondary: {
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(255, 152, 0, 0.3)',
                    },
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
                filled: {
                    '&.MuiChip-colorSuccess': {
                        backgroundColor: alpha('#43A047', 0.15),
                        color: '#2E7D32',
                    },
                    '&.MuiChip-colorWarning': {
                        backgroundColor: alpha('#FFA726', 0.15),
                        color: '#E65100',
                    },
                    '&.MuiChip-colorError': {
                        backgroundColor: alpha('#E53935', 0.15),
                        color: '#C62828',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    margin: '4px 8px',
                    '&.Mui-selected': {
                        backgroundColor: alpha('#2E7D32', 0.12),
                        '&:hover': {
                            backgroundColor: alpha('#2E7D32', 0.18),
                        },
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
                standardSuccess: {
                    backgroundColor: alpha('#43A047', 0.12),
                    color: '#1B5E20',
                },
                standardError: {
                    backgroundColor: alpha('#E53935', 0.12),
                    color: '#B71C1C',
                },
                standardWarning: {
                    backgroundColor: alpha('#FFA726', 0.12),
                    color: '#E65100',
                },
                standardInfo: {
                    backgroundColor: alpha('#1976D2', 0.12),
                    color: '#0D47A1',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    height: 8,
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    strokeLinecap: 'round',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 8,
                    fontSize: '0.85rem',
                },
            },
        },
    },
});

export default theme;
