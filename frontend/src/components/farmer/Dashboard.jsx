import { useState, useEffect } from 'react';
import {
    Grid,
    Box,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    IconButton,
    Tooltip,
    Skeleton
} from '@mui/material';
import {
    AccountBalanceWallet,
    TrendingUp,
    MonetizationOn,
    Inventory,
    ArrowForward,
    CloudUpload,
    Add,
    Visibility,
    Assessment,
    LocalShipping
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatCard from '../common/StatCard';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import PageBackground from '../layout/PageBackground';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { mockApi } from '../../data/mockApi';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { balance } = useWallet();
    const [loans, setLoans] = useState([]);
    const [listings, setListings] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                try {
                    const [loansData, listingsData, assessmentsData, ordersData] = await Promise.all([
                        mockApi.getLoans(user.id),
                        mockApi.getFarmerListings(user.id),
                        mockApi.getCropAssessments(user.id),
                        mockApi.getFarmerOrders(user.id)
                    ]);
                    setLoans(loansData);
                    setListings(listingsData);
                    setAssessments(assessmentsData);
                    setOrders(ordersData);
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [user]);

    const activeLoans = loans.filter(l => l.status === 'ACTIVE' || l.status === 'APPROVED');
    const pendingLoans = loans.filter(l => l.status === 'PENDING');
    const totalLoanDebt = activeLoans.reduce((acc, l) => acc + (l.amount - l.amountPaid), 0);
    const activeListings = listings.filter(l => l.status === 'ACTIVE');
    const pendingOrders = orders.filter(o => o.status !== 'COMPLETED');

    // Calculate credit score gauge percentage (assuming max 850)
    const creditScorePercentage = ((user?.creditScore || 0) / 850) * 100;

    return (
        <PageBackground type="farmer">
            <Box>
                {/* Header Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.5)'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" color="primary.dark">
                                Welcome back, {user?.name?.split(' ')[0]} 👋
                            </Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                Here's what's happening on your farm today.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                onClick={() => navigate('/farmer/upload-assessment')}
                                sx={{ bgcolor: 'white' }}
                            >
                                Upload Crops
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => navigate('/farmer/listing/create')}
                                sx={{ boxShadow: 2 }}
                            >
                                New Listing
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard
                            title="Wallet Balance"
                            value={`KES ${balance.toLocaleString()}`}
                            icon={<AccountBalanceWallet />}
                            color="success"
                            trend="+12%"
                            subtitle="this month"
                            loading={loading}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Paper sx={{ p: 3, borderRadius: 4, height: '100%', position: 'relative', overflow: 'hidden' }} elevation={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Credit Score
                                    </Typography>
                                    <Typography variant="h4" fontWeight="800" color="text.primary">
                                        {user?.creditScore || 0}
                                    </Typography>
                                    <Chip
                                        label={user?.creditScore >= 750 ? 'Excellent' : user?.creditScore >= 650 ? 'Good' : 'Fair'}
                                        color={user?.creditScore >= 750 ? 'success' : user?.creditScore >= 650 ? 'warning' : 'error'}
                                        size="small"
                                        sx={{ mt: 1, fontWeight: 700 }}
                                    />
                                </Box>
                                <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            bgcolor: 'success.light',
                                            color: 'success.main',
                                            borderRadius: 3
                                        }}
                                    >
                                        <TrendingUp fontSize="large" />
                                    </Avatar>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard
                            title="Active Loans"
                            value={activeLoans.length}
                            icon={<MonetizationOn />}
                            color="warning"
                            subtitle={pendingLoans.length > 0 ? `${pendingLoans.length} pending` : 'No pending'}
                            loading={loading}
                            onClick={() => navigate('/farmer/loans')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <StatCard
                            title="Active Listings"
                            value={activeListings.length}
                            icon={<Inventory />}
                            color="info"
                            subtitle={`${listings.filter(l => l.status === 'SOLD').length} sold`}
                            loading={loading}
                            onClick={() => navigate('/farmer/listings')}
                        />
                    </Grid>
                </Grid>

                {/* Quick Actions Card */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }} elevation={2}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.dark">
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        {[
                            { label: 'Upload Crops', icon: CloudUpload, path: '/farmer/upload-assessment', color: 'primary' },
                            { label: 'Apply for Loan', icon: MonetizationOn, path: '/farmer/loan/apply', color: 'secondary' },
                            { label: 'Create Listing', icon: Inventory, path: '/farmer/listing/create', color: 'info' },
                            { label: 'View Marketplace', icon: Visibility, path: '/marketplace', color: 'success' }
                        ].map((action) => (
                            <Grid size={{ xs: 6, sm: 3 }} key={action.label}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        p: 3,
                                        transition: 'all 0.3s',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            bgcolor: `${action.color}.main`,
                                            color: 'white',
                                            transform: 'translateY(-5px)',
                                            boxShadow: 4,
                                            borderColor: 'transparent'
                                        }
                                    }}
                                    onClick={() => navigate(action.path)}
                                    elevation={0}
                                >
                                    <action.icon sx={{ fontSize: 40, color: 'inherit', mb: 2 }} />
                                    <Typography variant="subtitle2" fontWeight={700}>{action.label}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Main Content Grid */}
                <Grid container spacing={3}>
                    {/* Active Loans */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }} elevation={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Active Loans</Typography>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/farmer/loans')}
                                    sx={{ fontWeight: 600 }}
                                >
                                    View All
                                </Button>
                            </Box>

                            {loading ? (
                                <Box sx={{ py: 2 }}>
                                    {[1, 2].map(i => (
                                        <Skeleton key={i} height={80} sx={{ mb: 1, borderRadius: 2 }} />
                                    ))}
                                </Box>
                            ) : activeLoans.length > 0 ? (
                                <List disablePadding>
                                    {activeLoans.slice(0, 3).map((loan, index) => {
                                        const progress = (loan.amountPaid / (loan.amount * (1 + loan.interestRate / 100))) * 100;
                                        return (
                                            <Box key={loan.id} sx={{ mb: 2 }}>
                                                <ListItem
                                                    alignItems="flex-start"
                                                    sx={{
                                                        px: 2,
                                                        py: 1.5,
                                                        bgcolor: 'background.default',
                                                        borderRadius: 3,
                                                        border: '1px solid',
                                                        borderColor: 'divider'
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar variant="rounded" sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                                                            <MonetizationOn />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                                <Typography fontWeight={700} color="text.primary">
                                                                    KES {loan.amount.toLocaleString()}
                                                                </Typography>
                                                                <StatusBadge status={loan.status} size="small" />
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box sx={{ width: '100%' }}>
                                                                <Typography variant="body2" color="text.secondary" gutterBottom fontSize="0.8rem">
                                                                    Due: {loan.dueDate || 'Pending'} • {loan.duration}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={progress}
                                                                        color="secondary"
                                                                        sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'secondary.main', opacity: 0.1 }}
                                                                    />
                                                                    <Typography variant="caption" fontWeight={700} color="text.primary">
                                                                        {Math.round(progress)}% Paid
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                            </Box>
                                        );
                                    })}
                                </List>
                            ) : (
                                <EmptyState
                                    title="No active loans"
                                    message="You don't have any active loans. Apply for one to get started."
                                    action={() => navigate('/farmer/loan/apply')}
                                    actionLabel="Apply Now"
                                />
                            )}
                        </Paper>
                    </Grid>

                    {/* Recent Listings */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }} elevation={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">My Listings</Typography>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/farmer/listings')}
                                    sx={{ fontWeight: 600 }}
                                >
                                    Manage
                                </Button>
                            </Box>

                            {loading ? (
                                <Box sx={{ py: 2 }}>
                                    {[1, 2].map(i => (
                                        <Skeleton key={i} height={80} sx={{ mb: 1, borderRadius: 2 }} />
                                    ))}
                                </Box>
                            ) : listings.length > 0 ? (
                                <List disablePadding>
                                    {listings.slice(0, 3).map((listing) => (
                                        <Box key={listing.id} sx={{ mb: 2 }}>
                                            <ListItem
                                                alignItems="center"
                                                sx={{
                                                    px: 2,
                                                    py: 1.5,
                                                    bgcolor: 'background.default',
                                                    borderRadius: 3,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'scale(1.02)' }
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={listing.images?.[0]}
                                                        variant="rounded"
                                                        sx={{ width: 56, height: 56, borderRadius: 2 }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography fontWeight={700} noWrap>
                                                            {listing.productName}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body2" color="text.secondary">
                                                            {listing.quantity} {listing.unit} • <span style={{ fontWeight: 600, color: 'var(--primary-green)' }}>KES {listing.pricePerUnit}/{listing.unit}</span>
                                                        </Typography>
                                                    }
                                                />
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="subtitle1" fontWeight={800} color="primary.dark">
                                                        KES {listing.totalPrice?.toLocaleString()}
                                                    </Typography>
                                                    <StatusBadge status={listing.status} size="small" />
                                                </Box>
                                            </ListItem>
                                        </Box>
                                    ))}
                                </List>
                            ) : (
                                <EmptyState
                                    title="No listings yet"
                                    message="Create your first listing to start selling."
                                    variant="listings"
                                    action={() => navigate('/farmer/listing/create')}
                                    actionLabel="Create Listing"
                                />
                            )}
                        </Paper>
                    </Grid>

                    {/* Recent Assessments */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: 4 }} elevation={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">Recent Assessments</Typography>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/farmer/assessments')}
                                    sx={{ fontWeight: 600 }}
                                >
                                    View All
                                </Button>
                            </Box>

                            {assessments.length > 0 ? (
                                <Grid container spacing={2}>
                                    {assessments.slice(0, 3).map((assessment) => (
                                        <Grid size={{ xs: 12 }} key={assessment.id}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: 3,
                                                    transition: 'all 0.2s',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }
                                                }}
                                                onClick={() => navigate(`/farmer/assessment/${assessment.id}`)}
                                            >
                                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
                                                    <Avatar variant="rounded" sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                                                        <Assessment />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                                            {assessment.cropType}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {assessment.areaCovered} • {assessment.assessmentDate}
                                                        </Typography>
                                                    </Box>
                                                    <Box textAlign="right">
                                                        <Chip
                                                            label={`${Math.round(assessment.healthScore * 100)}%`}
                                                            color={assessment.healthScore >= 0.8 ? 'success' : assessment.healthScore >= 0.6 ? 'warning' : 'error'}
                                                            size="small"
                                                            sx={{ fontWeight: 700 }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <EmptyState
                                    title="No assessments"
                                    message="Upload crop photos to get AI assessments."
                                    action={() => navigate('/farmer/upload-assessment')}
                                    actionLabel="Upload Crops"
                                />
                            )}
                        </Paper>
                    </Grid>

                    {/* Pending Orders */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 3, borderRadius: 4 }} elevation={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">Orders Received</Typography>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/farmer/orders')}
                                    sx={{ fontWeight: 600 }}
                                >
                                    View All
                                </Button>
                            </Box>

                            {pendingOrders.length > 0 ? (
                                <List disablePadding>
                                    {pendingOrders.slice(0, 3).map((order) => (
                                        <Box key={order.id} sx={{ mb: 2 }}>
                                            <ListItem
                                                alignItems="flex-start"
                                                sx={{
                                                    px: 2,
                                                    py: 1.5,
                                                    bgcolor: 'background.default',
                                                    borderRadius: 3,
                                                    border: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar variant="rounded" sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                                                        <LocalShipping />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                            <Typography fontWeight={700}>
                                                                {order.productName}
                                                            </Typography>
                                                            <StatusBadge status={order.status} size="small" />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {order.quantity} {order.unit} • {order.buyerName}
                                                            </Typography>
                                                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography fontWeight={700} color="primary.main">
                                                                    KES {order.totalAmount?.toLocaleString()}
                                                                </Typography>
                                                                <StatusBadge status={order.escrowStatus} size="small" />
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        </Box>
                                    ))}
                                </List>
                            ) : (
                                <EmptyState
                                    title="No pending orders"
                                    message="Orders from buyers will appear here."
                                    variant="orders"
                                />
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </PageBackground>
    );
};

export default Dashboard;
