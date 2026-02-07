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
    Verified
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { useCart } from '../../contexts/CartContext';
import { mockApi } from '../../data/mockApi';
import StatCard from '../common/StatCard';
import StatusBadge from '../common/StatusBadge';

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
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome back, {user?.businessName || user?.name || 'Buyer'}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Browse quality produce directly from verified farmers
                </Typography>
            </Box>

            {/* Stats Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                    <StatCard
                        title="Wallet Balance"
                        value={`KES ${balance.toLocaleString()}`}
                        icon={<AccountBalanceWallet />}
                        color="primary"
                        loading={loading}
                        action={() => navigate('/buyer/wallet')}
                        actionLabel="Add Funds"
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard
                        title="Active Orders"
                        value={activeOrders.length}
                        icon={<LocalShipping />}
                        color="secondary"
                        loading={loading}
                        action={() => navigate('/buyer/orders')}
                        actionLabel="View Orders"
                    />
                </Grid>
                <Grid item xs={6} md={3}>
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
                <Grid item xs={6} md={3}>
                    <StatCard
                        title="Total Spent"
                        value={`KES ${totalSpent.toLocaleString()}`}
                        icon={<TrendingUp />}
                        color="success"
                        loading={loading}
                    />
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Storefront />}
                            onClick={() => navigate('/marketplace')}
                            sx={{ py: 2 }}
                        >
                            Browse Marketplace
                        </Button>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<ShoppingCart />}
                            onClick={() => navigate('/buyer/cart')}
                            sx={{ py: 2 }}
                        >
                            View Cart ({items.length})
                        </Button>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<LocalShipping />}
                            onClick={() => navigate('/buyer/orders')}
                            sx={{ py: 2 }}
                        >
                            Track Orders
                        </Button>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<AccountBalanceWallet />}
                            onClick={() => navigate('/buyer/wallet')}
                            sx={{ py: 2 }}
                        >
                            Manage Wallet
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={4}>
                {/* Active Orders */}
                <Grid item xs={12} md={activeOrders.length > 0 ? 6 : 12}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Active Orders
                            </Typography>
                            {activeOrders.length > 0 && (
                                <Button
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/buyer/orders')}
                                >
                                    View All
                                </Button>
                            )}
                        </Box>

                        {loading ? (
                            <Box>
                                {[1, 2].map(i => (
                                    <Skeleton key={i} height={80} sx={{ mb: 1 }} />
                                ))}
                            </Box>
                        ) : activeOrders.length > 0 ? (
                            <Box>
                                {activeOrders.slice(0, 3).map(order => (
                                    <Card key={order.id} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                                            <Box>
                                                <Typography fontWeight={600}>{order.productName}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {order.quantity} {order.unit} • Est. delivery: {order.estimatedDelivery}
                                                </Typography>
                                            </Box>
                                            <Box textAlign="right">
                                                <Typography fontWeight={600} color="primary">
                                                    KES {order.totalAmount?.toLocaleString()}
                                                </Typography>
                                                <StatusBadge status={order.status} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        ) : (
                            <Box textAlign="center" py={4}>
                                <LocalShipping sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                <Typography color="text.secondary">No active orders</Typography>
                                <Button onClick={() => navigate('/marketplace')} sx={{ mt: 2 }}>
                                    Start Shopping
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Featured Products */}
                {activeOrders.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Featured Products
                                </Typography>
                                <Button
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/marketplace')}
                                >
                                    Browse All
                                </Button>
                            </Box>

                            <Grid container spacing={2}>
                                {recentProducts.slice(0, 4).map(product => (
                                    <Grid item xs={6} key={product.id}>
                                        <Card
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                                            }}
                                            onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="100"
                                                image={product.images?.[0] || 'https://via.placeholder.com/200'}
                                                alt={product.productName}
                                            />
                                            <CardContent sx={{ p: 1.5 }}>
                                                <Typography variant="body2" fontWeight={600} noWrap>
                                                    {product.productName}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" color="primary" fontWeight={600}>
                                                        KES {product.pricePerUnit}/{product.unit}
                                                    </Typography>
                                                    {product.healthBadge && (
                                                        <Verified sx={{ fontSize: 16, color: 'success.main' }} />
                                                    )}
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
            <Paper sx={{ p: 3, mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Recommended for You
                    </Typography>
                    <Button endIcon={<ArrowForward />} onClick={() => navigate('/marketplace')}>
                        View All
                    </Button>
                </Box>

                {loading ? (
                    <Grid container spacing={2}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Grid item xs={6} sm={4} md={2} key={i}>
                                <Skeleton height={160} sx={{ borderRadius: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        {recentProducts.map(product => (
                            <Grid item xs={6} sm={4} md={2} key={product.id}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                                    }}
                                    onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                >
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            height="100"
                                            image={product.images?.[0] || 'https://via.placeholder.com/200'}
                                            alt={product.productName}
                                        />
                                        {product.healthBadge && (
                                            <Chip
                                                icon={<Verified sx={{ fontSize: 12 }} />}
                                                label={`${Math.round(product.healthBadge * 100)}%`}
                                                color="success"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    fontSize: 10,
                                                    height: 20
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <CardContent sx={{ p: 1.5 }}>
                                        <Typography variant="body2" fontWeight={600} noWrap>
                                            {product.productName}
                                        </Typography>
                                        <Typography variant="body2" color="primary" fontWeight={600}>
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
    );
};

export default BuyerDashboard;
