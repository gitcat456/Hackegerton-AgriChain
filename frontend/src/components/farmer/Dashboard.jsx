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

                {/* ── Transparent Navbar-style Header ── */}
                <Box
                    sx={{
                        mb: 5,
                        px: 3,
                        py: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        backdropFilter: 'blur(18px)',
                        bgcolor: 'rgba(255,255,255,0.08)',
                        borderBottom: '1px solid rgba(255,255,255,0.22)',
                        boxShadow: '0 6px 28px rgba(0,0,0,0.18)',
                        borderRadius: 2,
                    }}
                >
                    {/* Left: badge + greeting */}
                    <Box>
                        <Chip
                            label={`Verified Farmer • ${user?.location || 'Kenya'}`}
                            size="small"
                            sx={{
                                mb: 0.75,
                                bgcolor: 'rgba(255,255,255,0.18)',
                                color: 'white',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                fontWeight: 600,
                            }}
                        />
                        <Typography
                            variant="h5"
                            fontWeight={800}
                            color="white"
                            sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.25)', lineHeight: 1.2 }}
                        >
                            Welcome back, {user?.name?.split(' ')[0]}
                        </Typography>
                    </Box>

                    {/* Right: action buttons */}
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
                                    borderColor: 'white',
                                },
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
                                fontWeight: 700,
                            }}
                        >
                            New Listing
                        </Button>
                    </Box>
                </Box>

                {/* ── Overview Stats – 3D Floating Container ── */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 5,
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.97)',
                        boxShadow:
                            '0 2px 0 rgba(255,255,255,0.6) inset, 0 16px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.10)',
                        border: '1px solid rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(24px)',
                    }}
                >
                    {/* Section header */}
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'rgba(0,0,0,0.015)',
                        }}
                    >
                        <Typography variant="h6" fontWeight={800} color="text.primary">
                            Overview
                        </Typography>
                    </Box>

                    {/* Stats as vertical rows */}
                    {loading ? (
                        <Box sx={{ p: 3 }}>
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} height={72} sx={{ mb: 1.5, borderRadius: 2 }} />
                            ))}
                        </Box>
                    ) : (
                        <Box>
                            {/* Row 1 – Total Revenue */}
                            <Box
                                sx={{
                                    px: 3,
                                    py: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                        color: 'success.main',
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    <AccountBalanceWallet />
                                </Avatar>
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 0, sm: 2 } }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, minWidth: 110 }}>
                                        Total Revenue
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ lineHeight: 1 }}>
                                        KES {balance.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, ml: { xs: 0, sm: 'auto' } }}>
                                        +12% vs last month
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Row 2 – Credit Score */}
                            <Box
                                sx={{
                                    px: 3,
                                    py: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        bgcolor: alpha(
                                            (user?.creditScore >= 700 ? theme.palette.success : theme.palette.warning).main,
                                            0.1
                                        ),
                                        color: user?.creditScore >= 700 ? 'success.main' : 'warning.main',
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    <TrendingUp />
                                </Avatar>
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 0, sm: 2 } }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, minWidth: 110 }}>
                                        Credit Score
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ lineHeight: 1 }}>
                                        {user?.creditScore || 720}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: { xs: 0, sm: 'auto' } }}>
                                        Excellent Standing
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Row 3 – Active Loans */}
                            <Box
                                onClick={() => navigate('/farmer/loans')}
                                sx={{
                                    px: 3,
                                    py: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                                }}
                            >
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                        color: 'warning.main',
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    <MonetizationOn />
                                </Avatar>
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 0, sm: 2 } }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, minWidth: 110 }}>
                                        Active Loans
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ lineHeight: 1 }}>
                                        {activeLoans.length}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: { xs: 0, sm: 'auto' } }}>
                                        {pendingLoans.length > 0 ? `${pendingLoans.length} pending approval` : 'No pending loans'}
                                    </Typography>
                                </Box>
                                <Button size="small" endIcon={<ArrowForward />} sx={{ flexShrink: 0 }}>
                                    View Details
                                </Button>
                            </Box>

                            {/* Row 4 – Active Listings */}
                            <Box
                                onClick={() => navigate('/farmer/listings')}
                                sx={{
                                    px: 3,
                                    py: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2.5,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                                }}
                            >
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: 'info.main',
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    <Inventory />
                                </Avatar>
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 0, sm: 2 } }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, minWidth: 110 }}>
                                        Active Listings
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ lineHeight: 1 }}>
                                        {activeListings.length}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: { xs: 0, sm: 'auto' } }}>
                                        {listings.filter(l => l.status === 'SOLD').length} completed sales
                                    </Typography>
                                </Box>
                                <Button size="small" endIcon={<ArrowForward />} sx={{ flexShrink: 0 }}>
                                    Manage Stock
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>

                {/* ── Main Content Areas – always a single vertical column ── */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                    {/* Quick Actions */}
                    <Paper
                        className="glass-card"
                        elevation={0}
                        sx={{ borderRadius: 3, overflow: 'hidden' }}
                    >
                        {/* Panel header */}
                        <Box
                            sx={{
                                px: 3,
                                py: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'rgba(0,0,0,0.015)',
                            }}
                        >
                            <Typography variant="h6" fontWeight={800} color="primary.dark">
                                Quick Actions
                            </Typography>
                        </Box>

                        {/* Each action: stacked on mobile, one full horizontal line on lg+ */}
                        {[
                            {
                                label: 'Upload Crops',
                                desc: 'Get AI health assessment',
                                icon: CloudUpload,
                                path: '/farmer/upload-assessment',
                                color: theme.palette.primary.main,
                            },
                            {
                                label: 'Apply for Loan',
                                desc: 'Instant credit check',
                                icon: MonetizationOn,
                                path: '/farmer/loan/apply',
                                color: theme.palette.secondary.dark,
                            },
                            {
                                label: 'Create Listing',
                                desc: 'Sell your produce',
                                icon: Inventory,
                                path: '/farmer/listing/create',
                                color: theme.palette.info.main,
                            },
                            {
                                label: 'Marketplace',
                                desc: 'View current prices',
                                icon: Visibility,
                                path: '/marketplace',
                                color: theme.palette.success.main,
                            },
                        ].map((action, idx, arr) => (
                            <Box
                                key={action.label}
                                className="hover-lift"
                                onClick={() => navigate(action.path)}
                                sx={{
                                    px: 3,
                                    py: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    cursor: 'pointer',
                                    borderBottom: idx < arr.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: alpha(action.color, 0.04),
                                        '& .qa-arrow': { transform: 'translateX(4px)', color: action.color },
                                        '& .qa-icon': { bgcolor: alpha(action.color, 0.18) },
                                    },
                                }}
                            >
                                <Avatar
                                    className="qa-icon"
                                    variant="rounded"
                                    sx={{
                                        bgcolor: alpha(action.color, 0.1),
                                        color: action.color,
                                        width: 44,
                                        height: 44,
                                        borderRadius: 1,
                                        transition: 'background 0.2s',
                                        flexShrink: 0,
                                    }}
                                >
                                    <action.icon fontSize="small" />
                                </Avatar>

                                {/* On mobile: label stacked above desc. On lg+: label | desc side by side */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        gap: { xs: 0, sm: 1.5 },
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={700}
                                        color="text.primary"
                                        sx={{ flexShrink: 0 }}
                                    >
                                        {action.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                        {action.desc}
                                    </Typography>
                                </Box>

                                <ArrowForward
                                    className="qa-arrow"
                                    sx={{
                                        color: 'text.disabled',
                                        fontSize: 18,
                                        transition: 'transform 0.2s, color 0.2s',
                                        flexShrink: 0,
                                    }}
                                />
                            </Box>
                        ))}
                    </Paper>

                    {/* ── Active Loans ── */}
                    <Box>
                        <Paper
                            className="glass-card"
                            sx={{ p: 0, borderRadius: 4, height: '100%', overflow: 'hidden' }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
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
                                        const progress =
                                            (loan.amountPaid /
                                                (loan.amount * (1 + loan.interestRate / 100))) *
                                            100;
                                        return (
                                            <ListItem
                                                key={loan.id}
                                                disableGutters
                                                sx={{
                                                    p: 2,
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:last-child': { borderBottom: 'none' },
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}
                                                    >
                                                        <MonetizationOn />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            <Typography fontWeight={700}>
                                                                KES {loan.amount.toLocaleString()}
                                                            </Typography>
                                                            <StatusBadge status={loan.status} size="small" />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    mb: 1,
                                                                }}
                                                            >
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Due {loan.dueDate}
                                                                </Typography>
                                                                <Typography
                                                                    variant="caption"
                                                                    fontWeight={600}
                                                                    color="text.primary"
                                                                >
                                                                    {Math.round(progress)}% Paid
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={progress}
                                                                color="warning"
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                                }}
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
                    </Box>

                    {/* ── Recent Listings ── */}
                    <Box>
                        <Paper
                            className="glass-card"
                            sx={{ p: 0, borderRadius: 4, height: '100%', overflow: 'hidden' }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="h6" fontWeight={800} color="text.primary">
                                    Recent Listings
                                </Typography>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/farmer/listings')}
                                >
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
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
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
                                                        border: '1px solid rgba(0,0,0,0.1)',
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
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            display="block"
                                                        >
                                                            {listing.quantity} {listing.unit} •{' '}
                                                            <span
                                                                style={{
                                                                    color: theme.palette.success.main,
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                KES {listing.pricePerUnit}
                                                            </span>
                                                            /{listing.unit}
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
                    </Box>

                </Box> {/* end flex column */}
            </Box>
        </PageBackground>
    );
};

export default Dashboard;