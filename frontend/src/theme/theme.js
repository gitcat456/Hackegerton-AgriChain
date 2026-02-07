import { createTheme, alpha } from '@mui/material/styles';

// AgriChain Premium Theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2E7D32', // Rich green - agriculture
            light: '#4CAF50',
            dark: '#1B5E20',
            contrastText: '#fff',
        },
        secondary: {
            main: '#FF6F00', // Warm orange - harvest
            light: '#FFA726',
            dark: '#E65100',
            contrastText: '#fff',
        },
        success: {
            main: '#43A047',
            light: '#66BB6A',
            dark: '#2E7D32',
        },
        warning: {
            main: '#FFA000',
            light: '#FFB300',
            dark: '#FF8F00',
        },
        error: {
            main: '#D32F2F',
            light: '#EF5350',
            dark: '#C62828',
        },
        info: {
            main: '#1976D2',
            light: '#42A5F5',
            dark: '#1565C0',
        },
        background: {
            default: '#F5F7F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A2E',
            secondary: '#4A4A68',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 4px 8px rgba(0,0,0,0.08)',
        '0px 8px 16px rgba(0,0,0,0.1)',
        '0px 12px 24px rgba(0,0,0,0.12)',
        '0px 16px 32px rgba(0,0,0,0.14)',
        '0px 20px 40px rgba(0,0,0,0.16)',
        '0px 24px 48px rgba(0,0,0,0.18)',
        '0px 28px 56px rgba(0,0,0,0.2)',
        ...Array(16).fill('0px 32px 64px rgba(0,0,0,0.22)'),
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(46, 125, 50, 0.3)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 12px 32px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
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
    },
});

export default theme;
