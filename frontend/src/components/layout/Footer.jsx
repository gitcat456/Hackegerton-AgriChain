import { Box, Container, Typography, Link, Grid, Divider, alpha, useTheme } from '@mui/material';
import { Agriculture as AgricultureIcon } from '@mui/icons-material';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #0D1F0D 100%)`,
                color: 'white',
                py: 4,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <AgricultureIcon sx={{ color: theme.palette.primary.dark, fontSize: 22 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={700}>
                                AgriChain
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), maxWidth: 280 }}>
                            Empowering small-scale farmers with AI-powered crop assessment,
                            blockchain-secured escrow, and direct market access.
                        </Typography>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={600} mb={2}>
                            Platform
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Marketplace
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Get a Loan
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                AI Assessment
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle2" fontWeight={600} mb={2}>
                            Resources
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Documentation
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                API Reference
                            </Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Stellar Network
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" fontWeight={600} mb={2}>
                            Blockchain Powered
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                            Built on Stellar blockchain for secure, transparent, and
                            low-cost financial transactions between farmers and buyers.
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Box
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    bgcolor: alpha('#fff', 0.1),
                                    borderRadius: 2,
                                    fontSize: '0.75rem',
                                }}
                            >
                                🔗 Stellar
                            </Box>
                            <Box
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    bgcolor: alpha('#fff', 0.1),
                                    borderRadius: 2,
                                    fontSize: '0.75rem',
                                }}
                            >
                                🤖 AI Powered
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: alpha('#fff', 0.1) }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        © 2026 AgriChain. Hackathon MVP - Demonstrating Real-World Feasibility
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        Agriculture • AI • Blockchain
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
