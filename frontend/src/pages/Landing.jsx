import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Typography,
    Grid,
    Paper,
    Stack,
    Avatar,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ArrowForward,
    Speed,
    Security,
    Psychology,
    Agriculture,
    LocalFlorist,
    WaterDrop,
    Storefront
} from '@mui/icons-material';

const Landing = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Hero Section - Updated to Green Gradient
    const Hero = () => (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, // Solid green gradient
                position: 'relative',
                overflow: 'hidden',
                pt: { xs: 8, md: 0 },
                color: 'white' // Text is white on green
            }}
        >
            {/* Background Pattern/Texture */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', // Subtle texture
                opacity: 0.1,
                zIndex: 0
            }} />

            {/* Glowing Orbs */}
            <Box sx={{
                position: 'absolute',
                top: '20%',
                right: '-10%',
                width: '40vw',
                height: '40vw',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.secondary.main} 0%, rgba(255,255,255,0) 70%)`,
                opacity: 0.2,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box className="animate-fade-in-up">
                            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                                <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'secondary.main' }}>
                                    <Agriculture fontSize="small" />
                                </Box>
                                <Typography variant="subtitle2" color="secondary.main" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
                                    THE FUTURE OF FARMING
                                </Typography>
                            </Stack>

                            <Typography variant="h1" fontWeight={800} sx={{
                                fontSize: { xs: '3rem', md: '4.5rem' },
                                lineHeight: 1.1,
                                mb: 3,
                                color: 'white' // Override default primary color text
                            }}>
                                Empowering Farmers with <span style={{ color: theme.palette.secondary.main }}>AI</span> & <span style={{ color: theme.palette.secondary.main }}>Blockchain</span>
                            </Typography>

                            <Typography variant="h5" sx={{ mb: 5, maxWidth: 500, lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                                Access fair credit, verified crop assessments, and direct market connections. All secured by blockchain technology.
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        py: 2,
                                        px: 4,
                                        fontSize: '1.1rem',
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        color: 'primary.dark'
                                    }}
                                >
                                    I'm a Farmer
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    endIcon={<Storefront />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        py: 2,
                                        px: 4,
                                        fontSize: '1.1rem',
                                        borderRadius: 2,
                                        borderWidth: 2,
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.4)',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    I'm a Buyer
                                </Button>
                            </Stack>

                            <Stack direction="row" spacing={4} mt={6}>
                                <Box>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, mb: 1, color: 'primary.dark' }} src="https://cdni.iconscout.com/illustration/premium/thumb/tractor-5690623-4759082.png?f=webp" variant="square" />
                                    {/* Used icon instead of text stats for differentiation */}
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Right Side - Dashboard Preview Card */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative', perspective: '1000px' }}>
                            {/* Main Dashboard Preview */}
                            <Paper
                                elevation={24}
                                sx={{
                                    p: 2,
                                    borderRadius: 4,
                                    transform: 'rotateY(-10deg) rotateX(5deg)',
                                    background: 'rgba(255,255,255,0.95)',
                                    maxWidth: 600,
                                    mx: 'auto'
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1680008702821-e1b598db30f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuZ29lc3xlbnwwfHwwfHx8MA%3D%3D"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 2,
                                        mb: 2,
                                        height: 250,
                                        objectFit: 'cover'
                                    }}
                                />
                                <Stack direction="row" spacing={2} justifyContent="space-between">
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Current Yield</Typography>
                                        <Typography variant="h5" fontWeight={700}>High (98%)</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Market Price</Typography>
                                        <Typography variant="h5" fontWeight={700} color="success.main">+12.5%</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            <Hero />
        </Box>
    );
};

export default Landing;
