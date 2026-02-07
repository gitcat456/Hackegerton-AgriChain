import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Agriculture,
    SmartToy,
    AccountBalance,
    Storefront,
    TrendingUp,
    Security,
    ArrowForward,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';

const Home = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { switchRole } = useUser();

    const features = [
        {
            icon: <SmartToy sx={{ fontSize: 48 }} />,
            title: 'AI Crop Assessment',
            description: 'Upload farm images and get instant AI-powered analysis of crop health, yield estimates, and risk assessment.',
            color: theme.palette.primary.main,
        },
        {
            icon: <AccountBalance sx={{ fontSize: 48 }} />,
            title: 'Smart Lending',
            description: 'Access fair credit based on your crop data. Milestone-based disbursement with blockchain escrow.',
            color: theme.palette.secondary.main,
        },
        {
            icon: <Storefront sx={{ fontSize: 48 }} />,
            title: 'Direct Marketplace',
            description: 'Connect directly with buyers. Transparent pricing with AI-verified quality assessments.',
            color: theme.palette.info.main,
        },
        {
            icon: <Security sx={{ fontSize: 48 }} />,
            title: 'Blockchain Escrow',
            description: 'Secure payments through Stellar blockchain. Funds released only when goods are confirmed received.',
            color: theme.palette.success.main,
        },
    ];

    const stats = [
        { value: '50K+', label: 'Farmers Empowered' },
        { value: '$2M+', label: 'Loans Disbursed' },
        { value: '99.5%', label: 'Repayment Rate' },
        { value: '48hrs', label: 'Avg. Loan Approval' },
    ];

    const handleGetStarted = (role) => {
        switchRole(role);
        if (role === 'farmer') navigate('/farmer');
        else navigate('/marketplace');
    };

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
                    color: 'white',
                    pt: 10,
                    pb: 12,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.5,
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    lineHeight: 1.1,
                                }}
                            >
                                Empowering Farmers with{' '}
                                <Box component="span" sx={{ color: '#FFD700' }}>AI</Box> &{' '}
                                <Box component="span" sx={{ color: '#FFD700' }}>Blockchain</Box>
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    opacity: 0.9,
                                    fontWeight: 400,
                                    lineHeight: 1.6,
                                }}
                            >
                                Access fair credit, verified crop assessments, and direct market connections.
                                All secured by blockchain technology.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    onClick={() => handleGetStarted('farmer')}
                                    sx={{
                                        bgcolor: '#FFD700',
                                        color: theme.palette.primary.dark,
                                        px: 4,
                                        py: 1.5,
                                        fontWeight: 700,
                                        '&:hover': {
                                            bgcolor: '#FFC000',
                                        },
                                    }}
                                >
                                    I'm a Farmer
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    endIcon={<Storefront />}
                                    onClick={() => handleGetStarted('buyer')}
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: alpha('#fff', 0.1),
                                        },
                                    }}
                                >
                                    I'm a Buyer
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 280,
                                        height: 280,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${alpha('#FFD700', 0.3)} 0%, ${alpha('#FF6F00', 0.2)} 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 20px 80px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <Agriculture sx={{ fontSize: 160, color: '#FFD700' }} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 800,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 10, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{ fontWeight: 700, mb: 2 }}
                    >
                        How AgriChain Works
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
                    >
                        A complete ecosystem connecting farmers, buyers, and lenders through
                        AI-powered insights and blockchain security.
                    </Typography>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        p: 2,
                                        border: `1px solid ${alpha(feature.color, 0.2)}`,
                                        '&:hover': {
                                            borderColor: feature.color,
                                            '& .feature-icon': {
                                                transform: 'scale(1.1)',
                                            },
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            className="feature-icon"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                bgcolor: alpha(feature.color, 0.1),
                                                color: feature.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2,
                                                transition: 'transform 0.3s ease',
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: 8,
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <TrendingUp sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Ready to Transform Your Farming?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Join thousands of farmers accessing fair credit and direct markets.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => handleGetStarted('farmer')}
                        sx={{
                            bgcolor: 'white',
                            color: theme.palette.secondary.main,
                            px: 5,
                            py: 1.5,
                            fontWeight: 700,
                            '&:hover': {
                                bgcolor: alpha('#fff', 0.9),
                            },
                        }}
                    >
                        Get Started Now
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
