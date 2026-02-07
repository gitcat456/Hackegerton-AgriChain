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
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Welcome back, {user?.name?.split(' ')[0]} 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening on your farm today.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        onClick={() => navigate('/farmer/upload-assessment')}
                    >
                        Upload Crops
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/farmer/listing/create')}
                    >
                        New Listing
                    </Button>
                </Box>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard
                        title="Wallet Balance"
                        value={`KES ${balance.toLocaleString()}`}
                        icon={<AccountBalanceWallet />}
                        color="secondary"
                        trend="+12%"
                        subtitle="this month"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
                                    Credit Score
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {user?.creditScore || 0}
                                </Typography>
                                <Chip
                                    label={user?.creditScore >= 750 ? 'Excellent' : user?.creditScore >= 650 ? 'Good' : 'Fair'}
                                    color={user?.creditScore >= 750 ? 'success' : user?.creditScore >= 650 ? 'warning' : 'error'}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    bgcolor: 'success.light',
                                    position: 'relative',
                                }}
                            >
                                <TrendingUp sx={{ color: 'success.main' }} />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '50%',
                                        border: '4px solid',
                                        borderColor: 'success.main',
                                        clipPath: `polygon(0 0, 100% 0, 100% ${100 - creditScorePercentage}%, 0 ${100 - creditScorePercentage}%)`,
                                        opacity: 0.3,
                                    }}
                                />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
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
                <Grid item xs={12} sm={6} lg={3}>
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

            {/* Quick Actions */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                p: 2,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'primary.light', color: 'white', transform: 'translateY(-4px)' }
                            }}
                            onClick={() => navigate('/farmer/upload-assessment')}
                        >
                            <CloudUpload sx={{ fontSize: 40, color: 'inherit', mb: 1 }} />
                            <Typography variant="body2" fontWeight={500}>Upload Crops</Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                p: 2,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'secondary.light', color: 'white', transform: 'translateY(-4px)' }
                            }}
                            onClick={() => navigate('/farmer/loan/apply')}
                        >
                            <MonetizationOn sx={{ fontSize: 40, color: 'inherit', mb: 1 }} />
                            <Typography variant="body2" fontWeight={500}>Apply for Loan</Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                p: 2,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'info.light', color: 'white', transform: 'translateY(-4px)' }
                            }}
                            onClick={() => navigate('/farmer/listing/create')}
                        >
                            <Inventory sx={{ fontSize: 40, color: 'inherit', mb: 1 }} />
                            <Typography variant="body2" fontWeight={500}>Create Listing</Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                p: 2,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'success.light', color: 'white', transform: 'translateY(-4px)' }
                            }}
                            onClick={() => navigate('/marketplace')}
                        >
                            <Visibility sx={{ fontSize: 40, color: 'inherit', mb: 1 }} />
                            <Typography variant="body2" fontWeight={500}>View Marketplace</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Active Loans */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">Active Loans</Typography>
                            <Button
                                size="small"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/farmer/loans')}
                            >
                                View All
                            </Button>
                        </Box>

                        {loading ? (
                            <Box sx={{ py: 2 }}>
                                {[1, 2].map(i => (
                                    <Skeleton key={i} height={80} sx={{ mb: 1 }} />
                                ))}
                            </Box>
                        ) : activeLoans.length > 0 ? (
                            <List disablePadding>
                                {activeLoans.slice(0, 3).map((loan, index) => {
                                    const progress = (loan.amountPaid / (loan.amount * (1 + loan.interestRate / 100))) * 100;
                                    return (
                                        <Box key={loan.id}>
                                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
                                                        <MonetizationOn />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography fontWeight={600}>
                                                                KES {loan.amount.toLocaleString()}
                                                            </Typography>
                                                            <StatusBadge status={loan.status} size="small" />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box sx={{ mt: 1 }}>
                                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                Due: {loan.dueDate || 'Pending'} • {loan.duration}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={progress}
                                                                    sx={{ flex: 1, height: 6, borderRadius: 3 }}
                                                                />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {Math.round(progress)}%
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            {index < activeLoans.length - 1 && <Divider sx={{ my: 1 }} />}
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
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">My Listings</Typography>
                            <Button
                                size="small"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/farmer/listings')}
                            >
                                Manage
                            </Button>
                        </Box>

                        {loading ? (
                            <Box sx={{ py: 2 }}>
                                {[1, 2].map(i => (
                                    <Skeleton key={i} height={80} sx={{ mb: 1 }} />
                                ))}
                            </Box>
                        ) : listings.length > 0 ? (
                            <List disablePadding>
                                {listings.slice(0, 3).map((listing, index) => (
                                    <Box key={listing.id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={listing.images?.[0]}
                                                    variant="rounded"
                                                    sx={{ width: 56, height: 56 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography fontWeight={600} noWrap sx={{ maxWidth: 150 }}>
                                                            {listing.productName}
                                                        </Typography>
                                                        <StatusBadge status={listing.status} size="small" />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {listing.quantity} {listing.unit} • KES {listing.pricePerUnit}/{listing.unit}
                                                    </Typography>
                                                }
                                                sx={{ ml: 1 }}
                                            />
                                            <Typography variant="subtitle1" fontWeight={600} color="primary">
                                                KES {listing.totalPrice?.toLocaleString()}
                                            </Typography>
                                        </ListItem>
                                        {index < listings.length - 1 && <Divider sx={{ my: 1 }} />}
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
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">Recent Assessments</Typography>
                            <Button
                                size="small"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/farmer/assessments')}
                            >
                                View All
                            </Button>
                        </Box>

                        {assessments.length > 0 ? (
                            <Grid container spacing={2}>
                                {assessments.slice(0, 3).map((assessment) => (
                                    <Grid item xs={12} key={assessment.id}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                                            }}
                                            onClick={() => navigate(`/farmer/assessment/${assessment.id}`)}
                                        >
                                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
                                                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                                                    <Assessment />
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography fontWeight={600} sx={{ textTransform: 'capitalize' }}>
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
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">Orders Received</Typography>
                            <Button
                                size="small"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/farmer/orders')}
                            >
                                View All
                            </Button>
                        </Box>

                        {pendingOrders.length > 0 ? (
                            <List disablePadding>
                                {pendingOrders.slice(0, 3).map((order, index) => (
                                    <Box key={order.id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                                                    <LocalShipping />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography fontWeight={600}>
                                                            {order.productName}
                                                        </Typography>
                                                        <StatusBadge status={order.status} size="small" />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {order.quantity} {order.unit} • Buyer: {order.buyerName}
                                                    </Typography>
                                                }
                                            />
                                            <Box textAlign="right">
                                                <Typography fontWeight={600} color="primary">
                                                    KES {order.totalAmount?.toLocaleString()}
                                                </Typography>
                                                <StatusBadge status={order.escrowStatus} size="small" />
                                            </Box>
                                        </ListItem>
                                        {index < pendingOrders.length - 1 && <Divider sx={{ my: 1 }} />}
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
    );
};

export default Dashboard;
