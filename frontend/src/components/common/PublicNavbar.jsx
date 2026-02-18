import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    alpha,
    useTheme,
    useScrollTrigger
} from '@mui/material';
import { Spa, Storefront, Login } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { yellow } from '@mui/material/colors';


const PublicNavbar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();

    // Check if we are on the landing page specifically to handle transparency
    const isLanding = location.pathname === '/';

    // Scroll detection for changing navbar style
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    return (
        <AppBar
            position="fixed"
            elevation={scrolled || !isLanding ? 4 : 0}
            sx={{
                bgcolor: scrolled || !isLanding
                    ? 'rgba(27, 94, 32, 0.95)' // Dark green with slight transparency
                    : 'transparent',
                backdropFilter: scrolled || !isLanding ? 'blur(10px)' : 'none',
                transition: 'all 0.3s ease-in-out',
                borderBottom: scrolled || !isLanding ? '1px solid rgba(255,255,255,0.1)' : 'none',
                py: scrolled ? 0.5 : 1.5
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    {/* Logo Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/')}
                    >
                        <Box
                            sx={{
                                bgcolor: 'white',
                                width: 42,
                                height: 42,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'rotate(15deg)' }
                            }}
                        >
                            <Spa sx={{ color: theme.palette.primary.main, fontSize: 26 }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                    color: 'white',
                                    lineHeight: 1,
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                AgriChain
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: yellow[500],
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                    fontSize: '0.65rem',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                SMART FARMING
                            </Typography>
                        </Box>
                    </Box>

                    {/* Navigation Links (Desktop) */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {['Features', 'How it Works', 'Marketplace'].map((item) => (
                            <Button
                                key={item}
                                sx={{
                                    color: 'white',
                                    fontWeight: 600,
                                    opacity: 0.9,
                                    '&:hover': {
                                        opacity: 1,
                                        bgcolor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                {item}
                            </Button>
                        ))}
                    </Box>

                    {/* Auth Actions */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            color="inherit"
                            startIcon={<Login />}
                            onClick={() => navigate('/login')}
                            sx={{
                                fontWeight: 700,
                                display: { xs: 'none', sm: 'flex' }
                            }}
                        >
                            Log In
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            startIcon={<Storefront />}
                            disableElevation  // Add this to remove default elevation styles
                            sx={{
                                bgcolor: yellow[500],
                                '&:hover': {
                                    bgcolor: yellow[700],
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                                },
                                '&.MuiButton-contained': {
                                    bgcolor: yellow[500],  // Force override
                                },
                                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                                fontWeight: 700,
                                borderRadius: '10px',
                                px: 3,
                                color: theme.palette.primary.dark,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default PublicNavbar;
