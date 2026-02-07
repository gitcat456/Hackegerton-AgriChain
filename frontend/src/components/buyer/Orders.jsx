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
    Chip,
    Button,
    Avatar,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Rating,
    Skeleton,
    Divider
} from '@mui/material';
import {
    LocalShipping,
    CheckCircle,
    LockOpen,
    Star,
    Receipt
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const BuyerOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [reviewDialog, setReviewDialog] = useState({ open: false, order: null });
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        const loadOrders = async () => {
            if (user) {
                setLoading(true);
                const data = await mockApi.getBuyerOrders(user.id);
                setOrders(data);
                setLoading(false);
            }
        };
        loadOrders();
    }, [user]);

    const pendingOrders = orders.filter(o => o.status !== 'COMPLETED');
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');

    const handleConfirmReceipt = async () => {
        if (!reviewDialog.order) return;

        setConfirming(true);
        try {
            await mockApi.confirmReceipt(reviewDialog.order.id, rating, review);
            // Refresh orders
            const data = await mockApi.getBuyerOrders(user.id);
            setOrders(data);
            setReviewDialog({ open: false, order: null });
            setRating(5);
            setReview('');
        } catch (error) {
            console.error('Error confirming receipt:', error);
        } finally {
            setConfirming(false);
        }
    };

    const displayedOrders = tabValue === 0 ? pendingOrders : completedOrders;

    const OrderCard = ({ order }) => {
        const timelineSteps = ['Ordered', 'Paid', 'Dispatched', 'Received', 'Released'];
        const activeStep = order.timeline?.filter(t => t.completed).length || 0;
        const canConfirm = order.status === 'DISPATCHED' || (order.status === 'PAID' && activeStep >= 2);

        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {order.productName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Order #{order.id} • {order.orderDate}
                            </Typography>
                        </Box>
                        <Box textAlign="right">
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                KES {order.totalAmount?.toLocaleString()}
                            </Typography>
                            <StatusBadge status={order.status} />
                        </Box>
                    </Box>

                    {/* Details */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Quantity</Typography>
                            <Typography fontWeight={500}>{order.quantity} {order.unit}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Farmer</Typography>
                            <Typography fontWeight={500}>{order.farmerName}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Est. Delivery</Typography>
                            <Typography fontWeight={500}>{order.estimatedDelivery}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Escrow Status</Typography>
                            <StatusBadge status={order.escrowStatus} />
                        </Grid>
                    </Grid>

                    {/* Timeline */}
                    {order.timeline && order.status !== 'COMPLETED' && (
                        <Box sx={{ mb: 2 }}>
                            <Stepper activeStep={activeStep - 1} alternativeLabel>
                                {timelineSteps.map((step, index) => (
                                    <Step key={step} completed={order.timeline[index]?.completed}>
                                        <StepLabel>
                                            <Typography variant="caption">{step}</Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    )}

                    {/* Actions / Review */}
                    {order.status === 'COMPLETED' ? (
                        <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 2, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <CheckCircle color="success" />
                                <Typography fontWeight={600} color="success.dark">Order Completed</Typography>
                            </Box>
                            {order.buyerRating && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Rating value={order.buyerRating} readOnly size="small" />
                                    <Typography variant="body2" color="text.secondary">
                                        {order.buyerReview}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ) : canConfirm && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<LockOpen />}
                            onClick={() => setReviewDialog({ open: true, order })}
                        >
                            Confirm Receipt & Release Payment
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Orders
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Track your orders and manage deliveries
            </Typography>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                    <Tab
                        label={`Active Orders (${pendingOrders.length})`}
                        icon={<LocalShipping />}
                        iconPosition="start"
                    />
                    <Tab
                        label={`Completed (${completedOrders.length})`}
                        icon={<CheckCircle />}
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Content */}
            {loading ? (
                <Box>
                    {[1, 2].map(i => (
                        <Skeleton key={i} height={200} sx={{ mb: 2, borderRadius: 3 }} />
                    ))}
                </Box>
            ) : displayedOrders.length > 0 ? (
                displayedOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))
            ) : (
                <EmptyState
                    variant="orders"
                    title={tabValue === 0 ? "No active orders" : "No completed orders"}
                    message={tabValue === 0
                        ? "Browse the marketplace to place your first order."
                        : "Your completed orders will appear here."
                    }
                    action={tabValue === 0 ? () => navigate('/marketplace') : undefined}
                    actionLabel={tabValue === 0 ? "Browse Marketplace" : undefined}
                />
            )}

            {/* Review Dialog */}
            <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, order: null })} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Receipt & Leave Review</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        By confirming receipt, you agree that you've received the order in good condition.
                        The payment of <strong>KES {reviewDialog.order?.totalAmount?.toLocaleString()}</strong> will be released to the farmer.
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Typography fontWeight={500} gutterBottom>Rate your experience</Typography>
                        <Rating
                            value={rating}
                            onChange={(e, newValue) => setRating(newValue)}
                            size="large"
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Leave a review (optional)"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        multiline
                        rows={3}
                        placeholder="How was the quality? Would you buy again?"
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setReviewDialog({ open: false, order: null })}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleConfirmReceipt}
                        disabled={confirming}
                        startIcon={<LockOpen />}
                    >
                        {confirming ? 'Processing...' : 'Confirm & Release Payment'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BuyerOrders;
