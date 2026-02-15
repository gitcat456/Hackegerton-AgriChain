import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    useTheme,
    useMediaQuery,
    Avatar,
    Tab,
    Tabs,
    Divider
} from '@mui/material';
import {
    Agriculture,
    Storefront,
    ArrowForward,
    LockOpen,
    Spa,
    Grass
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [role, setRole] = useState(0); // 0 for Farmer, 1 for Buyer
    const [loading, setLoading] = useState(false);

    const handleDemoLogin = async (selectedRole) => {
        setLoading(true);
        // Simulate network request
        setTimeout(async () => {
            try {
                const email = selectedRole === 'farmer' ? 'john@agrichain.com' : 'sarah@agrichain.com';
                await login(email, 'password');
                navigate(selectedRole === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
            } catch (error) {
                console.error('Login failed:', error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',

            }}
        >
            {/* Background Decor */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.4) 0%, rgba(5, 150, 105, 0.1) 100%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -50,
                    left: -100,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(217, 119, 6, 0.1) 100%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
                <Grid container spacing={8} alignItems="center">
                    {/* Left Side - Hero Content */}
                    {!isMobile && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box className="animate-float">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                        <Spa fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h3" fontWeight={800} className="gradient-text">
                                        AgriChain
                                    </Typography>
                                </Box>
                                <Typography variant="h2" fontWeight={700} gutterBottom sx={{ lineHeight: 1.2 }}>
                                    Empowering <br />
                                    <span style={{ color: theme.palette.primary.main }}>Agriculture</span> with AI
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: 450 }}>
                                    Experience the future of farming. Connect directly with buyers, assess crop health instantly, and access fair financing.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Paper sx={{ p: 2, minWidth: 140, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.6)' }}>
                                        <Typography variant="h4" color="primary.main" fontWeight={700}>500+</Typography>
                                        <Typography variant="body2" color="text.secondary">Farmers</Typography>
                                    </Paper>
                                    <Paper sx={{ p: 2, minWidth: 140, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.6)' }}>
                                        <Typography variant="h4" color="secondary.main" fontWeight={700}>$2M+</Typography>
                                        <Typography variant="body2" color="text.secondary">Traded</Typography>
                                    </Paper>
                                </Box>
                            </Box>
                        </Grid>
                    )}

                    {/* Right Side - Login Card */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={24}
                            sx={{
                                p: { xs: 3, md: 5 },
                                borderRadius: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(20px)',
                                maxWidth: 480,
                                mx: 'auto'
                            }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    Welcome Back
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Select your role to explore the demo
                                </Typography>
                            </Box>

                            <Tabs
                                value={role}
                                onChange={(e, v) => setRole(v)}
                                centered
                                sx={{
                                    mb: 4,
                                    '& .MuiTabs-indicator': { height: 3, borderRadius: 3 }
                                }}
                            >
                                <Tab icon={<Grass />} label="I'm a Farmer" iconPosition="start" />
                                <Tab icon={<Storefront />} label="I'm a Buyer" iconPosition="start" />
                            </Tabs>

                            <Box role="tabpanel" hidden={role !== 0}>
                                {role === 0 && (
                                    <Box className="animate-fade-in">
                                        <Typography variant="body1" paragraph>
                                            Access your dashboard to manage crops, apply for loans, and sell produce.
                                        </Typography>
                                        <Button
                                            fullWidth
                                            size="large"
                                            variant="contained"
                                            onClick={() => handleDemoLogin('farmer')}
                                            disabled={loading}
                                            startIcon={!loading && <Agriculture />}
                                            sx={{ py: 2, fontSize: '1.1rem' }}
                                        >
                                            {loading ? 'Entering Farm...' : 'Enter Farmer Demo'}
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Box role="tabpanel" hidden={role !== 1}>
                                {role === 1 && (
                                    <Box className="animate-fade-in">
                                        <Typography variant="body1" paragraph>
                                            Access the marketplace to buy fresh produce, track orders, and manage wallet.
                                        </Typography>
                                        <Button
                                            fullWidth
                                            size="large"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDemoLogin('buyer')}
                                            disabled={loading}
                                            startIcon={!loading && <Storefront />}
                                            sx={{ py: 2, fontSize: '1.1rem' }}
                                        >
                                            {loading ? 'Entering Market...' : 'Enter Buyer Demo'}
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Divider sx={{ my: 4 }}>
                                <Typography variant="caption" color="text.secondary">
                                    SECURE DEMO ENVIRONMENT
                                </Typography>
                            </Divider>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                    No password required for this demo.
                                    <br />
                                    Data is simulated for demonstration purposes.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Login;
