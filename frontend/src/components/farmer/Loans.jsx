import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid,
    Button,
    LinearProgress,
    Chip,
    Avatar,
    Skeleton,
    Divider
} from '@mui/material';
import {
    MonetizationOn,
    CheckCircle,
    HourglassEmpty,
    PlayArrow,
    Cancel,
    Add,
    Payment
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const Loans = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const loadLoans = async () => {
            if (user) {
                setLoading(true);
                const data = await mockApi.getLoans(user.id);
                setLoans(data);
                setLoading(false);
            }
        };
        loadLoans();
    }, [user]);

    const activeLoans = loans.filter(l => l.status === 'ACTIVE' || l.status === 'APPROVED');
    const pendingLoans = loans.filter(l => l.status === 'PENDING');
    const completedLoans = loans.filter(l => l.status === 'COMPLETED');
    const rejectedLoans = loans.filter(l => l.status === 'REJECTED');

    const tabs = [
        { label: 'Active', icon: <PlayArrow />, data: activeLoans },
        { label: 'Pending', icon: <HourglassEmpty />, data: pendingLoans },
        { label: 'Completed', icon: <CheckCircle />, data: completedLoans },
        { label: 'Rejected', icon: <Cancel />, data: rejectedLoans }
    ];

    const displayedLoans = tabs[tabValue].data;

    const LoanCard = ({ loan }) => {
        const totalWithInterest = loan.amount * (1 + loan.interestRate / 100);
        const progress = (loan.amountPaid / totalWithInterest) * 100;

        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                                <MonetizationOn />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">
                                    KES {loan.amount.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Loan #{loan.id} • {loan.purpose}
                                </Typography>
                            </Box>
                        </Box>
                        <StatusBadge status={loan.status} />
                    </Box>

                    {/* Details Grid */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Interest Rate</Typography>
                            <Typography fontWeight={600}>{loan.interestRate}%</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Duration</Typography>
                            <Typography fontWeight={600}>{loan.duration}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Monthly Payment</Typography>
                            <Typography fontWeight={600}>KES {loan.monthlyPayment?.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">
                                {loan.status === 'PENDING' ? 'Requested' : loan.dueDate ? 'Due Date' : 'Status'}
                            </Typography>
                            <Typography fontWeight={600}>
                                {loan.status === 'PENDING' ? loan.requestDate : loan.dueDate || loan.approvalDate}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Progress Bar (for active loans) */}
                    {(loan.status === 'ACTIVE' || loan.status === 'APPROVED') && (
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Repayment Progress</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    KES {loan.amountPaid.toLocaleString()} / {totalWithInterest.toLocaleString()}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ height: 10, borderRadius: 5 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {Math.round(progress)}% paid • Remaining: KES {(totalWithInterest - loan.amountPaid).toLocaleString()}
                            </Typography>
                        </Box>
                    )}

                    {/* Rejected Reason */}
                    {loan.status === 'REJECTED' && loan.adminNotes && (
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.light', border: 'none' }}>
                            <Typography variant="body2" color="error.dark">
                                <strong>Reason:</strong> {loan.adminNotes}
                            </Typography>
                        </Paper>
                    )}

                    {/* Payment History (for active loans) */}
                    {loan.paymentHistory?.length > 0 && loan.status !== 'REJECTED' && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Recent Payments
                            </Typography>
                            {loan.paymentHistory.slice(-3).map((payment, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        py: 1,
                                        borderBottom: index < loan.paymentHistory.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        {payment.date}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontWeight={500}>
                                            KES {payment.amount.toLocaleString()}
                                        </Typography>
                                        <Chip
                                            label={payment.status}
                                            size="small"
                                            color={payment.status === 'PAID' ? 'success' : 'warning'}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Actions */}
                    {(loan.status === 'ACTIVE' || loan.status === 'APPROVED') && (
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button variant="contained" startIcon={<Payment />}>
                                Make Payment
                            </Button>
                            <Button variant="outlined">
                                View Details
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    // Summary stats
    const totalBorrowed = loans.filter(l => l.status !== 'REJECTED' && l.status !== 'PENDING')
        .reduce((acc, l) => acc + l.amount, 0);
    const totalRemaining = activeLoans.reduce((acc, l) => {
        const total = l.amount * (1 + l.interestRate / 100);
        return acc + (total - l.amountPaid);
    }, 0);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        My Loans
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track your loan applications and repayments
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/farmer/loan/apply')}
                >
                    Apply for Loan
                </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Total Borrowed</Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            KES {totalBorrowed.toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Outstanding Balance</Typography>
                        <Typography variant="h5" fontWeight="bold" color="secondary.main">
                            KES {Math.round(totalRemaining).toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Active Loans</Typography>
                        <Typography variant="h5" fontWeight="bold">{activeLoans.length}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Credit Score</Typography>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                            {user?.creditScore || 0}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable">
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab.label}
                            label={`${tab.label} (${tab.data.length})`}
                            icon={tab.icon}
                            iconPosition="start"
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Content */}
            {loading ? (
                <Box>
                    {[1, 2].map(i => (
                        <Skeleton key={i} height={250} sx={{ mb: 2, borderRadius: 3 }} />
                    ))}
                </Box>
            ) : displayedLoans.length > 0 ? (
                displayedLoans.map(loan => (
                    <LoanCard key={loan.id} loan={loan} />
                ))
            ) : (
                <EmptyState
                    title={`No ${tabs[tabValue].label.toLowerCase()} loans`}
                    message={tabValue === 0
                        ? "You don't have any active loans. Apply for one to get started."
                        : `No ${tabs[tabValue].label.toLowerCase()} loans to display.`
                    }
                    action={tabValue === 0 ? () => navigate('/farmer/loan/apply') : undefined}
                    actionLabel={tabValue === 0 ? "Apply for Loan" : undefined}
                />
            )}
        </Box>
    );
};

export default Loans;
