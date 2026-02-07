import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    LinearProgress,
    Chip
} from '@mui/material';
import { loansAPI } from '../services/api';
import { useUser } from '../context/UserContext';

const Loans = () => {
    const { currentUser } = useUser();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            loadLoans();
        }
    }, [currentUser]);

    const loadLoans = async () => {
        try {
            setLoading(true);
            const response = await loansAPI.list(currentUser.id);
            setLoans(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading loans:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                My Loans
            </Typography>

            <Grid container spacing={3}>
                {/* Active Loan Card */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>Active Loan Status</Typography>
                        {loading ? (
                            <LinearProgress />
                        ) : loans.length > 0 ? (
                            loans.filter(l => l.status === 'active').map(loan => (
                                <Box key={loan.id} sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body1">Loan #{loan.id}</Typography>
                                        <Chip label="Active" color="success" size="small" />
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', my: 2 }}>
                                        KES {loan.amount.toLocaleString()}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Repaid: KES {loan.repaid.toLocaleString()}</Typography>
                                        <Typography variant="body2" color="text.secondary">Total Due: KES {loan.total.toLocaleString()}</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={loan.progress} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
                                    <Button variant="contained" color="primary">Make Repayment</Button>
                                </Box>
                            ))
                        ) : (
                            <Typography>No active loans.</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Apply for Loan */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%', bgcolor: 'primary.light', color: 'white' }}>
                        <Typography variant="h6" gutterBottom>Need Funding?</Typography>
                        <Typography variant="body2" paragraph>
                            Apply for a new loan based on your farm's assessment and credit score.
                        </Typography>
                        <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                            Apply Now
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Loans;
