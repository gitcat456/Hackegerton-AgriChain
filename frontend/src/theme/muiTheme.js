import { createTheme } from '@mui/material/styles';

// Premium AgriChain Color Palette - Deep Green & Harvest Gold
const colors = {
    primary: {
        main: '#1B5E20', // Deep Forest Green
        light: '#4C8C4A',
        dark: '#003300',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#FFD700', // Harvest Gold
        light: '#FFFF52',
        dark: '#C7A500',
        contrastText: '#1B5E20', // Dark green text on gold
    },
    background: {
        default: '#f4f7f2', // Very light green-grey typical of modern SaaS
        paper: '#ffffff',
        glass: 'rgba(255, 255, 255, 0.85)',
    },
    text: {
        primary: '#1a1a1a', // Soft black
        secondary: '#4d4d4d',
    },
    success: {
        main: '#2E7D32',
    },
    warning: {
        main: '#ED6C02',
    }
};

const theme = createTheme({
    palette: {
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        text: colors.text,
        success: colors.success,
        warning: colors.warning,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800, color: colors.primary.main, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, color: colors.primary.dark, letterSpacing: '-0.01em' },
        h3: { fontWeight: 700, color: colors.primary.main },
        h4: { fontWeight: 600, color: '#2d3748' },
        h5: { fontWeight: 600, color: '#2d3748' },
        h6: { fontWeight: 600 },
        subtitle1: { fontSize: '1.rem', fontWeight: 500 },
        button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    },
    shape: {
        borderRadius: 12, // Modern but professional
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#f0f2f5',
                    backgroundImage: 'none', // Reset previous gradients
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(90deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    },
                    overflow: 'visible', // Ensure shadows/badges aren't clipped
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 20px',
                },
                containedPrimary: {
                    background: colors.primary.main,
                    '&:hover': {
                        background: colors.primary.dark,
                    },
                },
                containedSecondary: {
                    background: colors.secondary.main,
                    color: colors.primary.dark,
                    '&:hover': {
                        background: colors.secondary.dark,
                    },
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
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 700,
                    color: colors.primary.dark,
                    backgroundColor: '#fafafa', // Light grey header
                    borderBottom: '2px solid #e0e0e0',
                },
            },
        },
    },
});

export default theme;
