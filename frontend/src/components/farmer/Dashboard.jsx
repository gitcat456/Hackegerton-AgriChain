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
    Card,
    CardContent,
    LinearProgress,
    Chip,
    Skeleton,
    alpha,
    useTheme,
    IconButton
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
    LocalShipping,
    MoreVert
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
    const theme = useTheme();
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
    const activeListings = listings.filter(l => l.status === 'ACTIVE');
    const pendingOrders = orders.filter(o => o.status !== 'COMPLETED');

    return (
        <PageBackground type="farmer">
            <Box className="animate-fade-in-up">
                {/* Header Section */}
                <Box sx={{
                    mb: 5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                    gap: 3
                }}>
                    <Box>
                        <Chip
                            label={`Verified Farmer • ${user?.location || 'Kenya'}`}
                            size="small"
                            sx={{
                                mb: 1.5,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                fontWeight: 600
                            }}
                        />
                        <Typography variant="h3" fontWeight={800} color="white" sx={{ textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            Overview
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                            Welcome back, {user?.name?.split(' ')[0]}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            onClick={() => navigate('/farmer/upload-assessment')}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    borderColor: 'white'
                                }
                            }}
                        >
                            Upload Crops
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Add />}
                            onClick={() => navigate('/farmer/listing/create')}
                            sx={{
                                boxShadow: '0 4px 14px rgba(255, 215, 0, 0.4)',
                                color: 'primary.dark',
                                fontWeight: 700
                            }}
                        >
                            New Listing
                        </Button>
                    </Box>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Total Revenue"
                            value={`KES ${balance.toLocaleString()}`}
                            icon={<AccountBalanceWallet />}
                            color="success"
                            trend="+12%"
                            trendLabel="vs last month"
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Credit Score"
                            value={user?.creditScore || 720}
                            icon={<TrendingUp />}
                            color={user?.creditScore >= 700 ? 'success' : 'warning'}
                            subtitle="Excellent Standing"
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Active Loans"
                            value={activeLoans.length}
                            icon={<MonetizationOn />}
                            color="warning"
                            subtitle={pendingLoans.length > 0 ? `${pendingLoans.length} pending approval` : 'No pending loans'}
                            loading={loading}
                            onClick={() => navigate('/farmer/loans')}
                            actionLabel="View Details"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Active Listings"
                            value={activeListings.length}
                            icon={<Inventory />}
                            color="info"
                            subtitle={`${listings.filter(l => l.status === 'SOLD').length} completed sales`}
                            loading={loading}
                            onClick={() => navigate('/farmer/listings')}
                            actionLabel="Manage Stock"
                        />
                    </Grid>
                </Grid>

                {/* Main Content Areas */}
                <Grid container spacing={4}>
                    {/* Quick Actions Panel */}
                    <Grid item xs={12}>
                        <Paper className="glass-card" sx={{ p: 4, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom color="primary.dark" sx={{ mb: 3 }}>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { label: 'Upload Crops', desc: 'Get AI health assessment', icon: CloudUpload, path: '/farmer/upload-assessment', color: theme.palette.primary.main, bg: theme.palette.primary.light },
                                    { label: 'Apply for Loan', desc: 'Instant credit check', icon: MonetizationOn, path: '/farmer/loan/apply', color: theme.palette.secondary.dark, bg: theme.palette.secondary.main },
                                    { label: 'Create Listing', desc: 'Sell your produce', icon: Inventory, path: '/farmer/listing/create', color: theme.palette.info.main, bg: theme.palette.info.light },
                                    { label: 'Marketplace', desc: 'View current prices', icon: Visibility, path: '/marketplace', color: theme.palette.success.main, bg: theme.palette.success.light }
                                ].map((action) => (
                                    <Grid item xs={12} sm={6} md={3} key={action.label}>
                                        <Card
                                            className="hover-lift"
                                            elevation={0}
                                            sx={{
                                                cursor: 'pointer',
                                                p: 2,
                                                height: '100%',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: action.color,
                                                    bgcolor: alpha(action.color, 0.04)
                                                }
                                            }}
                                            onClick={() => navigate(action.path)}
                                        >
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    bgcolor: alpha(action.color, 0.1),
                                                    color: action.color,
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 2.5
                                                }}
                                            >
                                                <action.icon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                                    {action.label}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                    {action.desc}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Active Loans & Listings Split */}
                    <Grid item xs={12} md={6}>
                        <Paper className="glass-card" sx={{ p: 0, borderRadius: 4, height: '100%', overflow: 'hidden' }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight={800} color="text.primary">
                                    Active Loans
                                </Typography>
                                <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/farmer/loans')}>
                                    View All
                                </Button>
                            </Box>

                            {loading ? (
                                <Box sx={{ p: 3 }}>
                                    <Skeleton height={60} sx={{ mb: 2, borderRadius: 2 }} />
                                    <Skeleton height={60} sx={{ borderRadius: 2 }} />
                                </Box>
                            ) : activeLoans.length > 0 ? (
                                <List sx={{ px: 2 }}>
                                    {activeLoans.slice(0, 3).map((loan) => {
                                        const progress = (loan.amountPaid / (loan.amount * (1 + loan.interestRate / 100))) * 100;
                                        return (
                                            <ListItem
                                                key={loan.id}
                                                disableGutters
                                                sx={{
                                                    p: 2,
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:last-child': { borderBottom: 'none' }
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar variant="rounded" sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                                                        <MonetizationOn />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                            <Typography fontWeight={700}>KES {loan.amount.toLocaleString()}</Typography>
                                                            <StatusBadge status={loan.status} size="small" />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                <Typography variant="caption" color="text.secondary">Due {loan.dueDate}</Typography>
                                                                <Typography variant="caption" fontWeight={600} color="text.primary">{Math.round(progress)}% Paid</Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={progress}
                                                                color="warning"
                                                                sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.1) }}
                                                            />
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            ) : (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <EmptyState
                                        title="No active loans"
                                        message="You don't have any active loans."
                                        action={() => navigate('/farmer/loan/apply')}
                                        actionLabel="Apply Now"
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper className="glass-card" sx={{ p: 0, borderRadius: 4, height: '100%', overflow: 'hidden' }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight={800} color="text.primary">
                                    Recent Listings
                                </Typography>
                                <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate('/farmer/listings')}>
                                    View All
                                </Button>
                            </Box>

                            {loading ? (
                                <Box sx={{ p: 3 }}>
                                    <Skeleton height={60} sx={{ mb: 2, borderRadius: 2 }} />
                                    <Skeleton height={60} sx={{ borderRadius: 2 }} />
                                </Box>
                            ) : listings.length > 0 ? (
                                <List sx={{ px: 2 }}>
                                    {listings.slice(0, 3).map((listing) => (
                                        <ListItem
                                            key={listing.id}
                                            disableGutters
                                            sx={{
                                                p: 2,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                '&:last-child': { borderBottom: 'none' },
                                                transition: 'bgcolor 0.2s',
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                                            }}
                                            secondaryAction={
                                                <IconButton size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={listing.images?.[0]}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        borderRadius: 2,
                                                        border: '1px solid rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography fontWeight={700} noWrap sx={{ maxWidth: 200 }}>
                                                        {listing.productName}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            {listing.quantity} {listing.unit} • <span style={{ color: theme.palette.success.main, fontWeight: 700 }}>KES {listing.pricePerUnit}</span>/{listing.unit}
                                                        </Typography>
                                                        <Box sx={{ mt: 0.5 }}>
                                                            <StatusBadge status={listing.status} size="small" />
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ p: 4 }}>
                                    <EmptyState
                                        title="No listings yet"
                                        message="Create your first listing to start selling."
                                        action={() => navigate('/farmer/listing/create')}
                                        actionLabel="Create Listing"
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </PageBackground>
    );
};

export default Dashboard;
