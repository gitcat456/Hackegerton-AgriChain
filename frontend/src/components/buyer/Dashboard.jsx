import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardMedia,
    Button,
    Avatar,
    Chip,
    Skeleton
} from '@mui/material';
import {
    ShoppingCart,
    LocalShipping,
    Storefront,
    AccountBalanceWallet,
    TrendingUp,
    ArrowForward,
    Verified,
    Search
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { useCart } from '../../contexts/CartContext';
import { mockApi } from '../../data/mockApi';
import StatCard from '../common/StatCard';
import StatusBadge from '../common/StatusBadge';
import PageBackground from '../layout/PageBackground';

const BuyerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { balance } = useWallet();
    const { items } = useCart();
    const [orders, setOrders] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (user) {
                setLoading(true);
                const [ordersData, productsData] = await Promise.all([
                    mockApi.getBuyerOrders(user.id),
                    mockApi.getMarketplaceListings({ limit: 6 })
                ]);
                setOrders(ordersData);
                setRecentProducts(productsData.slice(0, 6));
                setLoading(false);
            }
        };
        loadDashboardData();
    }, [user]);

    const activeOrders = orders.filter(o => o.status !== 'COMPLETED');
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
    const totalSpent = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    return (
        <PageBackground type="marketplace">
            <Box>
                {/* Welcome Header */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.dark">
                            Welcome back, {user?.businessName || user?.name || 'Buyer'}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            Browse quality produce directly from verified farmers
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Search />}
                        onClick={() => navigate('/marketplace')}
                        sx={{ px: 4, py: 1.5, borderRadius: 2, boxShadow: 4 }}
                    >
                        Browse Market
                    </Button>
                </Paper>

                {/* Stats Row */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard
                            title="Wallet Balance"
                            value={`KES ${balance.toLocaleString()}`}
                            icon={<AccountBalanceWallet />}
                            color="success"
                            loading={loading}
                            action={() => navigate('/buyer/wallet')}
                            actionLabel="Add Funds"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard
                            title="Active Orders"
                            value={activeOrders.length}
                            icon={<LocalShipping />}
                            color="info"
                            loading={loading}
                            action={() => navigate('/buyer/orders')}
                            actionLabel="View Orders"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard
                            title="Cart Items"
                            value={items.length}
                            icon={<ShoppingCart />}
                            color="warning"
                            loading={loading}
                            action={() => navigate('/buyer/cart')}
                            actionLabel="View Cart"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <StatCard
                            title="Total Spent"
                            value={`KES ${totalSpent.toLocaleString()}`}
                            icon={<TrendingUp />}
                            color="secondary"
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }} elevation={2}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.dark">
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        {[
                            { label: 'Browse Marketplace', icon: Storefront, path: '/marketplace' },
                            { label: 'View Cart', icon: ShoppingCart, path: '/buyer/cart' },
                            { label: 'Track Orders', icon: LocalShipping, path: '/buyer/orders' },
                            { label: 'Manage Wallet', icon: AccountBalanceWallet, path: '/buyer/wallet' }
                        ].map((action) => (
                            <Grid size={{ xs: 6, md: 3 }} key={action.label}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<action.icon />}
                                    onClick={() => navigate(action.path)}
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        justifyContent: 'flex-start',
                                        px: 3,
                                        borderWidth: 1.5,
                                        fontWeight: 600,
                                        '&:hover': { borderWidth: 1.5, bgcolor: 'primary.50' }
                                    }}
                                >
                                    {action.label}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                <Grid container spacing={4}>
                    {/* Active Orders */}
                    <Grid size={{ xs: 12, md: activeOrders.length > 0 ? 6 : 12 }}>
                        <Paper sx={{ p: 3, height: '100%', borderRadius: 4 }} elevation={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                                    Active Orders
                                </Typography>
                                {activeOrders.length > 0 && (
                                    <Button
                                        endIcon={<ArrowForward />}
                                        onClick={() => navigate('/buyer/orders')}
                                        sx={{ fontWeight: 600 }}
                                    >
                                        View All
                                    </Button>
                                )}
                            </Box>

                            {loading ? (
                                <Box>
                                    {[1, 2].map(i => (
                                        <Skeleton key={i} height={80} sx={{ mb: 1, borderRadius: 2 }} />
                                    ))}
                                </Box>
                            ) : activeOrders.length > 0 ? (
                                <Box>
                                    {activeOrders.slice(0, 3).map(order => (
                                        <Card key={order.id} variant="outlined" sx={{ mb: 2, borderRadius: 3, borderColor: 'divider' }}>
                                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                                                <Box>
                                                    <Typography fontWeight={700} color="text.primary">{order.productName}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {order.quantity} {order.unit} quantity
                                                    </Typography>
                                                    <Chip
                                                        label={`Del: ${order.estimatedDelivery}`}
                                                        size="small"
                                                        sx={{ mt: 1, fontSize: 10, bgcolor: 'action.hover' }}
                                                    />
                                                </Box>
                                                <Box textAlign="right">
                                                    <Typography fontWeight={800} color="primary.main">
                                                        KES {order.totalAmount?.toLocaleString()}
                                                    </Typography>
                                                    <Box mt={0.5}>
                                                        <StatusBadge status={order.status} size="small" />
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            ) : (
                                <Box textAlign="center" py={4} sx={{ bgcolor: 'background.default', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                                    <LocalShipping sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                    <Typography color="text.secondary" fontWeight={500}>No active orders currently.</Typography>
                                    <Button onClick={() => navigate('/marketplace')} sx={{ mt: 2 }} variant="contained" size="small">
                                        Start Shopping
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Featured Products (Only if active orders exist, otherwise full width handled by grid size logic above? Wait, logic says 'activeOrders.length > 0 ? 6 : 12' for orders, but Featured Products logic is separate) */}
                    {/* Actually, let's always show Featured or Recommended */}
                    {true && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 3, height: '100%', borderRadius: 4 }} elevation={3}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" color="primary.dark">
                                        Featured Products
                                    </Typography>
                                    <Button
                                        endIcon={<ArrowForward />}
                                        onClick={() => navigate('/marketplace')}
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Browse All
                                    </Button>
                                </Box>

                                <Grid container spacing={2}>
                                    {recentProducts.slice(0, 4).map(product => (
                                        <Grid size={{ xs: 6 }} key={product.id}>
                                            <Card
                                                sx={{
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    borderRadius: 3,
                                                    border: '1px solid',
                                                    borderColor: 'transparent',
                                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 4, borderColor: 'primary.light' }
                                                }}
                                                elevation={1}
                                                onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                            >
                                                <Box sx={{ position: 'relative' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="120"
                                                        image={product.images?.[0] || 'https://via.placeholder.com/200'}
                                                        alt={product.productName}
                                                    />
                                                    {product.healthBadge && (
                                                        <Verified
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                color: 'success.main',
                                                                bgcolor: 'white',
                                                                borderRadius: '50%',
                                                                fontSize: 20
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                <CardContent sx={{ p: 1.5 }}>
                                                    <Typography variant="body2" fontWeight={700} noWrap>
                                                        {product.productName}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                                        <Typography variant="body2" color="primary.dark" fontWeight={800}>
                                                            KES {product.pricePerUnit}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            /{product.unit}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                {/* Recommended Products */}
                <Paper sx={{ p: 3, mt: 4, borderRadius: 4 }} elevation={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold" color="primary.dark">
                            Recommended for You
                        </Typography>
                        <Button endIcon={<ArrowForward />} onClick={() => navigate('/marketplace')} sx={{ fontWeight: 600 }}>
                            View All
                        </Button>
                    </Box>

                    {loading ? (
                        <Grid container spacing={2}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={i}>
                                    <Skeleton height={160} sx={{ borderRadius: 2 }} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            {recentProducts.map(product => (
                                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={product.id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            borderRadius: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                        }}
                                        onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                        elevation={1}
                                    >
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="110"
                                                image={product.images?.[0] || 'https://via.placeholder.com/200'}
                                                alt={product.productName}
                                            />
                                            {product.healthBadge && (
                                                <Chip
                                                    icon={<Verified sx={{ fontSize: 12, color: 'white !important' }} />}
                                                    label={`${Math.round(product.healthBadge * 100)}%`}
                                                    color="success"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 6,
                                                        right: 6,
                                                        fontSize: 10,
                                                        height: 20,
                                                        fontWeight: 700,
                                                        boxShadow: 2
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <CardContent sx={{ p: 1.5, flex: 1 }}>
                                            <Typography variant="body2" fontWeight={700} noWrap gutterBottom>
                                                {product.productName}
                                            </Typography>
                                            <Typography variant="body2" color="primary.main" fontWeight={800}>
                                                KES {product.pricePerUnit}/{product.unit}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Box>
        </PageBackground>
    );
};

export default BuyerDashboard;
