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
    Chip,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import PublicNavbar from '../components/common/PublicNavbar';
import {
    ArrowForward,
    Speed,
    Security,
    Psychology,
    Agriculture,
    LocalFlorist,
    WaterDrop,
    Storefront,
    TrendingUp,
    Verified,
    Groups,
    AccountBalance,
    BarChart
} from '@mui/icons-material';
import CountUp from 'react-countup';
import { useState, useEffect, useRef, useCallback } from 'react';

const Landing = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    // Fix: Use Intersection Observer API directly
    const [countersStarted, setCountersStarted] = useState(false);
    const statsRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        // Clean up previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !countersStarted) {
                    setCountersStarted(true);
                    // Disconnect after triggering to prevent further observations
                    if (observerRef.current) {
                        observerRef.current.disconnect();
                    }
                }
            },
            {
                threshold: 0.3,
                rootMargin: '0px',
            }
        );

        // Start observing
        if (statsRef.current) {
            observerRef.current.observe(statsRef.current);
        }

        // Cleanup on unmount
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [countersStarted]); // Only re-run if countersStarted changes

    /* ──────────────────────────────────────────────────────────────────────
     * HERO SECTION
     * ────────────────────────────────────────────────────────────────────── */
    const Hero = () => (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 60%, #0a1a0a 100%)`,
                position: 'relative',
                overflow: 'hidden',
                pt: { xs: 10, md: 0 },
                pb: { xs: 8, md: 0 },
                color: 'white',
            }}
        >
            {/* ── Decorative Background Layers ── */}
            {/* Organic pattern overlay */}
            <Box className="hero-pattern" />

            {/* Glowing gold orb (right) */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                right: '-8%',
                width: { xs: '50vw', md: '35vw' },
                height: { xs: '50vw', md: '35vw' },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.25)} 0%, transparent 70%)`,
                filter: 'blur(80px)',
                zIndex: 0,
            }} />

            {/* Glowing green orb (left-bottom) */}
            <Box sx={{
                position: 'absolute',
                bottom: '-15%',
                left: '-5%',
                width: { xs: '40vw', md: '25vw' },
                height: { xs: '40vw', md: '25vw' },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 70%)`,
                filter: 'blur(60px)',
                zIndex: 0,
            }} />

            {/* Subtle grain texture */}
            <Box sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
                opacity: 0.4,
                zIndex: 0,
                pointerEvents: 'none',
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">

                    {/* ── Left Column: Text Content ── */}
                    <Grid item xs={12} md={6}>
                        <Box className="animate-fade-in-up">
                            {/* Badge pill */}
                            <Chip
                                icon={<Agriculture sx={{ fontSize: 16, color: 'inherit' }} />}
                                label="THE FUTURE OF FARMING"
                                size="small"
                                sx={{
                                    mt: { xs: 4, md: 8 },
                                    mb: 3,
                                    bgcolor: 'rgba(255,255,255,0.12)',
                                    color: theme.palette.secondary.main,
                                    fontWeight: 700,
                                    letterSpacing: 1.5,
                                    fontSize: '0.7rem',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(8px)',
                                    py: 0.5,
                                    '& .MuiChip-icon': { color: theme.palette.secondary.main },
                                }}
                            />

                            {/* Hero headline */}
                            <Typography
                                variant="h1"
                                fontWeight={800}
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.8rem', lg: '4.2rem' },
                                    lineHeight: 1.08,
                                    mb: 3,
                                    color: 'white',
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                Empowering Farmers{' '}
                                <br />
                                with{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    AI
                                </Box>
                                {' & '}
                                <Box
                                    component="span"
                                    sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, #fff 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    Blockchain
                                </Box>
                            </Typography>

                            {/* Subheadline */}
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 5,
                                    maxWidth: 480,
                                    lineHeight: 1.7,
                                    color: 'rgba(255,255,255,0.8)',
                                    fontWeight: 400,
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                }}
                            >
                                Access fair credit, verified crop assessments, and direct
                                market connections — all secured by blockchain technology.
                            </Typography>

                            {/* CTA Buttons */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/login')}
                                    id="hero-cta-farmer"
                                    sx={{
                                        py: 1.8,
                                        px: 4,
                                        fontSize: '1.05rem',
                                        borderRadius: 2.5,
                                        fontWeight: 700,
                                        color: 'primary.dark',
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.4)}`,
                                        '&:hover': {
                                            boxShadow: `0 8px 30px ${alpha(theme.palette.secondary.main, 0.5)}`,
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    I'm a Farmer
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    endIcon={<Storefront />}
                                    onClick={() => navigate('/login')}
                                    id="hero-cta-buyer"
                                    sx={{
                                        py: 1.8,
                                        px: 4,
                                        fontSize: '1.05rem',
                                        borderRadius: 2.5,
                                        borderWidth: 2,
                                        fontWeight: 600,
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.35)',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            borderWidth: 2,
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    I'm a Buyer
                                </Button>
                            </Stack>

                            {/* Trust stats row - FIXED: using ref from useRef */}
                            <Stack
                                direction="row"
                                spacing={3}
                                mt={6}
                                className="animate-fade-in-up delay-300"
                                ref={statsRef}
                            >
                                {[
                                    { end: 500, suffix: '+', label: 'Farmers', icon: <Groups sx={{ fontSize: 18 }} /> },
                                    { end: 2000000, prefix: 'KES ', suffix: '+', label: 'Traded', icon: <TrendingUp sx={{ fontSize: 18 }} />, formattingFn: (value) => `${(value / 1000000).toFixed(1)}M+` },
                                    { end: 95, suffix: '%', label: 'Accuracy', icon: <Verified sx={{ fontSize: 18 }} /> },
                                ].map((stat, i) => (
                                    <Box key={i} sx={{ textAlign: 'center' }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            color: theme.palette.secondary.main,
                                            mb: 0.5,
                                        }}>
                                            {stat.icon}
                                            <Typography
                                                variant="h5"
                                                fontWeight={800}
                                                sx={{ color: 'white' }}
                                            >
                                                {countersStarted ? (
                                                    <CountUp
                                                        end={stat.end}
                                                        duration={2.5}
                                                        prefix={stat.prefix || ''}
                                                        suffix={stat.suffix || ''}
                                                        formattingFn={stat.formattingFn}
                                                        separator=","
                                                        useEasing={true}
                                                        preserveValue={true}
                                                        // Add delay to stagger animations
                                                        delay={i * 0.2}
                                                    />
                                                ) : (
                                                    stat.prefix ? `${stat.prefix}0${stat.suffix || ''}` : `0${stat.suffix || ''}`
                                                )}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'block',
                                                color: 'rgba(255,255,255,0.6)',
                                                fontWeight: 500,
                                                letterSpacing: 0.5,
                                            }}
                                        >
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* ── Right Column: Dashboard Preview ── */}
                    {!isMobile && (
                        <Grid item xs={12} md={6}>
                            <Box
                                className="animate-fade-in-right delay-200"
                                sx={{ position: 'relative', perspective: '1200px' }}
                            >
                                {/* Main Dashboard Card */}
                                <Paper
                                    elevation={24}
                                    sx={{
                                        p: 0,
                                        borderRadius: 4,
                                        transform: { md: 'rotateY(-8deg) rotateX(4deg)' },
                                        background: 'rgba(255,255,255,0.97)',
                                        maxWidth: 520,
                                        mx: 'auto',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.5s ease',
                                        '&:hover': {
                                            transform: { md: 'rotateY(-3deg) rotateX(2deg) scale(1.02)' },
                                        },
                                    }}
                                >
                                    {/* Preview image */}
                                    <Box
                                        component="img"
                                        src="https://images.unsplash.com/photo-1680008702821-e1b598db30f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuZ29lc3xlbnwwfHwwfHx8MA%3D%3D"
                                        alt="Fresh agricultural produce"
                                        sx={{
                                            width: '100%',
                                            height: 220,
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />

                                    {/* Stats overlay */}
                                    <Box sx={{ p: 2.5 }}>
                                        <Stack direction="row" spacing={2} justifyContent="space-between">
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>
                                                    Current Yield
                                                </Typography>
                                                <Typography variant="h5" fontWeight={700} color="text.primary">
                                                    High (98%)
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>
                                                    Market Price
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end">
                                                    <TrendingUp sx={{ fontSize: 18, color: 'success.main' }} />
                                                    <Typography variant="h5" fontWeight={700} color="success.main">
                                                        +12.5%
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Stack>

                                        {/* Mini progress bar */}
                                        <Box sx={{
                                            mt: 2,
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            overflow: 'hidden',
                                        }}>
                                            <Box sx={{
                                                width: '78%',
                                                height: '100%',
                                                borderRadius: 3,
                                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                            }} />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            Crop health score • AI-verified
                                        </Typography>
                                    </Box>
                                </Paper>

                                {/* Floating notification badge */}
                                <Paper
                                    elevation={8}
                                    className="animate-float"
                                    sx={{
                                        position: 'absolute',
                                        bottom: -16,
                                        left: -16,
                                        p: 1.5,
                                        px: 2.5,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        bgcolor: 'white',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                        border: '1px solid rgba(0,0,0,0.04)',
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), width: 36, height: 36 }}>
                                        <AccountBalance sx={{ fontSize: 18, color: 'success.main' }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" fontWeight={700} color="success.main">
                                            Loan Approved
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                            KES 25,000 • Just now
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );

    /* ──────────────────────────────────────────────────────────────────────
     * FEATURES SECTION - Tall vertical cards (iPhone-shaped, original styling)
     * ────────────────────────────────────────────────────────────────────── */
    const features = [
        {
            icon: <Psychology sx={{ fontSize: 32 }} />,
            title: 'AI Crop Assessment',
            description: 'Upload photos of your crops and receive instant health assessments powered by machine learning.',
            color: theme.palette.primary.main,
        },
        {
            icon: <AccountBalance sx={{ fontSize: 32 }} />,
            title: 'Fair Micro-Loans',
            description: 'Access agricultural loans based on your crop data and credit history — no collateral needed.',
            color: theme.palette.secondary.dark,
        },
        {
            icon: <Storefront sx={{ fontSize: 32 }} />,
            title: 'Direct Marketplace',
            description: 'Connect directly with buyers. No middlemen. Fair prices for quality Kenyan produce.',
            color: theme.palette.info.main,
        },
        {
            icon: <Security sx={{ fontSize: 32 }} />,
            title: 'Blockchain Escrow',
            description: 'Secure transactions with smart contract-powered escrow — everyone gets paid fairly.',
            color: '#6D4C41',
        },
        {
            icon: <BarChart sx={{ fontSize: 32 }} />,
            title: 'Market Analytics',
            description: 'Track crop prices, market trends, and optimize your selling strategy with real-time data.',
            color: theme.palette.success.main,
        },
        {
            icon: <Speed sx={{ fontSize: 32 }} />,
            title: 'Instant Wallet',
            description: 'Deposit, withdraw, and manage your earnings seamlessly with our built-in digital wallet.',
            color: theme.palette.warning.main,
        },
    ];

    const Features = () => (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                px: { xs: 2, md: 0 },
                bgcolor: 'background.default',
                position: 'relative',
            }}
        >
            <Container maxWidth="lg">
                {/* Section header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                    <Chip
                        label="PLATFORM FEATURES"
                        size="small"
                        sx={{
                            mb: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            letterSpacing: 1,
                            fontSize: '0.7rem',
                        }}
                    />
                    <Typography
                        variant="h2"
                        fontWeight={700}
                        sx={{
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            color: 'text.primary',
                        }}
                    >
                        Everything You Need to{' '}
                        <Box component="span" className="gradient-text">
                            Grow & Sell
                        </Box>
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ maxWidth: 560, mx: 'auto' }}
                    >
                        From crop assessment to market sale — AgriChain is the complete agricultural platform for modern Kenyan farmers.
                    </Typography>
                </Box>

                {/* Feature cards grid - Tall vertical cards */}
                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                >
                    {features.map((feature, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Paper
                                className={`hover-lift animate-fade-in-up delay-${(index + 1) * 100}`}
                                elevation={0}
                                sx={{
                                    width: '100%',
                                    maxWidth: 300,           // Narrow like iPhone
                                    height: 380,              // Tall like iPhone but not excessive
                                    p: 3,
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: alpha(feature.color, 0.1),
                                    bgcolor: 'white',
                                    cursor: 'default',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        borderColor: alpha(feature.color, 0.25),
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 12px 24px ${alpha(feature.color, 0.1)}`,
                                        '& .feature-icon': {
                                            transform: 'scale(1.1) rotate(-5deg)',
                                        },
                                    },
                                }}
                            >
                                {/* Background accent blob - original styling */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: -30,
                                    right: -30,
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    bgcolor: alpha(feature.color, 0.06),
                                }} />

                                {/* Icon - positioned at top */}
                                <Avatar
                                    className="feature-icon"
                                    variant="rounded"
                                    sx={{
                                        bgcolor: alpha(feature.color, 0.1),
                                        color: feature.color,
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3,
                                        mb: 3,
                                        transition: 'transform 0.3s ease',
                                    }}
                                >
                                    {feature.icon}
                                </Avatar>

                                {/* Title */}
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    gutterBottom
                                    sx={{
                                        color: 'text.primary',
                                        mb: 2,
                                    }}
                                >
                                    {feature.title}
                                </Typography>

                                {/* Description - will expand to fill remaining space */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        lineHeight: 1.7,
                                        flex: 1,  // Takes remaining vertical space
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );

    /* ──────────────────────────────────────────────────────────────────────
     * HOW IT WORKS SECTION
     * ────────────────────────────────────────────────────────────────────── */
    const steps = [
        { step: '01', title: 'Sign Up', description: 'Create your farmer or buyer account in seconds.', icon: <Groups /> },
        { step: '02', title: 'Upload & Assess', description: 'Upload crop photos for AI-powered health analysis.', icon: <Psychology /> },
        { step: '03', title: 'List & Sell', description: 'Create listings and connect with verified buyers.', icon: <Storefront /> },
        { step: '04', title: 'Get Paid', description: 'Receive payments securely via blockchain escrow.', icon: <Security /> },
    ];

    const HowItWorks = () => (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                    <Chip
                        label="HOW IT WORKS"
                        size="small"
                        sx={{
                            mb: 2,
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.dark,
                            fontWeight: 700,
                            letterSpacing: 1,
                            fontSize: '0.7rem',
                        }}
                    />
                    <Typography
                        variant="h2"
                        fontWeight={700}
                        sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
                    >
                        Simple Steps to{' '}
                        <Box component="span" className="gradient-text-gold">
                            Success
                        </Box>
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {steps.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Box
                                className={`animate-fade-in-up delay-${(index + 1) * 100}`}
                                sx={{
                                    textAlign: 'center',
                                    position: 'relative',
                                }}
                            >
                                {/* Step number */}
                                <Typography
                                    variant="h1"
                                    fontWeight={900}
                                    sx={{
                                        fontSize: '4rem',
                                        color: alpha(theme.palette.primary.main, 0.06),
                                        lineHeight: 1,
                                        mb: -2,
                                        position: 'relative',
                                        zIndex: 0,
                                    }}
                                >
                                    {item.step}
                                </Typography>

                                {/* Icon circle */}
                                <Avatar
                                    sx={{
                                        bgcolor: 'white',
                                        color: theme.palette.primary.main,
                                        width: 64,
                                        height: 64,
                                        mx: 'auto',
                                        mb: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    {item.icon}
                                </Avatar>

                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 220, mx: 'auto' }}>
                                    {item.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );

    /* ──────────────────────────────────────────────────────────────────────
     * CTA FOOTER SECTION
     * ────────────────────────────────────────────────────────────────────── */
    const CtaFooter = () => (
        <Box
            sx={{
                py: { xs: 8, md: 10 },
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle pattern */}
            <Box className="hero-pattern" />

            {/* Gold accent orb */}
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50vw',
                height: '50vw',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.12)} 0%, transparent 60%)`,
                filter: 'blur(60px)',
            }} />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    fontWeight={800}
                    color="white"
                    gutterBottom
                    sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}
                >
                    Ready to Transform Your Farming?
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: 'rgba(255,255,255,0.75)',
                        mb: 5,
                        fontWeight: 400,
                        maxWidth: 500,
                        mx: 'auto',
                    }}
                >
                    Join hundreds of Kenyan farmers already earning more through smart, direct trade.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/login')}
                        id="cta-footer-get-started"
                        sx={{
                            py: 1.8,
                            px: 5,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: 2.5,
                            color: 'primary.dark',
                            boxShadow: `0 4px 24px ${alpha(theme.palette.secondary.main, 0.4)}`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.5)}`,
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        Get Started Free
                    </Button>
                </Stack>

                {/* Trust line */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 3,
                        color: 'rgba(255,255,255,0.45)',
                        fontWeight: 500,
                    }}
                >
                    No credit card required • Demo environment available
                </Typography>
            </Container>
        </Box>
    );

    /* ──────────────────────────────────────────────────────────────────────
     * FOOTER
     * ────────────────────────────────────────────────────────────────────── */
    const Footer = () => (
        <Box
            component="footer"
            sx={{
                py: 4,
                bgcolor: '#0a1a0a',
                color: 'rgba(255,255,255,0.5)',
                textAlign: 'center',
            }}
        >
            <Container maxWidth="lg">
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={1}>
                    <LocalFlorist sx={{ fontSize: 20, color: theme.palette.primary.light }} />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        AgriChain
                    </Typography>
                </Stack>
                <Typography variant="caption">
                    © {new Date().getFullYear()} AgriChain — Smart Agricultural Marketplace. Built with ❤️ for Kenyan Farmers.
                </Typography>
            </Container>
        </Box>
    );

    /* ──────────────────────────────────────────────────────────────────────
     * PAGE RENDER
     * ────────────────────────────────────────────────────────────────────── */
    return (
        <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
            <PublicNavbar />
            <Hero />
            <Features />
            <HowItWorks />
            <CtaFooter />
            <Footer />
        </Box>
    );
};

export default Landing;