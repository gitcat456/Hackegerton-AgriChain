import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    Stack,
    Card,
    CardContent,
    Avatar,
    Divider,
    useTheme,
    useMediaQuery,
    Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Agriculture,
    Storefront,
    Security,
    TrendingUp,
    CloudUpload,
    Assessment,
    AccountBalanceWallet,
    ShoppingCart,
    Verified,
    Speed,
    People,
    Star,
    ArrowForward
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { login } = useAuth();

    const handleDemoLogin = async (role) => {
        // Quick demo login with predefined users
        if (role === 'farmer') {
            await login('john@agrichain.com', 'demo');
            navigate('/farmer/dashboard');
        } else {
            await login('sarah@agrichain.com', 'demo');
            navigate('/marketplace');
        }
    };

    const features = [
        {
            icon: <Agriculture sx={{ fontSize: 48 }} />,
            title: 'AI Crop Assessment',
            description: 'Upload photos of your crops. Our advanced AI analyzes plant health, predicts yield, and generates an instant credit score.',
            color: '#2E7D32'
        },
        {
            icon: <Storefront sx={{ fontSize: 48 }} />,
            title: 'Direct Marketplace',
            description: 'Sell verified produce directly to buyers. Skip the middlemen, get better prices, and build lasting business relationships.',
            color: '#FF9800'
        },
        {
            icon: <Security sx={{ fontSize: 48 }} />,
            title: 'Secure Escrow',
            description: 'Blockchain-powered escrow protects both farmers and buyers. Funds are released only when delivery is confirmed.',
            color: '#1976D2'
        }
    ];

    const howItWorks = [
        { icon: <CloudUpload />, title: 'Upload Crops', desc: 'Take photos of your crops and upload them to our platform' },
        { icon: <Assessment />, title: 'Get Assessment', desc: 'AI analyzes crop health and generates your credit score' },
        { icon: <AccountBalanceWallet />, title: 'Access Finance', desc: 'Apply for loans based on your verified crop value' },
        { icon: <ShoppingCart />, title: 'Sell & Earn', desc: 'List produce on marketplace with AI quality badge' },
    ];

    const stats = [
        { value: '10K+', label: 'Active Farmers' },
        { value: 'KES 50M+', label: 'Loans Disbursed' },
        { value: '98%', label: 'Repayment Rate' },
        { value: '4.8★', label: 'Farmer Rating' },
    ];

    const testimonials = [
        {
            name: 'Mary Wanjiku',
            role: 'Farmer, Nakuru',
            avatar: 'https://i.pravatar.cc/150?u=mary',
            quote: 'AgriChain helped me get a loan in 24 hours based on my crop assessment. My farm has grown 3x since joining!',
            rating: 5
        },
        {
            name: 'James Mwangi',
            role: 'Buyer, Thika',
            avatar: 'https://i.pravatar.cc/150?u=james',
            quote: 'The AI quality badges give me confidence in what I\'m buying. No more surprises with produce quality.',
            rating: 5
        },
        {
            name: 'Grace Achieng',
            role: 'Farmer, Machakos',
            avatar: 'https://i.pravatar.cc/150?u=grace',
            quote: 'Direct sales to buyers mean better prices. I\'ve increased my income by 40% this season.',
            rating: 5
        }
    ];

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)',
                    color: 'white',
                    pt: { xs: 8, md: 12 },
                    pb: { xs: 10, md: 14 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.5,
                    }
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Fade in timeout={800}>
                                <Box>
                                    <Typography
                                        variant="h2"
                                        fontWeight="800"
                                        sx={{
                                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                                            lineHeight: 1.1,
                                            mb: 3
                                        }}
                                    >
                                        Empowering Farmers with
                                        <Box
                                            component="span"
                                            sx={{
                                                display: 'block',
                                                background: 'linear-gradient(90deg, #FFD54F 0%, #FFB74D 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            AI & Blockchain
                                        </Box>
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 4,
                                            opacity: 0.9,
                                            maxWidth: 500,
                                            lineHeight: 1.6
                                        }}
                                    >
                                        Get instant crop assessments, access affordable loans, and sell directly to buyers — all powered by cutting-edge technology.
                                    </Typography>

                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            onClick={() => handleDemoLogin('farmer')}
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                borderRadius: 3,
                                                boxShadow: '0 8px 24px rgba(255,152,0,0.4)',
                                            }}
                                        >
                                            I'm a Farmer
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={() => handleDemoLogin('buyer')}
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                borderRadius: 3,
                                                borderColor: 'white',
                                                color: 'white',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    bgcolor: 'rgba(255,255,255,0.1)',
                                                }
                                            }}
                                        >
                                            I'm a Buyer
                                        </Button>
                                    </Stack>
                                </Box>
                            </Fade>
                        </Grid>

                        <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        width: 300,
                                        height: 300,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&h=400&fit=crop"
                                    alt="Farming"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 4,
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Bar */}
            <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 10 }}>
                <Paper
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }}
                >
                    <Grid container spacing={3} justifyContent="center">
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Box textAlign="center">
                                    <Typography
                                        variant="h4"
                                        fontWeight="800"
                                        color="primary"
                                        sx={{ mb: 0.5 }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <Box textAlign="center" mb={6}>
                    <Typography variant="h3" fontWeight="700" gutterBottom>
                        Why Choose AgriChain?
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        We combine cutting-edge AI with blockchain technology to revolutionize agricultural finance.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                    }
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: `${feature.color}15`,
                                        color: feature.color,
                                        mx: 'auto',
                                        mb: 3,
                                    }}
                                >
                                    {feature.icon}
                                </Avatar>
                                <Typography variant="h5" fontWeight="700" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* How It Works */}
            <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={6}>
                        <Typography variant="h3" fontWeight="700" gutterBottom>
                            How It Works
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Get started in four simple steps
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {howItWorks.map((step, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Box textAlign="center">
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            display: 'inline-block',
                                            mb: 2,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 72,
                                                height: 72,
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                fontSize: 28,
                                            }}
                                        >
                                            {step.icon}
                                        </Avatar>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                bgcolor: 'secondary.main',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 14,
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                    </Box>
                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {step.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
                <Box textAlign="center" mb={6}>
                    <Typography variant="h3" fontWeight="700" gutterBottom>
                        Trusted by Thousands
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        See what our community says about AgriChain
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {testimonials.map((testimonial, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', mb: 2 }}>
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} sx={{ color: '#FFB74D', fontSize: 20 }} />
                                        ))}
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontStyle: 'italic',
                                            mb: 3,
                                            lineHeight: 1.7,
                                            color: 'text.secondary'
                                        }}
                                    >
                                        "{testimonial.quote}"
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar src={testimonial.avatar} sx={{ width: 48, height: 48 }} />
                                        <Box>
                                            <Typography fontWeight="600">{testimonial.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {testimonial.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: { xs: 8, md: 10 },
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="700" gutterBottom>
                        Ready to Transform Your Farm?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Join thousands of farmers already using AgriChain to grow their business.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={() => handleDemoLogin('farmer')}
                            sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
                        >
                            Get Started as Farmer
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => handleDemoLogin('buyer')}
                            sx={{
                                px: 5,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Browse as Buyer
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: 'grey.900', color: 'grey.400', py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 1,
                                        bgcolor: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight="800" color="white">
                                        A
                                    </Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="700" color="white">
                                    AgriChain
                                </Typography>
                            </Box>
                            <Typography variant="body2">
                                Empowering farmers with AI-powered credit and blockchain-secured markets.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                            <Typography variant="body2">
                                © 2026 AgriChain Platform. Hackathon MVP Demo.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing;
